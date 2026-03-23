#!/usr/bin/env python3
"""
Zikra Zikirmatik Backend API Test Suite
Tests all core API endpoints with real data validation
"""

import requests
import json
import sys
from datetime import datetime
import os

# Backend URL from frontend .env
BACKEND_URL = "https://zikra-atelier.preview.emergentagent.com/api"

# Test credentials from seed data
TEST_CREDENTIALS = {
    "email": "admin@zikra.com",
    "password": "admin123"
}

class BackendTester:
    def __init__(self):
        self.base_url = BACKEND_URL
        self.auth_token = None
        self.test_results = []
    
    def log_test(self, test_name, success, message, response_data=None):
        """Log test results"""
        result = {
            "test": test_name,
            "success": success,
            "message": message,
            "timestamp": datetime.now().isoformat(),
            "response_data": response_data
        }
        self.test_results.append(result)
        
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {message}")
        
        if not success and response_data:
            print(f"    Response: {response_data}")
    
    def test_health_check(self):
        """Test GET /api/"""
        try:
            response = requests.get(f"{self.base_url}/", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if "message" in data and "Zikra Zikirmatik API" in data["message"]:
                    self.log_test("Health Check", True, f"API is running - {data['message']}", data)
                    return True
                else:
                    self.log_test("Health Check", False, "Invalid response format", data)
            else:
                self.log_test("Health Check", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Health Check", False, f"Request failed: {str(e)}")
        
        return False
    
    def test_get_categories(self):
        """Test GET /api/categories - should return 3 categories"""
        try:
            response = requests.get(f"{self.base_url}/categories", timeout=10)
            
            if response.status_code == 200:
                categories = response.json()
                
                if len(categories) == 3:
                    # Validate category structure and names
                    expected_categories = ["Zikirmatik", "Aksesuar", "Kişiselleştirilmiş Aksesuar"]
                    category_names = [cat.get("name", "") for cat in categories]
                    
                    if all(name in category_names for name in expected_categories):
                        self.log_test("Get Categories", True, f"Found {len(categories)} categories with correct names", categories)
                        return True
                    else:
                        self.log_test("Get Categories", False, f"Category names mismatch. Expected: {expected_categories}, Got: {category_names}", categories)
                else:
                    self.log_test("Get Categories", False, f"Expected 3 categories, got {len(categories)}", categories)
            else:
                self.log_test("Get Categories", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Get Categories", False, f"Request failed: {str(e)}")
        
        return False
    
    def test_get_products(self):
        """Test GET /api/products - should return 2 products"""
        try:
            response = requests.get(f"{self.base_url}/products", timeout=10)
            
            if response.status_code == 200:
                products = response.json()
                
                if len(products) == 2:
                    # Validate product structure
                    expected_products = ["Zikra Zikirmatik - Altın Kalp", "Zikra Zikirmatik - Gümüş Hilal"]
                    product_names = [prod.get("name", "") for prod in products]
                    
                    if all(name in product_names for name in expected_products):
                        # Check required fields
                        required_fields = ["id", "name", "description", "category", "prices", "featured", "in_stock"]
                        all_have_required = all(
                            all(field in prod for field in required_fields) for prod in products
                        )
                        
                        if all_have_required:
                            self.log_test("Get Products", True, f"Found {len(products)} products with correct structure", products)
                            return True
                        else:
                            self.log_test("Get Products", False, "Products missing required fields", products)
                    else:
                        self.log_test("Get Products", False, f"Product names mismatch. Expected: {expected_products}, Got: {product_names}", products)
                else:
                    self.log_test("Get Products", False, f"Expected 2 products, got {len(products)}", products)
            else:
                self.log_test("Get Products", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Get Products", False, f"Request failed: {str(e)}")
        
        return False
    
    def test_get_featured_products(self):
        """Test GET /api/products?featured=true - should return 2 featured products"""
        try:
            response = requests.get(f"{self.base_url}/products?featured=true", timeout=10)
            
            if response.status_code == 200:
                featured_products = response.json()
                
                if len(featured_products) == 2:
                    # Verify all products are actually featured
                    all_featured = all(prod.get("featured", False) for prod in featured_products)
                    
                    if all_featured:
                        self.log_test("Get Featured Products", True, f"Found {len(featured_products)} featured products", featured_products)
                        return True
                    else:
                        self.log_test("Get Featured Products", False, "Not all returned products are marked as featured", featured_products)
                else:
                    self.log_test("Get Featured Products", False, f"Expected 2 featured products, got {len(featured_products)}", featured_products)
            else:
                self.log_test("Get Featured Products", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Get Featured Products", False, f"Request failed: {str(e)}")
        
        return False
    
    def test_admin_login(self):
        """Test POST /api/auth/login with admin credentials"""
        try:
            response = requests.post(
                f"{self.base_url}/auth/login",
                json=TEST_CREDENTIALS,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                
                if "token" in data and "user" in data:
                    self.auth_token = data["token"]
                    user = data["user"]
                    
                    # Validate user data
                    if (user.get("email") == TEST_CREDENTIALS["email"] and 
                        user.get("role") == "admin" and 
                        user.get("name") == "Admin"):
                        
                        self.log_test("Admin Login", True, "Successfully authenticated admin user", {
                            "token_received": bool(self.auth_token),
                            "user_info": user
                        })
                        return True
                    else:
                        self.log_test("Admin Login", False, "User data validation failed", data)
                else:
                    self.log_test("Admin Login", False, "Missing token or user in response", data)
            else:
                self.log_test("Admin Login", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Admin Login", False, f"Request failed: {str(e)}")
        
        return False
    
    def test_get_current_user(self):
        """Test GET /api/auth/me with auth token"""
        if not self.auth_token:
            self.log_test("Get Current User", False, "No auth token available")
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.auth_token}"}
            response = requests.get(f"{self.base_url}/auth/me", headers=headers, timeout=10)
            
            if response.status_code == 200:
                user = response.json()
                
                # Validate user data structure
                required_fields = ["id", "email", "name", "role"]
                if all(field in user for field in required_fields):
                    if (user.get("email") == TEST_CREDENTIALS["email"] and 
                        user.get("role") == "admin"):
                        
                        self.log_test("Get Current User", True, "Successfully retrieved current user info", user)
                        return True
                    else:
                        self.log_test("Get Current User", False, "User data validation failed", user)
                else:
                    self.log_test("Get Current User", False, f"Missing required fields: {required_fields}", user)
            elif response.status_code == 401:
                self.log_test("Get Current User", False, "Authentication failed - token might be invalid")
            else:
                self.log_test("Get Current User", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_test("Get Current User", False, f"Request failed: {str(e)}")
        
        return False
    
    def run_all_tests(self):
        """Run all backend tests in sequence"""
        print("🚀 Starting Zikra Zikirmatik Backend API Tests")
        print(f"🌐 Testing against: {self.base_url}")
        print("=" * 60)
        
        # Test 1: Health Check
        self.test_health_check()
        
        # Test 2: Get Categories
        self.test_get_categories()
        
        # Test 3: Get Products
        self.test_get_products()
        
        # Test 4: Get Featured Products
        self.test_get_featured_products()
        
        # Test 5: Admin Login
        login_success = self.test_admin_login()
        
        # Test 6: Get Current User (only if login succeeded)
        if login_success:
            self.test_get_current_user()
        else:
            self.log_test("Get Current User", False, "Skipped due to login failure")
        
        print("=" * 60)
        self.print_summary()
        
        return self.test_results
    
    def print_summary(self):
        """Print test summary"""
        passed = sum(1 for result in self.test_results if result["success"])
        failed = len(self.test_results) - passed
        
        print(f"\n📊 TEST SUMMARY:")
        print(f"   ✅ Passed: {passed}")
        print(f"   ❌ Failed: {failed}")
        print(f"   📈 Success Rate: {(passed/len(self.test_results)*100):.1f}%")
        
        if failed > 0:
            print(f"\n❌ FAILED TESTS:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"   • {result['test']}: {result['message']}")

def main():
    """Main test execution"""
    print("Zikra Zikirmatik Backend API Test Suite")
    print("=" * 50)
    
    tester = BackendTester()
    results = tester.run_all_tests()
    
    # Exit with error code if any tests failed
    failed_tests = [r for r in results if not r["success"]]
    if failed_tests:
        sys.exit(1)
    else:
        print("\n🎉 All tests passed!")
        sys.exit(0)

if __name__ == "__main__":
    main()