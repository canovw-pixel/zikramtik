"""
Backend API tests for Coupon/Discount Code system
Tests: CRUD endpoints (admin), validate endpoint (public), order creation with coupon
"""
import pytest
import requests
import os
import uuid
from datetime import datetime, timezone, timedelta

BASE_URL = (os.environ.get('REACT_APP_BACKEND_URL') or 'https://zikra-atelier.preview.emergentagent.com').rstrip('/')

# ============= AUTH FIXTURE =============
@pytest.fixture(scope="module")
def admin_token():
    response = requests.post(
        f"{BASE_URL}/api/auth/login",
        json={"email": "admin@zikra.com", "password": "admin123"}
    )
    assert response.status_code == 200, f"Admin login failed: {response.text}"
    return response.json()["token"]


@pytest.fixture(scope="module")
def auth_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}", "Content-Type": "application/json"}


# ============= HELPER =============
def _unique_code(prefix="TEST"):
    return f"{prefix}{uuid.uuid4().hex[:6].upper()}"


def _create_coupon(auth_headers, payload):
    r = requests.post(f"{BASE_URL}/api/coupons", json=payload, headers=auth_headers)
    assert r.status_code == 200, f"Coupon create failed: {r.status_code} {r.text}"
    return r.json()


def _delete_coupon(auth_headers, coupon_id):
    try:
        requests.delete(f"{BASE_URL}/api/coupons/{coupon_id}", headers=auth_headers)
    except Exception:
        pass


# Track coupons created for cleanup
created_ids = []


@pytest.fixture(scope="module", autouse=True)
def cleanup(auth_headers):
    yield
    for cid in created_ids:
        _delete_coupon(auth_headers, cid)


# ============= ADMIN CRUD TESTS =============
class TestCouponCRUDAuth:
    def test_create_coupon_no_auth_returns_401(self):
        r = requests.post(f"{BASE_URL}/api/coupons", json={
            "code": "NOAUTHX1", "discount_type": "percent", "discount_value": 10
        })
        assert r.status_code in (401, 403), f"Expected 401/403, got {r.status_code}"

    def test_list_coupons_no_auth_returns_401(self):
        r = requests.get(f"{BASE_URL}/api/coupons")
        assert r.status_code in (401, 403)


class TestCouponCreate:
    def test_create_percent_coupon(self, auth_headers):
        code = _unique_code("PCT")
        payload = {
            "code": code,
            "discount_type": "percent",
            "discount_value": 10,
            "min_order_amount": 100,
            "description": "10% off",
        }
        data = _create_coupon(auth_headers, payload)
        created_ids.append(data["id"])
        assert data["code"] == code  # uppercased
        assert data["discount_type"] == "percent"
        assert data["discount_value"] == 10
        assert data["min_order_amount"] == 100
        assert data["used_count"] == 0
        assert data["active"] is True
        assert "_id" not in data

    def test_create_fixed_coupon_with_limits(self, auth_headers):
        code = _unique_code("FIX")
        valid_until = (datetime.now(timezone.utc) + timedelta(days=30)).isoformat()
        payload = {
            "code": code,
            "discount_type": "fixed",
            "discount_value": 50,
            "usage_limit": 5,
            "valid_until": valid_until,
        }
        data = _create_coupon(auth_headers, payload)
        created_ids.append(data["id"])
        assert data["discount_type"] == "fixed"
        assert data["usage_limit"] == 5

    def test_create_duplicate_code_returns_400(self, auth_headers):
        code = _unique_code("DUP")
        d = _create_coupon(auth_headers, {
            "code": code, "discount_type": "percent", "discount_value": 5
        })
        created_ids.append(d["id"])
        r = requests.post(f"{BASE_URL}/api/coupons", json={
            "code": code, "discount_type": "percent", "discount_value": 5
        }, headers=auth_headers)
        assert r.status_code == 400
        assert "zaten" in r.json().get("detail", "").lower()

    def test_list_coupons_returns_list(self, auth_headers):
        r = requests.get(f"{BASE_URL}/api/coupons", headers=auth_headers)
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)


# ============= VALIDATE TESTS =============
class TestCouponValidate:
    @pytest.fixture(scope="class")
    def percent_coupon(self, auth_headers):
        code = _unique_code("VPCT")
        d = _create_coupon(auth_headers, {
            "code": code, "discount_type": "percent",
            "discount_value": 10, "min_order_amount": 100
        })
        created_ids.append(d["id"])
        return d

    @pytest.fixture(scope="class")
    def fixed_coupon(self, auth_headers):
        code = _unique_code("VFIX")
        d = _create_coupon(auth_headers, {
            "code": code, "discount_type": "fixed",
            "discount_value": 50, "min_order_amount": 100
        })
        created_ids.append(d["id"])
        return d

    @pytest.fixture(scope="class")
    def capped_percent_coupon(self, auth_headers):
        code = _unique_code("VCAP")
        d = _create_coupon(auth_headers, {
            "code": code, "discount_type": "percent",
            "discount_value": 50, "max_discount": 30
        })
        created_ids.append(d["id"])
        return d

    def test_validate_percent_calculation(self, percent_coupon):
        r = requests.post(f"{BASE_URL}/api/coupons/validate", json={
            "code": percent_coupon["code"], "subtotal": 500
        })
        assert r.status_code == 200
        data = r.json()
        assert data["valid"] is True
        assert data["discount_amount"] == 50.0
        assert data["final_amount"] == 450.0

    def test_validate_case_insensitive(self, percent_coupon):
        r = requests.post(f"{BASE_URL}/api/coupons/validate", json={
            "code": percent_coupon["code"].lower(), "subtotal": 500
        })
        assert r.status_code == 200
        assert r.json()["valid"] is True

    def test_validate_fixed_calculation(self, fixed_coupon):
        r = requests.post(f"{BASE_URL}/api/coupons/validate", json={
            "code": fixed_coupon["code"], "subtotal": 500
        })
        assert r.status_code == 200
        data = r.json()
        assert data["discount_amount"] == 50.0
        assert data["final_amount"] == 450.0

    def test_validate_max_discount_cap(self, capped_percent_coupon):
        # 50% of 200 = 100 but max_discount = 30
        r = requests.post(f"{BASE_URL}/api/coupons/validate", json={
            "code": capped_percent_coupon["code"], "subtotal": 200
        })
        assert r.status_code == 200
        data = r.json()
        assert data["discount_amount"] == 30.0
        assert data["final_amount"] == 170.0

    def test_validate_below_min_order_amount(self, percent_coupon):
        r = requests.post(f"{BASE_URL}/api/coupons/validate", json={
            "code": percent_coupon["code"], "subtotal": 50
        })
        assert r.status_code == 400
        assert "minimum" in r.json()["detail"].lower()

    def test_validate_invalid_code(self):
        r = requests.post(f"{BASE_URL}/api/coupons/validate", json={
            "code": "DOESNOTEXIST_XYZ", "subtotal": 500
        })
        assert r.status_code == 404
        assert "gecersiz" in r.json()["detail"].lower()

    def test_validate_inactive_coupon(self, auth_headers):
        code = _unique_code("INA")
        d = _create_coupon(auth_headers, {
            "code": code, "discount_type": "percent", "discount_value": 10, "active": False
        })
        created_ids.append(d["id"])
        r = requests.post(f"{BASE_URL}/api/coupons/validate", json={
            "code": code, "subtotal": 500
        })
        assert r.status_code == 400
        assert "aktif" in r.json()["detail"].lower()

    def test_validate_expired_coupon(self, auth_headers):
        code = _unique_code("EXP")
        past = (datetime.now(timezone.utc) - timedelta(days=1)).isoformat()
        d = _create_coupon(auth_headers, {
            "code": code, "discount_type": "percent", "discount_value": 10,
            "valid_until": past
        })
        created_ids.append(d["id"])
        r = requests.post(f"{BASE_URL}/api/coupons/validate", json={
            "code": code, "subtotal": 500
        })
        assert r.status_code == 400
        assert "dolmus" in r.json()["detail"].lower() or "suresi" in r.json()["detail"].lower()

    def test_validate_usage_limit_reached(self, auth_headers):
        code = _unique_code("LIM")
        d = _create_coupon(auth_headers, {
            "code": code, "discount_type": "percent", "discount_value": 10,
            "usage_limit": 1
        })
        created_ids.append(d["id"])
        # Bump used_count to 1 by placing one order to exhaust limit
        order_payload = _sample_order_payload(d["code"])
        r0 = requests.post(f"{BASE_URL}/api/orders", json=order_payload)
        assert r0.status_code == 200
        # Now validate - should fail
        r = requests.post(f"{BASE_URL}/api/coupons/validate", json={
            "code": code, "subtotal": 500
        })
        assert r.status_code == 400
        assert "limit" in r.json()["detail"].lower()


# ============= ORDER + COUPON INTEGRATION =============
def _sample_order_payload(coupon_code=None, price=600):
    payload = {
        "products": [{
            "product_id": f"test-{uuid.uuid4().hex[:8]}",
            "name": "TEST_CouponProduct",
            "price": price, "currency": "TRY", "quantity": 1
        }],
        "country": {"code": "TR", "name": "Turkey", "currency": "TRY"},
        "shipping_address": {
            "full_name": "TEST_CouponCustomer", "address": "Addr", "city": "Istanbul",
            "state": "", "zip_code": "34000", "country": "Turkey", "phone": "+90 555 000 0000"
        },
        "billing_address": {
            "full_name": "TEST_CouponCustomer", "address": "Addr", "city": "Istanbul",
            "state": "", "zip_code": "34000", "country": "Turkey", "phone": "+90 555 000 0000"
        },
        "customer_email": "test@example.com"
    }
    if coupon_code:
        payload["coupon_code"] = coupon_code
    return payload


class TestOrderWithCoupon:
    @pytest.fixture(scope="class")
    def integration_coupon(self, auth_headers):
        code = _unique_code("ORD")
        d = _create_coupon(auth_headers, {
            "code": code, "discount_type": "percent",
            "discount_value": 10, "min_order_amount": 100, "usage_limit": 10
        })
        created_ids.append(d["id"])
        return d

    def test_create_order_with_coupon_applies_discount(self, auth_headers, integration_coupon):
        payload = _sample_order_payload(integration_coupon["code"], price=600)
        r = requests.post(f"{BASE_URL}/api/orders", json=payload)
        assert r.status_code == 200
        order = r.json()["order"]
        assert order["subtotal_amount"] == 600.0
        assert order["discount_amount"] == 60.0
        assert order["total_amount"] == 540.0
        assert order["coupon_code"] == integration_coupon["code"]

        # GET order and verify persistence
        gr = requests.get(f"{BASE_URL}/api/orders/{order['id']}")
        assert gr.status_code == 200
        fetched = gr.json()
        assert fetched["discount_amount"] == 60.0
        assert fetched["coupon_code"] == integration_coupon["code"]
        assert fetched["subtotal_amount"] == 600.0

    def test_coupon_used_count_increments(self, auth_headers, integration_coupon):
        # Get current used count
        r0 = requests.get(f"{BASE_URL}/api/coupons", headers=auth_headers)
        coupons = r0.json()
        before = next(c for c in coupons if c["id"] == integration_coupon["id"])["used_count"]

        # Place an order
        payload = _sample_order_payload(integration_coupon["code"], price=600)
        r = requests.post(f"{BASE_URL}/api/orders", json=payload)
        assert r.status_code == 200

        # Verify used_count incremented
        r1 = requests.get(f"{BASE_URL}/api/coupons", headers=auth_headers)
        after = next(c for c in r1.json() if c["id"] == integration_coupon["id"])["used_count"]
        assert after == before + 1

    def test_create_order_with_invalid_coupon_returns_error(self):
        payload = _sample_order_payload("BAD_NEVER_EXISTS", price=600)
        r = requests.post(f"{BASE_URL}/api/orders", json=payload)
        assert r.status_code in (400, 404)


# ============= UPDATE / DELETE =============
class TestCouponUpdateDelete:
    def test_update_coupon(self, auth_headers):
        code = _unique_code("UPD")
        d = _create_coupon(auth_headers, {
            "code": code, "discount_type": "percent", "discount_value": 10
        })
        cid = d["id"]
        r = requests.put(f"{BASE_URL}/api/coupons/{cid}",
                         json={"discount_value": 25, "active": False},
                         headers=auth_headers)
        assert r.status_code == 200
        data = r.json()
        assert data["discount_value"] == 25
        assert data["active"] is False
        created_ids.append(cid)

    def test_delete_coupon(self, auth_headers):
        code = _unique_code("DEL")
        d = _create_coupon(auth_headers, {
            "code": code, "discount_type": "fixed", "discount_value": 5
        })
        cid = d["id"]
        r = requests.delete(f"{BASE_URL}/api/coupons/{cid}", headers=auth_headers)
        assert r.status_code == 200
        # Verify gone
        r2 = requests.get(f"{BASE_URL}/api/coupons", headers=auth_headers)
        assert all(c["id"] != cid for c in r2.json())


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
