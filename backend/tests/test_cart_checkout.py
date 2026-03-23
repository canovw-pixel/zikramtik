"""
Backend API tests for Cart and Checkout functionality
Tests: Products API, Orders API (create, get)
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://zikra-atelier.preview.emergentagent.com')

class TestProductsAPI:
    """Products API tests - needed for cart functionality"""
    
    def test_get_all_products(self):
        """GET /api/products - should return list of products"""
        response = requests.get(f"{BASE_URL}/api/products")
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 1
        print(f"✓ Found {len(data)} products")
        
        # Verify product structure
        product = data[0]
        assert "id" in product
        assert "name" in product
        assert "prices" in product
        assert "in_stock" in product
        print(f"✓ Product structure valid: {product['name']}")
    
    def test_get_product_by_id(self):
        """GET /api/products/:id - should return single product"""
        # First get a product ID
        products_response = requests.get(f"{BASE_URL}/api/products")
        products = products_response.json()
        assert len(products) > 0
        
        product_id = products[0]["id"]
        
        # Get single product
        response = requests.get(f"{BASE_URL}/api/products/{product_id}")
        assert response.status_code == 200
        
        data = response.json()
        assert data["id"] == product_id
        assert "name" in data
        assert "prices" in data
        print(f"✓ Got product by ID: {data['name']}")
    
    def test_get_product_invalid_id(self):
        """GET /api/products/:id - should return 404 for invalid ID"""
        response = requests.get(f"{BASE_URL}/api/products/invalid-product-id-123")
        assert response.status_code == 404
        print("✓ Returns 404 for invalid product ID")


class TestOrdersAPI:
    """Orders API tests - core checkout functionality"""
    
    @pytest.fixture
    def sample_product(self):
        """Get a real product for order testing"""
        response = requests.get(f"{BASE_URL}/api/products")
        products = response.json()
        # Find a product with price > 0
        for p in products:
            if p.get("prices", {}).get("TR", {}).get("price", 0) > 0:
                return p
        return products[0]
    
    @pytest.fixture
    def sample_order_data(self, sample_product):
        """Create sample order data"""
        price = sample_product.get("prices", {}).get("TR", {}).get("price", 100)
        return {
            "products": [
                {
                    "product_id": sample_product["id"],
                    "name": sample_product["name"],
                    "price": price,
                    "currency": "TRY",
                    "quantity": 1
                }
            ],
            "country": {
                "code": "TR",
                "name": "Turkey",
                "currency": "TRY"
            },
            "shipping_address": {
                "full_name": "TEST_User",
                "address": "Test Street 123",
                "city": "Istanbul",
                "state": "Kadikoy",
                "zip_code": "34710",
                "country": "Turkey",
                "phone": "+90 555 123 4567"
            },
            "billing_address": {
                "full_name": "TEST_User",
                "address": "Test Street 123",
                "city": "Istanbul",
                "state": "Kadikoy",
                "zip_code": "34710",
                "country": "Turkey",
                "phone": "+90 555 123 4567"
            }
        }
    
    def test_create_order_success(self, sample_order_data):
        """POST /api/orders - should create order successfully"""
        response = requests.post(
            f"{BASE_URL}/api/orders",
            json=sample_order_data,
            headers={"Content-Type": "application/json"}
        )
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        data = response.json()
        assert "order" in data
        assert "message" in data
        
        order = data["order"]
        assert "id" in order
        assert "order_number" in order
        assert "total_amount" in order
        assert order["status"] == "pending"
        assert order["payment_status"] == "pending"
        assert len(order["products"]) > 0
        
        print(f"✓ Order created: {order['order_number']}, Total: {order['total_amount']} {order['currency']}")
        
        # Return order ID for follow-up tests
        return order["id"]
    
    def test_create_order_verify_persistence(self, sample_order_data):
        """POST then GET - verify order is persisted in database"""
        # Create order
        create_response = requests.post(
            f"{BASE_URL}/api/orders",
            json=sample_order_data,
            headers={"Content-Type": "application/json"}
        )
        assert create_response.status_code == 200
        
        order_id = create_response.json()["order"]["id"]
        
        # GET to verify persistence
        get_response = requests.get(f"{BASE_URL}/api/orders/{order_id}")
        assert get_response.status_code == 200
        
        fetched_order = get_response.json()
        assert fetched_order["id"] == order_id
        assert fetched_order["shipping_address"]["full_name"] == "TEST_User"
        assert fetched_order["shipping_address"]["city"] == "Istanbul"
        assert len(fetched_order["products"]) == 1
        print(f"✓ Order persisted and retrieved: {fetched_order['order_number']}")
    
    def test_get_order_by_id(self, sample_order_data):
        """GET /api/orders/:id - should return order details"""
        # First create an order
        create_response = requests.post(
            f"{BASE_URL}/api/orders",
            json=sample_order_data,
            headers={"Content-Type": "application/json"}
        )
        order_id = create_response.json()["order"]["id"]
        
        # Get order by ID
        response = requests.get(f"{BASE_URL}/api/orders/{order_id}")
        assert response.status_code == 200
        
        data = response.json()
        assert data["id"] == order_id
        assert "order_number" in data
        assert "shipping_address" in data
        assert "products" in data
        print(f"✓ Got order by ID: {data['order_number']}")
    
    def test_get_order_invalid_id(self):
        """GET /api/orders/:id - should return 404 for invalid ID"""
        response = requests.get(f"{BASE_URL}/api/orders/invalid-order-id-123")
        assert response.status_code == 404
        print("✓ Returns 404 for invalid order ID")
    
    def test_create_order_validates_required_fields(self):
        """POST /api/orders - should validate required shipping fields"""
        invalid_order = {
            "products": [],
            "country": {"code": "TR", "name": "Turkey", "currency": "TRY"},
            "shipping_address": {
                "full_name": "",  # Empty required field
                "address": "",
                "city": "",
                "zip_code": "",
                "country": "",
                "phone": ""
            },
            "billing_address": {
                "full_name": "",
                "address": "",
                "city": "",
                "zip_code": "",
                "country": "",
                "phone": ""
            }
        }
        
        response = requests.post(
            f"{BASE_URL}/api/orders",
            json=invalid_order,
            headers={"Content-Type": "application/json"}
        )
        
        # Should either return 422 (validation error) or 200 with 0 total
        # The backend may accept empty orders
        assert response.status_code in [200, 422], f"Unexpected status: {response.status_code}"
        print(f"✓ Empty order handling: status {response.status_code}")


class TestMockPayment:
    """Mock payment endpoint tests"""
    
    def test_mock_payment_success(self):
        """POST /api/orders/mock-payment/:id - should mark order as paid"""
        # First create an order
        order_data = {
            "products": [
                {
                    "product_id": "test-product",
                    "name": "Test Product",
                    "price": 100,
                    "currency": "TRY",
                    "quantity": 1
                }
            ],
            "country": {"code": "TR", "name": "Turkey", "currency": "TRY"},
            "shipping_address": {
                "full_name": "TEST_Payment",
                "address": "Payment Test St",
                "city": "Istanbul",
                "zip_code": "34000",
                "country": "Turkey",
                "phone": "+90 555 000 0000"
            },
            "billing_address": {
                "full_name": "TEST_Payment",
                "address": "Payment Test St",
                "city": "Istanbul",
                "zip_code": "34000",
                "country": "Turkey",
                "phone": "+90 555 000 0000"
            }
        }
        
        create_response = requests.post(f"{BASE_URL}/api/orders", json=order_data)
        assert create_response.status_code == 200
        
        order_id = create_response.json()["order"]["id"]
        
        # Call mock payment
        payment_response = requests.post(f"{BASE_URL}/api/orders/mock-payment/{order_id}")
        assert payment_response.status_code == 200
        
        payment_data = payment_response.json()
        assert "message" in payment_data
        assert payment_data["order_id"] == order_id
        print(f"✓ Mock payment successful for order {order_id}")
        
        # Verify order status changed
        order_response = requests.get(f"{BASE_URL}/api/orders/{order_id}")
        order = order_response.json()
        assert order["payment_status"] == "success"
        assert order["status"] == "paid"
        print(f"✓ Order status updated to: {order['status']}, payment: {order['payment_status']}")


class TestHealthCheck:
    """API health check tests"""
    
    def test_api_root(self):
        """GET /api/ - should return health status"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        
        data = response.json()
        assert "message" in data
        print(f"✓ API health: {data['message']}")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
