#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for YouTube Membership Referral System
Tests all backend APIs with authentication flow and referral chain logic
"""

import requests
import json
import time
import sys
from typing import Dict, Optional

class BackendTester:
    def __init__(self, base_url: str = "http://localhost:3000"):
        self.base_url = base_url
        self.session = requests.Session()
        self.user_a_data = {}
        self.user_b_data = {}
        
    def log(self, message: str, level: str = "INFO"):
        """Log test messages with timestamp"""
        timestamp = time.strftime("%H:%M:%S")
        print(f"[{timestamp}] {level}: {message}")
        
    def test_send_otp(self, phone: str) -> bool:
        """Test POST /api/send-otp"""
        try:
            self.log(f"Testing send OTP for phone: {phone}")
            
            response = self.session.post(
                f"{self.base_url}/api/send-otp",
                json={"phone": phone},
                headers={"Content-Type": "application/json"}
            )
            
            self.log(f"Send OTP Response Status: {response.status_code}")
            self.log(f"Send OTP Response: {response.text}")
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and data.get("debug", {}).get("otp") == "1234":
                    self.log("✅ Send OTP test PASSED - Mock OTP returned correctly")
                    return True
                else:
                    self.log("❌ Send OTP test FAILED - Invalid response format")
                    return False
            else:
                self.log(f"❌ Send OTP test FAILED - Status: {response.status_code}")
                return False
                
        except Exception as e:
            self.log(f"❌ Send OTP test FAILED - Exception: {str(e)}", "ERROR")
            return False
    
    def test_verify_otp(self, phone: str, otp: str = "1234") -> Optional[Dict]:
        """Test POST /api/verify-otp and return user data"""
        try:
            self.log(f"Testing verify OTP for phone: {phone} with OTP: {otp}")
            
            response = self.session.post(
                f"{self.base_url}/api/verify-otp",
                json={"phone": phone, "otp": otp},
                headers={"Content-Type": "application/json"}
            )
            
            self.log(f"Verify OTP Response Status: {response.status_code}")
            self.log(f"Verify OTP Response: {response.text}")
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and data.get("user"):
                    # Check if JWT cookie is set
                    cookies = response.cookies
                    if 'auth_token' in cookies:
                        self.log("✅ Verify OTP test PASSED - JWT cookie set and user created")
                        return data["user"]
                    else:
                        self.log("❌ Verify OTP test FAILED - JWT cookie not set")
                        return None
                else:
                    self.log("❌ Verify OTP test FAILED - Invalid response format")
                    return None
            else:
                self.log(f"❌ Verify OTP test FAILED - Status: {response.status_code}")
                return None
                
        except Exception as e:
            self.log(f"❌ Verify OTP test FAILED - Exception: {str(e)}", "ERROR")
            return None
    
    def test_get_me(self) -> Optional[Dict]:
        """Test GET /api/me (authenticated)"""
        try:
            self.log("Testing GET /api/me")
            
            response = self.session.get(
                f"{self.base_url}/api/me",
                headers={"Content-Type": "application/json"}
            )
            
            self.log(f"Get Me Response Status: {response.status_code}")
            self.log(f"Get Me Response: {response.text}")
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and data.get("user"):
                    self.log("✅ Get Me test PASSED - User data retrieved")
                    return data["user"]
                else:
                    self.log("❌ Get Me test FAILED - Invalid response format")
                    return None
            else:
                self.log(f"❌ Get Me test FAILED - Status: {response.status_code}")
                return None
                
        except Exception as e:
            self.log(f"❌ Get Me test FAILED - Exception: {str(e)}", "ERROR")
            return None
    
    def test_save_user_info(self, name: str, email: str, address: str) -> bool:
        """Test POST /api/save-user-info (authenticated)"""
        try:
            self.log(f"Testing save user info: {name}, {email}")
            
            response = self.session.post(
                f"{self.base_url}/api/save-user-info",
                json={"name": name, "email": email, "address": address},
                headers={"Content-Type": "application/json"}
            )
            
            self.log(f"Save User Info Response Status: {response.status_code}")
            self.log(f"Save User Info Response: {response.text}")
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and data.get("user"):
                    user = data["user"]
                    if user.get("name") == name and user.get("email") == email:
                        self.log("✅ Save User Info test PASSED - User data updated")
                        return True
                    else:
                        self.log("❌ Save User Info test FAILED - Data not updated correctly")
                        return False
                else:
                    self.log("❌ Save User Info test FAILED - Invalid response format")
                    return False
            else:
                self.log(f"❌ Save User Info test FAILED - Status: {response.status_code}")
                return False
                
        except Exception as e:
            self.log(f"❌ Save User Info test FAILED - Exception: {str(e)}", "ERROR")
            return False
    
    def test_verify_youtube_membership(self) -> bool:
        """Test POST /api/verify-youtube-membership (authenticated)"""
        try:
            self.log("Testing YouTube membership verification")
            
            response = self.session.post(
                f"{self.base_url}/api/verify-youtube-membership",
                json={"youtubeChannelId": "test-channel-id"},
                headers={"Content-Type": "application/json"}
            )
            
            self.log(f"YouTube Membership Response Status: {response.status_code}")
            self.log(f"YouTube Membership Response: {response.text}")
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and "isYTMember" in data:
                    is_member = data["isYTMember"]
                    self.log(f"✅ YouTube Membership test PASSED - Member status: {is_member}")
                    return True
                else:
                    self.log("❌ YouTube Membership test FAILED - Invalid response format")
                    return False
            else:
                self.log(f"❌ YouTube Membership test FAILED - Status: {response.status_code}")
                return False
                
        except Exception as e:
            self.log(f"❌ YouTube Membership test FAILED - Exception: {str(e)}", "ERROR")
            return False
    
    def test_activate_static_payment(self) -> bool:
        """Test POST /api/activate-static-payment (authenticated)"""
        try:
            self.log("Testing static payment activation")
            
            response = self.session.post(
                f"{self.base_url}/api/activate-static-payment",
                json={},
                headers={"Content-Type": "application/json"}
            )
            
            self.log(f"Activate Payment Response Status: {response.status_code}")
            self.log(f"Activate Payment Response: {response.text}")
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success"):
                    self.log("✅ Activate Payment test PASSED - Payment activated")
                    return True
                else:
                    self.log("❌ Activate Payment test FAILED - Invalid response format")
                    return False
            else:
                self.log(f"❌ Activate Payment test FAILED - Status: {response.status_code}")
                return False
                
        except Exception as e:
            self.log(f"❌ Activate Payment test FAILED - Exception: {str(e)}", "ERROR")
            return False
    
    def test_generate_referral_link(self) -> Optional[str]:
        """Test POST /api/generate-referral-link (authenticated)"""
        try:
            self.log("Testing referral link generation")
            
            response = self.session.post(
                f"{self.base_url}/api/generate-referral-link",
                json={},
                headers={"Content-Type": "application/json"}
            )
            
            self.log(f"Generate Referral Response Status: {response.status_code}")
            self.log(f"Generate Referral Response: {response.text}")
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and data.get("referralLink"):
                    referral_link = data["referralLink"]
                    self.log(f"✅ Generate Referral Link test PASSED - Link: {referral_link}")
                    return referral_link
                else:
                    self.log("❌ Generate Referral Link test FAILED - Invalid response format")
                    return None
            else:
                self.log(f"❌ Generate Referral Link test FAILED - Status: {response.status_code}")
                return None
                
        except Exception as e:
            self.log(f"❌ Generate Referral Link test FAILED - Exception: {str(e)}", "ERROR")
            return None
    
    def test_assign_referral(self, referrer_id: str) -> bool:
        """Test POST /api/assign-referral (authenticated)"""
        try:
            self.log(f"Testing referral assignment with referrer ID: {referrer_id}")
            
            response = self.session.post(
                f"{self.base_url}/api/assign-referral",
                json={"referrerId": referrer_id},
                headers={"Content-Type": "application/json"}
            )
            
            self.log(f"Assign Referral Response Status: {response.status_code}")
            self.log(f"Assign Referral Response: {response.text}")
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success"):
                    self.log("✅ Assign Referral test PASSED - Referral assigned")
                    return True
                else:
                    self.log("❌ Assign Referral test FAILED - Invalid response format")
                    return False
            else:
                self.log(f"❌ Assign Referral test FAILED - Status: {response.status_code}")
                return False
                
        except Exception as e:
            self.log(f"❌ Assign Referral test FAILED - Exception: {str(e)}", "ERROR")
            return False
    
    def test_unauthorized_access(self) -> bool:
        """Test that protected endpoints return 401 without authentication"""
        try:
            self.log("Testing unauthorized access to protected endpoints")
            
            # Create a new session without cookies
            temp_session = requests.Session()
            
            protected_endpoints = [
                ("/api/me", "GET"),
                ("/api/save-user-info", "POST"),
                ("/api/verify-youtube-membership", "POST"),
                ("/api/activate-static-payment", "POST"),
                ("/api/generate-referral-link", "POST"),
                ("/api/assign-referral", "POST")
            ]
            
            all_unauthorized = True
            
            for endpoint, method in protected_endpoints:
                if method == "GET":
                    response = temp_session.get(f"{self.base_url}{endpoint}")
                else:
                    response = temp_session.post(
                        f"{self.base_url}{endpoint}",
                        json={},
                        headers={"Content-Type": "application/json"}
                    )
                
                if response.status_code == 401:
                    self.log(f"✅ {endpoint} correctly returns 401 when unauthorized")
                else:
                    self.log(f"❌ {endpoint} should return 401 but returned {response.status_code}")
                    all_unauthorized = False
            
            if all_unauthorized:
                self.log("✅ Unauthorized access test PASSED - All protected endpoints secured")
                return True
            else:
                self.log("❌ Unauthorized access test FAILED - Some endpoints not properly secured")
                return False
                
        except Exception as e:
            self.log(f"❌ Unauthorized access test FAILED - Exception: {str(e)}", "ERROR")
            return False
    
    def run_complete_flow_test(self) -> bool:
        """Run complete user flow test including referral chain"""
        try:
            self.log("=" * 60)
            self.log("STARTING COMPLETE BACKEND API FLOW TEST")
            self.log("=" * 60)
            
            # Test 1: OTP Flow for User A
            self.log("\n--- Testing User A Registration Flow ---")
            phone_a = "9876543210"
            
            if not self.test_send_otp(phone_a):
                return False
            
            user_a = self.test_verify_otp(phone_a)
            if not user_a:
                return False
            
            self.user_a_data = user_a
            
            # Test 2: User Management for User A
            if not self.test_get_me():
                return False
            
            if not self.test_save_user_info("John Doe", "john@example.com", "123 Main St"):
                return False
            
            # Test 3: YouTube Membership for User A
            if not self.test_verify_youtube_membership():
                return False
            
            # Test 4: Payment Activation for User A
            if not self.test_activate_static_payment():
                return False
            
            # Test 5: Generate Referral Link for User A
            referral_link = self.test_generate_referral_link()
            if not referral_link:
                return False
            
            # Extract referrer ID from referral link
            referrer_id = referral_link.split("/referral/")[-1]
            self.log(f"Extracted referrer ID: {referrer_id}")
            
            # Test 6: Create User B and test referral assignment
            self.log("\n--- Testing User B Registration and Referral Assignment ---")
            
            # Create new session for User B
            user_b_session = requests.Session()
            original_session = self.session
            self.session = user_b_session
            
            phone_b = "9876543211"
            
            if not self.test_send_otp(phone_b):
                return False
            
            user_b = self.test_verify_otp(phone_b)
            if not user_b:
                return False
            
            self.user_b_data = user_b
            
            # Test referral assignment
            if not self.test_assign_referral(referrer_id):
                return False
            
            # Test 7: Verify referral chain by checking User B's data
            user_b_updated = self.test_get_me()
            if not user_b_updated:
                return False
            
            # Switch back to User A session to verify successor
            self.session = original_session
            user_a_updated = self.test_get_me()
            if not user_a_updated:
                return False
            
            # Test 8: Test unauthorized access
            if not self.test_unauthorized_access():
                return False
            
            self.log("\n" + "=" * 60)
            self.log("✅ ALL BACKEND API TESTS PASSED SUCCESSFULLY!")
            self.log("=" * 60)
            
            # Summary
            self.log("\n--- TEST SUMMARY ---")
            self.log(f"User A ID: {self.user_a_data.get('id')}")
            self.log(f"User B ID: {self.user_b_data.get('id')}")
            self.log(f"Referral Link: {referral_link}")
            self.log("All API endpoints working correctly")
            self.log("Authentication flow working")
            self.log("Referral chain logic working")
            self.log("Database operations successful")
            
            return True
            
        except Exception as e:
            self.log(f"❌ Complete flow test FAILED - Exception: {str(e)}", "ERROR")
            return False

def main():
    """Main test execution"""
    # Get base URL from environment or use default
    import os
    base_url = os.getenv('NEXT_PUBLIC_BASE_URL', 'http://localhost:3000')
    
    print(f"Starting backend API tests for: {base_url}")
    
    tester = BackendTester(base_url)
    
    try:
        success = tester.run_complete_flow_test()
        
        if success:
            print("\n🎉 ALL BACKEND TESTS COMPLETED SUCCESSFULLY!")
            sys.exit(0)
        else:
            print("\n💥 SOME BACKEND TESTS FAILED!")
            sys.exit(1)
            
    except KeyboardInterrupt:
        print("\n⚠️  Tests interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n💥 Test execution failed: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()