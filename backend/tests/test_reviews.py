"""Tests for Product Reviews system (verified-purchase reviews + admin moderation)."""
import os
import time
import uuid
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://zikra-atelier.preview.emergentagent.com').rstrip('/')
API = f"{BASE_URL}/api"

ADMIN_EMAIL = "admin@zikra.com"
ADMIN_PASSWORD = "admin123"
TEST_PRODUCT_ID = "prod-002"  # real product (Zikra Zikirmatik - Gümüş Hilal)


# ---------- Shared fixtures ----------
@pytest.fixture(scope="session")
def admin_token():
    r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=15)
    if r.status_code != 200:
        pytest.skip(f"Admin login failed: {r.status_code} {r.text}")
    return r.json().get("access_token") or r.json().get("token")


@pytest.fixture(scope="session")
def admin_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}", "Content-Type": "application/json"}


@pytest.fixture(scope="session")
def product_info():
    """Fetch real product to build OrderProduct payload"""
    r = requests.get(f"{API}/products/{TEST_PRODUCT_ID}", timeout=15)
    assert r.status_code == 200, f"Product {TEST_PRODUCT_ID} not found: {r.text}"
    p = r.json()
    # detect a price entry for TR
    name = p.get("name") or p.get("title") or "Zikra Zikirmatik"
    prices = p.get("prices") or {}
    tr = prices.get("TR") if isinstance(prices, dict) else None
    if isinstance(tr, dict):
        price = tr.get("price", 100)
        currency = tr.get("currency", "TRY")
    else:
        price = 100
        currency = "TRY"
    return {"id": TEST_PRODUCT_ID, "name": name, "price": float(price), "currency": currency}


def _build_order_payload(product_info, email):
    return {
        "products": [{
            "product_id": product_info["id"],
            "name": product_info["name"],
            "price": product_info["price"],
            "currency": product_info["currency"],
            "quantity": 1,
        }],
        "country": {"code": "TR", "name": "Türkiye", "currency": product_info["currency"]},
        "shipping_address": {
            "full_name": "TEST Reviewer",
            "address": "Test St 1",
            "city": "Istanbul",
            "zip_code": "34000",
            "country": "TR",
            "phone": "+905550000000",
        },
        "billing_address": {
            "full_name": "TEST Reviewer",
            "address": "Test St 1",
            "city": "Istanbul",
            "zip_code": "34000",
            "country": "TR",
            "phone": "+905550000000",
        },
        "customer_email": email,
    }


# ---------- Pending order (no payment) ----------
@pytest.fixture(scope="module")
def pending_order(product_info):
    email = f"TEST_pending_{uuid.uuid4().hex[:6]}@test.com"
    r = requests.post(f"{API}/orders", json=_build_order_payload(product_info, email), timeout=15)
    assert r.status_code in (200, 201), r.text
    order = r.json()["order"]
    return {"order": order, "email": email}


# ---------- Paid order (mock-payment applied) ----------
@pytest.fixture(scope="module")
def paid_order(product_info):
    email = f"TEST_paid_{uuid.uuid4().hex[:6]}@test.com"
    r = requests.post(f"{API}/orders", json=_build_order_payload(product_info, email), timeout=15)
    assert r.status_code in (200, 201), r.text
    order = r.json()["order"]
    pay = requests.post(f"{API}/orders/mock-payment/{order['id']}", timeout=15)
    assert pay.status_code == 200, pay.text
    return {"order": order, "email": email}


# =====================================================
# POST /api/reviews validation paths
# =====================================================
class TestCreateReviewValidation:
    def test_order_not_found_returns_404(self):
        r = requests.post(f"{API}/reviews", json={
            "product_id": TEST_PRODUCT_ID,
            "order_number": "ORD-NOPENOPE",
            "user_email": "x@x.com",
            "user_name": "X",
            "rating": 5,
            "comment": "Hello world review",
        }, timeout=15)
        assert r.status_code == 404
        assert "Sipariş bulunamadı" in r.json().get("detail", "")

    def test_email_mismatch_returns_403(self, paid_order):
        r = requests.post(f"{API}/reviews", json={
            "product_id": TEST_PRODUCT_ID,
            "order_number": paid_order["order"]["order_number"],
            "user_email": "wrong@example.com",
            "user_name": "Wrong",
            "rating": 5,
            "comment": "Hello world review",
        }, timeout=15)
        assert r.status_code == 403
        assert "yetki" in r.json().get("detail", "").lower()

    def test_pending_order_returns_400(self, pending_order):
        r = requests.post(f"{API}/reviews", json={
            "product_id": TEST_PRODUCT_ID,
            "order_number": pending_order["order"]["order_number"],
            "user_email": pending_order["email"],
            "user_name": "Pending Buyer",
            "rating": 4,
            "comment": "Pending order should fail",
        }, timeout=15)
        assert r.status_code == 400
        assert "ödenmiş" in r.json().get("detail", "") or "teslim" in r.json().get("detail", "")

    def test_product_not_in_order_returns_400(self, paid_order):
        r = requests.post(f"{API}/reviews", json={
            "product_id": "non-existent-product-id-zzz",
            "order_number": paid_order["order"]["order_number"],
            "user_email": paid_order["email"],
            "user_name": "Buyer",
            "rating": 5,
            "comment": "Bad product id",
        }, timeout=15)
        assert r.status_code == 400
        assert "siparişinizde yok" in r.json().get("detail", "")

    def test_rating_out_of_range_returns_422(self, paid_order):
        r = requests.post(f"{API}/reviews", json={
            "product_id": TEST_PRODUCT_ID,
            "order_number": paid_order["order"]["order_number"],
            "user_email": paid_order["email"],
            "user_name": "Buyer",
            "rating": 6,
            "comment": "Rating too high",
        }, timeout=15)
        assert r.status_code == 422

    def test_short_comment_returns_422(self, paid_order):
        r = requests.post(f"{API}/reviews", json={
            "product_id": TEST_PRODUCT_ID,
            "order_number": paid_order["order"]["order_number"],
            "user_email": paid_order["email"],
            "user_name": "Buyer",
            "rating": 5,
            "comment": "hi",
        }, timeout=15)
        assert r.status_code == 422


# =====================================================
# POST /api/reviews - happy path + duplicate
# =====================================================
class TestCreateReviewSuccess:
    def test_valid_purchase_creates_review(self, paid_order):
        r = requests.post(f"{API}/reviews", json={
            "product_id": TEST_PRODUCT_ID,
            "order_number": paid_order["order"]["order_number"],
            "user_email": paid_order["email"],
            "user_name": "Happy Buyer",
            "rating": 5,
            "title": "Great",
            "comment": "Çok güzel bir ürün, tavsiye ederim.",
        }, timeout=15)
        assert r.status_code == 200, r.text
        body = r.json()
        review = body.get("review", {})
        assert review.get("verified_purchase") is True
        assert review.get("approved") is True
        assert review.get("rating") == 5
        assert "user_email" not in review  # email stripped from response

    def test_duplicate_same_order_product_returns_400(self, paid_order):
        # The previous test already created a review; submitting again should fail
        r = requests.post(f"{API}/reviews", json={
            "product_id": TEST_PRODUCT_ID,
            "order_number": paid_order["order"]["order_number"],
            "user_email": paid_order["email"],
            "user_name": "Happy Buyer",
            "rating": 4,
            "comment": "Trying to double-review.",
        }, timeout=15)
        assert r.status_code == 400
        assert "zaten" in r.json().get("detail", "")


# =====================================================
# GET /api/reviews/product/{id} - public listing
# =====================================================
class TestPublicProductReviews:
    def test_public_listing_has_summary_and_no_email(self):
        r = requests.get(f"{API}/reviews/product/{TEST_PRODUCT_ID}", timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert data["product_id"] == TEST_PRODUCT_ID
        assert "count" in data and "average" in data and "distribution" in data
        # distribution keys 1..5
        for k in ["1", "2", "3", "4", "5"]:
            assert k in data["distribution"]
        # ensure no email field exposed
        for rv in data.get("reviews", []):
            assert "user_email" not in rv
            assert "user_name" in rv
            assert "rating" in rv

    def test_only_approved_reviews_listed_publicly(self, admin_headers):
        # find any approved review for prod-002 and hide it; ensure it disappears from public
        list_r = requests.get(f"{API}/reviews", params={"product_id": TEST_PRODUCT_ID, "approved": "true"}, headers=admin_headers, timeout=15)
        assert list_r.status_code == 200
        approved = list_r.json()
        if not approved:
            pytest.skip("No approved review for prod-002 to hide-test against")
        rid = approved[0]["id"]
        # hide
        h = requests.put(f"{API}/reviews/{rid}/approve", params={"approved": "false"}, headers=admin_headers, timeout=15)
        assert h.status_code == 200
        pub = requests.get(f"{API}/reviews/product/{TEST_PRODUCT_ID}", timeout=15)
        ids = [r["id"] for r in pub.json().get("reviews", [])]
        assert rid not in ids
        # restore
        requests.put(f"{API}/reviews/{rid}/approve", params={"approved": "true"}, headers=admin_headers, timeout=15)


# =====================================================
# Admin endpoints
# =====================================================
class TestAdminReviews:
    def test_list_all_requires_auth(self):
        r = requests.get(f"{API}/reviews", timeout=15)
        assert r.status_code in (401, 403)

    def test_admin_can_list_all(self, admin_headers):
        r = requests.get(f"{API}/reviews", headers=admin_headers, timeout=15)
        assert r.status_code == 200
        rows = r.json()
        assert isinstance(rows, list)
        if rows:
            # admin sees email
            assert "user_email" in rows[0]

    def test_filter_by_product(self, admin_headers):
        r = requests.get(f"{API}/reviews", params={"product_id": TEST_PRODUCT_ID}, headers=admin_headers, timeout=15)
        assert r.status_code == 200
        for rv in r.json():
            assert rv["product_id"] == TEST_PRODUCT_ID

    def test_filter_by_approved_false(self, admin_headers):
        r = requests.get(f"{API}/reviews", params={"approved": "false"}, headers=admin_headers, timeout=15)
        assert r.status_code == 200
        for rv in r.json():
            assert rv["approved"] is False

    def test_approve_toggle_then_delete(self, admin_headers, product_info):
        # Create a fresh order+review to mutate
        email = f"TEST_admin_{uuid.uuid4().hex[:6]}@test.com"
        oc = requests.post(f"{API}/orders", json=_build_order_payload(product_info, email), timeout=15)
        assert oc.status_code in (200, 201)
        order = oc.json()["order"]
        requests.post(f"{API}/orders/mock-payment/{order['id']}", timeout=15)
        # create review
        rv = requests.post(f"{API}/reviews", json={
            "product_id": TEST_PRODUCT_ID,
            "order_number": order["order_number"],
            "user_email": email,
            "user_name": "Mod Tester",
            "rating": 4,
            "comment": "Moderation flow test review.",
        }, timeout=15)
        assert rv.status_code == 200, rv.text
        rid = rv.json()["review"]["id"]

        # Hide
        h = requests.put(f"{API}/reviews/{rid}/approve", params={"approved": "false"}, headers=admin_headers, timeout=15)
        assert h.status_code == 200
        assert h.json()["approved"] is False
        # Verify hidden -> not in public
        pub = requests.get(f"{API}/reviews/product/{TEST_PRODUCT_ID}", timeout=15)
        assert rid not in [r["id"] for r in pub.json().get("reviews", [])]

        # Re-approve
        a = requests.put(f"{API}/reviews/{rid}/approve", params={"approved": "true"}, headers=admin_headers, timeout=15)
        assert a.status_code == 200
        assert a.json()["approved"] is True

        # Delete
        d = requests.delete(f"{API}/reviews/{rid}", headers=admin_headers, timeout=15)
        assert d.status_code == 200
        # confirm delete via admin list filter
        chk = requests.get(f"{API}/reviews", params={"product_id": TEST_PRODUCT_ID}, headers=admin_headers, timeout=15)
        assert rid not in [r["id"] for r in chk.json()]

    def test_delete_nonexistent_returns_404(self, admin_headers):
        r = requests.delete(f"{API}/reviews/does-not-exist-xyz", headers=admin_headers, timeout=15)
        assert r.status_code == 404
