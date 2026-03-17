"""
Backend API tests for Admin Order Management, Order Tracking, and Shipping features
Tests: Order Stats API, Order Filtering, Shipping Update, Order Tracking (public)
"""
import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://craponia-commerce.preview.emergentagent.com')

# ============= AUTH FIXTURES =============
@pytest.fixture(scope="module")
def admin_token():
    """Get admin authentication token"""
    response = requests.post(
        f"{BASE_URL}/api/auth/login",
        json={"email": "admin@zikra.com", "password": "admin123"}
    )
    assert response.status_code == 200, f"Admin login failed: {response.text}"
    return response.json()["token"]

@pytest.fixture(scope="module")
def auth_headers(admin_token):
    """Return auth headers for authenticated requests"""
    return {"Authorization": f"Bearer {admin_token}", "Content-Type": "application/json"}


# ============= ORDER STATS TESTS =============
class TestOrderStats:
    """Tests for GET /api/orders/stats/summary endpoint"""
    
    def test_get_order_stats_authenticated(self, auth_headers):
        """GET /api/orders/stats/summary - should return order counts by status"""
        response = requests.get(f"{BASE_URL}/api/orders/stats/summary", headers=auth_headers)
        assert response.status_code == 200
        
        data = response.json()
        # Verify all expected fields
        assert "total" in data
        assert "pending" in data
        assert "shipped" in data
        assert "delivered" in data
        assert "cancelled" in data
        
        # All values should be non-negative integers
        assert isinstance(data["total"], int)
        assert data["total"] >= 0
        assert data["pending"] >= 0
        assert data["shipped"] >= 0
        assert data["delivered"] >= 0
        assert data["cancelled"] >= 0
        
        # Sum of statuses should approximately equal total (some statuses may be excluded like 'paid')
        print(f"✓ Order stats: total={data['total']}, pending={data['pending']}, shipped={data['shipped']}, delivered={data['delivered']}, cancelled={data['cancelled']}")
    
    def test_get_order_stats_unauthorized(self):
        """GET /api/orders/stats/summary - should require authentication"""
        response = requests.get(f"{BASE_URL}/api/orders/stats/summary")
        assert response.status_code == 401, f"Expected 401 for unauthorized, got {response.status_code}"
        print("✓ Stats endpoint requires authentication")


# ============= ORDER FILTERING TESTS =============
class TestOrderFiltering:
    """Tests for GET /api/orders with status filters"""
    
    def test_get_all_orders(self, auth_headers):
        """GET /api/orders - should return paginated list of all orders"""
        response = requests.get(f"{BASE_URL}/api/orders", headers=auth_headers)
        assert response.status_code == 200
        
        data = response.json()
        assert "orders" in data
        assert "total" in data
        assert isinstance(data["orders"], list)
        print(f"✓ Got {len(data['orders'])} orders (total: {data['total']})")
    
    def test_filter_orders_by_status_pending(self, auth_headers):
        """GET /api/orders?status=pending - should return only pending orders"""
        response = requests.get(f"{BASE_URL}/api/orders?status=pending", headers=auth_headers)
        assert response.status_code == 200
        
        data = response.json()
        orders = data.get("orders", [])
        # All returned orders should have status=pending
        for order in orders:
            assert order["status"] == "pending", f"Expected pending, got {order['status']}"
        print(f"✓ Filtered pending orders: {len(orders)} results")
    
    def test_filter_orders_by_status_shipped(self, auth_headers):
        """GET /api/orders?status=shipped - should return only shipped orders"""
        response = requests.get(f"{BASE_URL}/api/orders?status=shipped", headers=auth_headers)
        assert response.status_code == 200
        
        data = response.json()
        orders = data.get("orders", [])
        for order in orders:
            assert order["status"] == "shipped"
        print(f"✓ Filtered shipped orders: {len(orders)} results")
    
    def test_filter_orders_by_status_delivered(self, auth_headers):
        """GET /api/orders?status=delivered - should return only delivered orders"""
        response = requests.get(f"{BASE_URL}/api/orders?status=delivered", headers=auth_headers)
        assert response.status_code == 200
        
        data = response.json()
        orders = data.get("orders", [])
        for order in orders:
            assert order["status"] == "delivered"
        print(f"✓ Filtered delivered orders: {len(orders)} results")
    
    def test_filter_orders_by_status_cancelled(self, auth_headers):
        """GET /api/orders?status=cancelled - should return only cancelled orders"""
        response = requests.get(f"{BASE_URL}/api/orders?status=cancelled", headers=auth_headers)
        assert response.status_code == 200
        
        data = response.json()
        orders = data.get("orders", [])
        for order in orders:
            assert order["status"] == "cancelled"
        print(f"✓ Filtered cancelled orders: {len(orders)} results")
    
    def test_orders_unauthorized(self):
        """GET /api/orders - should require authentication"""
        response = requests.get(f"{BASE_URL}/api/orders")
        assert response.status_code == 401
        print("✓ Orders list requires authentication")


# ============= ORDER TRACKING (PUBLIC) TESTS =============
class TestOrderTracking:
    """Tests for GET /api/orders/track/{order_number} - PUBLIC endpoint"""
    
    @pytest.fixture
    def test_order_number(self, auth_headers):
        """Get a valid order number for testing"""
        response = requests.get(f"{BASE_URL}/api/orders", headers=auth_headers)
        assert response.status_code == 200
        orders = response.json().get("orders", [])
        assert len(orders) > 0, "No orders found for testing"
        return orders[0]["order_number"]
    
    def test_track_order_valid(self, test_order_number):
        """GET /api/orders/track/{order_number} - should return order tracking info (no auth)"""
        response = requests.get(f"{BASE_URL}/api/orders/track/{test_order_number}")
        assert response.status_code == 200
        
        data = response.json()
        # Verify tracking info fields
        assert data["order_number"] == test_order_number
        assert "status" in data
        assert "tracking_number" in data
        assert "cargo_company" in data
        assert "shipped_at" in data
        assert "total_amount" in data
        assert "products" in data
        assert "shipping_address" in data
        assert "created_at" in data
        
        print(f"✓ Tracked order {test_order_number}, status: {data['status']}")
    
    def test_track_order_invalid(self):
        """GET /api/orders/track/{invalid} - should return 404 for non-existent order"""
        response = requests.get(f"{BASE_URL}/api/orders/track/ORD-INVALID99999")
        assert response.status_code == 404
        
        data = response.json()
        assert "detail" in data
        assert "bulunamadi" in data["detail"].lower()
        print("✓ Returns 404 for invalid order number")
    
    def test_track_order_no_auth_required(self, test_order_number):
        """Verify tracking endpoint works WITHOUT authentication"""
        # No headers at all
        response = requests.get(f"{BASE_URL}/api/orders/track/{test_order_number}")
        assert response.status_code == 200
        print("✓ Tracking endpoint is public (no auth required)")


# ============= SHIPPING UPDATE TESTS =============
class TestShippingUpdate:
    """Tests for PUT /api/orders/{id}/shipping endpoint"""
    
    @pytest.fixture
    def test_pending_order(self, auth_headers):
        """Create a test order for shipping update"""
        order_data = {
            "products": [
                {
                    "product_id": f"test-{uuid.uuid4().hex[:8]}",
                    "name": "TEST_ShippingProduct",
                    "price": 100,
                    "currency": "TRY",
                    "quantity": 1
                }
            ],
            "country": {"code": "TR", "name": "Turkey", "currency": "TRY"},
            "shipping_address": {
                "full_name": "TEST_ShippingCustomer",
                "address": "Test Shipping Address",
                "city": "Istanbul",
                "state": "Kadikoy",
                "zip_code": "34710",
                "country": "Turkey",
                "phone": "+90 555 000 0001"
            },
            "billing_address": {
                "full_name": "TEST_ShippingCustomer",
                "address": "Test Shipping Address",
                "city": "Istanbul",
                "state": "Kadikoy",
                "zip_code": "34710",
                "country": "Turkey",
                "phone": "+90 555 000 0001"
            },
            "customer_email": "test@example.com"
        }
        
        create_response = requests.post(f"{BASE_URL}/api/orders", json=order_data)
        assert create_response.status_code == 200
        order = create_response.json()["order"]
        return order
    
    def test_update_shipping_success(self, auth_headers, test_pending_order):
        """PUT /api/orders/{id}/shipping - should update tracking info and set status to shipped"""
        order_id = test_pending_order["id"]
        
        shipping_data = {
            "tracking_number": f"TRK{uuid.uuid4().hex[:10].upper()}",
            "cargo_company": "Yurtici Kargo"
        }
        
        response = requests.put(
            f"{BASE_URL}/api/orders/{order_id}/shipping",
            json=shipping_data,
            headers=auth_headers
        )
        assert response.status_code == 200
        
        data = response.json()
        # Verify order fields updated
        assert "order" in data
        order = data["order"]
        assert order["status"] == "shipped"
        assert order["tracking_number"] == shipping_data["tracking_number"]
        assert order["cargo_company"] == shipping_data["cargo_company"]
        assert order["shipped_at"] is not None
        
        # Verify email notification result
        assert "email_notification" in data
        email_result = data["email_notification"]
        assert email_result["sent"] == True
        assert email_result["mock"] == True
        assert email_result["tracking_number"] == shipping_data["tracking_number"]
        assert email_result["cargo_company"] == shipping_data["cargo_company"]
        
        print(f"✓ Shipping updated: tracking={shipping_data['tracking_number']}, email sent (MOCK)")
    
    def test_update_shipping_unauthorized(self):
        """PUT /api/orders/{id}/shipping - should require authentication"""
        response = requests.put(
            f"{BASE_URL}/api/orders/some-order-id/shipping",
            json={"tracking_number": "123", "cargo_company": "Test"}
        )
        assert response.status_code == 401
        print("✓ Shipping update requires authentication")
    
    def test_update_shipping_invalid_order(self, auth_headers):
        """PUT /api/orders/{invalid_id}/shipping - should return 404"""
        response = requests.put(
            f"{BASE_URL}/api/orders/invalid-order-id-12345/shipping",
            json={"tracking_number": "TRK123", "cargo_company": "Test Kargo"},
            headers=auth_headers
        )
        assert response.status_code == 404
        print("✓ Returns 404 for invalid order ID")


# ============= ORDER STATUS UPDATE TESTS =============
class TestOrderStatusUpdate:
    """Tests for PUT /api/orders/{id}/status endpoint"""
    
    @pytest.fixture
    def test_order_for_status(self, auth_headers):
        """Create a test order for status changes"""
        order_data = {
            "products": [
                {
                    "product_id": f"test-{uuid.uuid4().hex[:8]}",
                    "name": "TEST_StatusProduct",
                    "price": 50,
                    "currency": "TRY",
                    "quantity": 1
                }
            ],
            "country": {"code": "TR", "name": "Turkey", "currency": "TRY"},
            "shipping_address": {
                "full_name": "TEST_StatusCustomer",
                "address": "Test Status Address",
                "city": "Ankara",
                "state": "",
                "zip_code": "06000",
                "country": "Turkey",
                "phone": "+90 555 000 0002"
            },
            "billing_address": {
                "full_name": "TEST_StatusCustomer",
                "address": "Test Status Address",
                "city": "Ankara",
                "state": "",
                "zip_code": "06000",
                "country": "Turkey",
                "phone": "+90 555 000 0002"
            }
        }
        
        create_response = requests.post(f"{BASE_URL}/api/orders", json=order_data)
        assert create_response.status_code == 200
        return create_response.json()["order"]
    
    def test_update_status_to_cancelled(self, auth_headers, test_order_for_status):
        """PUT /api/orders/{id}/status - should update status to cancelled"""
        order_id = test_order_for_status["id"]
        
        response = requests.put(
            f"{BASE_URL}/api/orders/{order_id}/status",
            json={"status": "cancelled"},
            headers=auth_headers
        )
        assert response.status_code == 200
        
        data = response.json()
        assert data["status"] == "cancelled"
        
        # Verify via GET
        get_response = requests.get(f"{BASE_URL}/api/orders/{order_id}")
        assert get_response.json()["status"] == "cancelled"
        
        print(f"✓ Order {order_id[:8]}... status changed to cancelled")
    
    def test_update_status_to_delivered(self, auth_headers, test_pending_order):
        """Test changing a shipped order to delivered"""
        # First create order and ship it
        order_data = {
            "products": [{"product_id": "test", "name": "TEST_DeliverProduct", "price": 25, "currency": "TRY", "quantity": 1}],
            "country": {"code": "TR", "name": "Turkey", "currency": "TRY"},
            "shipping_address": {
                "full_name": "TEST_Deliver",
                "address": "Deliver Address",
                "city": "Izmir",
                "state": "",
                "zip_code": "35000",
                "country": "Turkey",
                "phone": "+90 555 000 0003"
            },
            "billing_address": {
                "full_name": "TEST_Deliver",
                "address": "Deliver Address",
                "city": "Izmir",
                "state": "",
                "zip_code": "35000",
                "country": "Turkey",
                "phone": "+90 555 000 0003"
            }
        }
        create_response = requests.post(f"{BASE_URL}/api/orders", json=order_data)
        order_id = create_response.json()["order"]["id"]
        
        # Ship it first
        ship_response = requests.put(
            f"{BASE_URL}/api/orders/{order_id}/shipping",
            json={"tracking_number": "TRK999", "cargo_company": "Aras Kargo"},
            headers=auth_headers
        )
        assert ship_response.status_code == 200
        
        # Now mark as delivered
        response = requests.put(
            f"{BASE_URL}/api/orders/{order_id}/status",
            json={"status": "delivered"},
            headers=auth_headers
        )
        assert response.status_code == 200
        assert response.json()["status"] == "delivered"
        
        print(f"✓ Order {order_id[:8]}... shipped then delivered")
    
    def test_update_status_unauthorized(self):
        """PUT /api/orders/{id}/status - should require authentication"""
        response = requests.put(
            f"{BASE_URL}/api/orders/some-id/status",
            json={"status": "cancelled"}
        )
        assert response.status_code == 401
        print("✓ Status update requires authentication")


# ============= FIXTURE FOR test_update_status_to_delivered =============
@pytest.fixture
def test_pending_order(auth_headers):
    """Create a test order for shipping update"""
    order_data = {
        "products": [
            {
                "product_id": f"test-{uuid.uuid4().hex[:8]}",
                "name": "TEST_ShippingProduct",
                "price": 100,
                "currency": "TRY",
                "quantity": 1
            }
        ],
        "country": {"code": "TR", "name": "Turkey", "currency": "TRY"},
        "shipping_address": {
            "full_name": "TEST_ShippingCustomer",
            "address": "Test Shipping Address",
            "city": "Istanbul",
            "state": "Kadikoy",
            "zip_code": "34710",
            "country": "Turkey",
            "phone": "+90 555 000 0001"
        },
        "billing_address": {
            "full_name": "TEST_ShippingCustomer",
            "address": "Test Shipping Address",
            "city": "Istanbul",
            "state": "Kadikoy",
            "zip_code": "34710",
            "country": "Turkey",
            "phone": "+90 555 000 0001"
        },
        "customer_email": "test@example.com"
    }
    
    create_response = requests.post(f"{BASE_URL}/api/orders", json=order_data)
    assert create_response.status_code == 200
    order = create_response.json()["order"]
    return order


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
