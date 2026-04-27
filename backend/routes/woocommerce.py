from fastapi import APIRouter, HTTPException, Request, Query, Depends
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from database import db
from datetime import datetime, timezone
from typing import Optional
import os
import secrets
import logging

logger = logging.getLogger(__name__)

router = APIRouter(tags=["WooCommerce Compatible API"])

# WooCommerce API credentials - loaded lazily
def _get_wc_credentials():
    key = os.environ.get("WC_CONSUMER_KEY")
    secret = os.environ.get("WC_CONSUMER_SECRET")
    return key, secret

security = HTTPBasic()


def verify_wc_auth(credentials: HTTPBasicCredentials = Depends(security)):
    """Verify WooCommerce API authentication (Basic Auth with consumer key/secret)"""
    WC_CONSUMER_KEY, WC_CONSUMER_SECRET = _get_wc_credentials()
    if not WC_CONSUMER_KEY or not WC_CONSUMER_SECRET:
        raise HTTPException(status_code=500, detail="WooCommerce API not configured")

    key_ok = secrets.compare_digest(credentials.username, WC_CONSUMER_KEY)
    secret_ok = secrets.compare_digest(credentials.password, WC_CONSUMER_SECRET)

    if not (key_ok and secret_ok):
        raise HTTPException(status_code=401, detail="Invalid API credentials")
    return True


def _map_status_to_wc(status: str, payment_status: str) -> str:
    """Map internal order status to WooCommerce status"""
    if payment_status == "failed":
        return "failed"
    status_map = {
        "pending": "pending",
        "paid": "processing",
        "processing": "processing",
        "shipped": "completed",
        "delivered": "completed",
        "cancelled": "cancelled",
        "payment_failed": "failed",
    }
    return status_map.get(status, "pending")


def _map_wc_status_to_internal(wc_status: str) -> str:
    """Map WooCommerce status to internal status"""
    wc_map = {
        "pending": "pending",
        "processing": "paid",
        "on-hold": "pending",
        "completed": "shipped",
        "cancelled": "cancelled",
        "refunded": "cancelled",
        "failed": "payment_failed",
    }
    return wc_map.get(wc_status, "pending")


def _order_to_wc_format(order: dict) -> dict:
    """Convert internal order to WooCommerce API format"""
    shipping = order.get("shipping_address", {})
    billing = order.get("billing_address", shipping)
    products = order.get("products", [])
    status = order.get("status", "pending")
    payment_status = order.get("payment_status", "pending")

    # Build line_items
    line_items = []
    for i, item in enumerate(products):
        line_items.append({
            "id": i + 1,
            "name": item.get("name", ""),
            "product_id": hash(item.get("product_id", "")) % 100000,
            "quantity": item.get("quantity", 1),
            "price": str(item.get("price", 0)),
            "subtotal": str(item.get("price", 0) * item.get("quantity", 1)),
            "total": str(item.get("price", 0) * item.get("quantity", 1)),
            "sku": item.get("product_id", ""),
            "tax_class": "",
            "subtotal_tax": "0.00",
            "total_tax": "0.00",
        })

    # Parse full_name into first/last
    full_name = shipping.get("full_name", "")
    name_parts = full_name.split(" ", 1)
    first_name = name_parts[0] if name_parts else ""
    last_name = name_parts[1] if len(name_parts) > 1 else ""

    created_at = order.get("created_at")
    if isinstance(created_at, datetime):
        date_created = created_at.isoformat()
    elif isinstance(created_at, str):
        date_created = created_at
    else:
        date_created = datetime.now(timezone.utc).isoformat()

    updated_at = order.get("updated_at")
    if isinstance(updated_at, datetime):
        date_modified = updated_at.isoformat()
    elif isinstance(updated_at, str):
        date_modified = updated_at
    else:
        date_modified = date_created

    wc_order = {
        "id": abs(hash(order.get("id", ""))) % 1000000,
        "parent_id": 0,
        "number": order.get("order_number", ""),
        "order_key": f"wc_order_{order.get('id', '')}",
        "created_via": "checkout",
        "version": "7.0.0",
        "status": _map_status_to_wc(status, payment_status),
        "currency": order.get("currency", "TRY"),
        "date_created": date_created,
        "date_created_gmt": date_created,
        "date_modified": date_modified,
        "date_modified_gmt": date_modified,
        "discount_total": "0.00",
        "discount_tax": "0.00",
        "shipping_total": "0.00",
        "shipping_tax": "0.00",
        "cart_tax": "0.00",
        "total": str(order.get("total_amount", 0)),
        "total_tax": "0.00",
        "prices_include_tax": True,
        "customer_id": 0,
        "customer_ip_address": "",
        "customer_user_agent": "",
        "customer_note": "",
        "billing": {
            "first_name": first_name,
            "last_name": last_name,
            "company": "",
            "address_1": billing.get("address", ""),
            "address_2": "",
            "city": billing.get("city", ""),
            "state": billing.get("state", ""),
            "postcode": billing.get("zip_code", ""),
            "country": order.get("country", {}).get("code", "TR"),
            "email": order.get("customer_email", ""),
            "phone": billing.get("phone", ""),
        },
        "shipping": {
            "first_name": first_name,
            "last_name": last_name,
            "company": "",
            "address_1": shipping.get("address", ""),
            "address_2": "",
            "city": shipping.get("city", ""),
            "state": shipping.get("state", ""),
            "postcode": shipping.get("zip_code", ""),
            "country": order.get("country", {}).get("code", "TR"),
        },
        "payment_method": "paytr",
        "payment_method_title": "PayTR",
        "transaction_id": order.get("payment_id", ""),
        "date_paid": order.get("paid_at", None),
        "date_paid_gmt": order.get("paid_at", None),
        "date_completed": order.get("shipped_at", None),
        "date_completed_gmt": order.get("shipped_at", None),
        "line_items": line_items,
        "tax_lines": [],
        "shipping_lines": [
            {
                "id": 1,
                "method_title": order.get("cargo_company", "Kargo"),
                "method_id": "flat_rate",
                "total": "0.00",
                "total_tax": "0.00",
            }
        ],
        "fee_lines": [],
        "coupon_lines": [],
        "refunds": [],
        "meta_data": [
            {"id": 1, "key": "_internal_order_id", "value": order.get("id", "")},
            {"id": 2, "key": "_order_number", "value": order.get("order_number", "")},
            {"id": 3, "key": "_tracking_number", "value": order.get("tracking_number", "")},
            {"id": 4, "key": "_cargo_company", "value": order.get("cargo_company", "")},
        ],
        "_links": {
            "self": [{"href": f"/wp-json/wc/v3/orders/{abs(hash(order.get('id', ''))) % 1000000}"}],
        },
    }

    return wc_order


@router.get("/wp-json/wc/v3/orders")
async def wc_list_orders(
    status: Optional[str] = Query(None),
    after: Optional[str] = Query(None),
    before: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1, le=100),
    order: str = Query("desc"),
    orderby: str = Query("date"),
    auth: bool = Depends(verify_wc_auth),
):
    """WooCommerce compatible - List orders"""
    query = {}

    # Filter by status
    if status:
        wc_to_internal = {
            "pending": {"status": "pending"},
            "processing": {"payment_status": "success", "status": {"$in": ["paid", "processing"]}},
            "completed": {"status": {"$in": ["shipped", "delivered"]}},
            "cancelled": {"status": "cancelled"},
            "failed": {"payment_status": "failed"},
        }
        if status in wc_to_internal:
            query.update(wc_to_internal[status])

    # Filter by date
    if after:
        try:
            after_dt = datetime.fromisoformat(after.replace("Z", "+00:00"))
            query["created_at"] = {"$gte": after_dt}
        except (ValueError, TypeError):
            pass

    if before:
        try:
            before_dt = datetime.fromisoformat(before.replace("Z", "+00:00"))
            if "created_at" in query:
                query["created_at"]["$lte"] = before_dt
            else:
                query["created_at"] = {"$lte": before_dt}
        except (ValueError, TypeError):
            pass

    skip = (page - 1) * per_page
    sort_dir = -1 if order == "desc" else 1

    orders = await db.orders.find(query, {"_id": 0}).skip(skip).limit(per_page).sort("created_at", sort_dir).to_list(per_page)
    total = await db.orders.count_documents(query)

    wc_orders = [_order_to_wc_format(o) for o in orders]

    logger.info(f"WC API: Listed {len(wc_orders)} orders (page {page}, total {total})")
    return wc_orders


@router.get("/wp-json/wc/v3/orders/{order_id}")
async def wc_get_order(
    order_id: int,
    auth: bool = Depends(verify_wc_auth),
):
    """WooCommerce compatible - Get single order"""
    # Search by hash-based ID across all orders
    orders = await db.orders.find({}, {"_id": 0}).to_list(1000)

    for o in orders:
        wc_id = abs(hash(o.get("id", ""))) % 1000000
        if wc_id == order_id:
            logger.info(f"WC API: Found order {order_id} -> {o.get('order_number')}")
            return _order_to_wc_format(o)

    raise HTTPException(status_code=404, detail="Order not found")


@router.put("/wp-json/wc/v3/orders/{order_id}")
async def wc_update_order(
    order_id: int,
    request: Request,
    auth: bool = Depends(verify_wc_auth),
):
    """WooCommerce compatible - Update order (status, etc.)"""
    body = await request.json()
    new_status = body.get("status")

    # Find order by WC ID
    orders = await db.orders.find({}, {"_id": 0}).to_list(1000)
    target_order = None

    for o in orders:
        wc_id = abs(hash(o.get("id", ""))) % 1000000
        if wc_id == order_id:
            target_order = o
            break

    if not target_order:
        raise HTTPException(status_code=404, detail="Order not found")

    internal_id = target_order.get("id")
    now = datetime.now(timezone.utc)
    update_data = {"updated_at": now}

    if new_status:
        internal_status = _map_wc_status_to_internal(new_status)
        update_data["status"] = internal_status

        if new_status == "completed":
            update_data["shipped_at"] = now.isoformat()

    await db.orders.update_one({"id": internal_id}, {"$set": update_data})

    updated = await db.orders.find_one({"id": internal_id}, {"_id": 0})
    logger.info(f"WC API: Updated order {order_id} -> status: {new_status}")
    return _order_to_wc_format(updated)


@router.get("/wp-json/wc/v3")
async def wc_api_root(auth: bool = Depends(verify_wc_auth)):
    """WooCommerce API root - returns store info"""
    return {
        "store": {
            "name": "Zikra - Craponia Atelier",
            "description": "Zikirmatik & Aksesuar",
            "URL": "https://zikramatik.com",
            "wc_version": "7.0.0",
            "version": "7.0.0",
        },
        "routes": {
            "/wc/v3/orders": {
                "methods": ["GET", "POST"],
            },
            "/wc/v3/orders/<id>": {
                "methods": ["GET", "PUT", "DELETE"],
            },
        },
    }


@router.get("/wp-json/wc/v3/system_status")
async def wc_system_status(auth: bool = Depends(verify_wc_auth)):
    """WooCommerce system status endpoint"""
    return {
        "environment": {
            "home_url": "https://zikramatik.com",
            "site_url": "https://zikramatik.com",
            "wc_version": "7.0.0",
            "wp_version": "6.4",
        },
        "settings": {
            "currency": "TRY",
            "currency_symbol": "₺",
            "currency_position": "right_space",
            "thousand_separator": ".",
            "decimal_separator": ",",
            "number_of_decimals": 2,
        },
    }
