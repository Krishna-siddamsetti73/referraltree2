#====================================================================================================
# START - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================

# THIS SECTION CONTAINS CRITICAL TESTING INSTRUCTIONS FOR BOTH AGENTS
# BOTH MAIN_AGENT AND TESTING_AGENT MUST PRESERVE THIS ENTIRE BLOCK

# Communication Protocol:
# If the `testing_agent` is available, main agent should delegate all testing tasks to it.
#
# You have access to a file called `test_result.md`. This file contains the complete testing state
# and history, and is the primary means of communication between main and the testing agent.
#
# Main and testing agents must follow this exact format to maintain testing data. 
# The testing data must be entered in yaml format Below is the data structure:
# 
## user_problem_statement: {problem_statement}
## backend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.py"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## frontend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.js"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## metadata:
##   created_by: "main_agent"
##   version: "1.0"
##   test_sequence: 0
##   run_ui: false
##
## test_plan:
##   current_focus:
##     - "Task name 1"
##     - "Task name 2"
##   stuck_tasks:
##     - "Task name with persistent issues"
##   test_all: false
##   test_priority: "high_first"  # or "sequential" or "stuck_first"
##
## agent_communication:
##     -agent: "main"  # or "testing" or "user"
##     -message: "Communication message between agents"

# Protocol Guidelines for Main agent
#
# 1. Update Test Result File Before Testing:
#    - Main agent must always update the `test_result.md` file before calling the testing agent
#    - Add implementation details to the status_history
#    - Set `needs_retesting` to true for tasks that need testing
#    - Update the `test_plan` section to guide testing priorities
#    - Add a message to `agent_communication` explaining what you've done
#
# 2. Incorporate User Feedback:
#    - When a user provides feedback that something is or isn't working, add this information to the relevant task's status_history
#    - Update the working status based on user feedback
#    - If a user reports an issue with a task that was marked as working, increment the stuck_count
#    - Whenever user reports issue in the app, if we have testing agent and task_result.md file so find the appropriate task for that and append in status_history of that task to contain the user concern and problem as well 
#
# 3. Track Stuck Tasks:
#    - Monitor which tasks have high stuck_count values or where you are fixing same issue again and again, analyze that when you read task_result.md
#    - For persistent issues, use websearch tool to find solutions
#    - Pay special attention to tasks in the stuck_tasks list
#    - When you fix an issue with a stuck task, don't reset the stuck_count until the testing agent confirms it's working
#
# 4. Provide Context to Testing Agent:
#    - When calling the testing agent, provide clear instructions about:
#      - Which tasks need testing (reference the test_plan)
#      - Any authentication details or configuration needed
#      - Specific test scenarios to focus on
#      - Any known issues or edge cases to verify
#
# 5. Call the testing agent with specific instructions referring to test_result.md
#
# IMPORTANT: Main agent must ALWAYS update test_result.md BEFORE calling the testing agent, as it relies on this file to understand what to test next.

#====================================================================================================
# END - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================



#====================================================================================================
# Testing Data - Main Agent and testing sub agent both should log testing data below this section
#====================================================================================================

user_problem_statement: |
  Build a complete full-stack referral system with YouTube membership verification using Next.js.
  Features: OTP authentication, YouTube membership check, static UPI QR payment (₹1), 
  referral chain tracking (predecessor/successor), and referral link generation.

backend:
  - task: "OTP Send API"
    implemented: true
    working: true
    file: "/app/app/api/[[...path]]/route.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "POST /api/send-otp implemented with mock OTP (always 1234). Tested with curl and working."

  - task: "OTP Verify API"
    implemented: true
    working: true
    file: "/app/app/api/[[...path]]/route.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "POST /api/verify-otp implemented. Creates user in MongoDB, returns JWT in httpOnly cookie. Tested with curl."

  - task: "Save User Info API"
    implemented: true
    working: true
    file: "/app/app/api/[[...path]]/route.js"
    stuck_count: 0
    priority: "medium"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "POST /api/save-user-info implemented. Updates name, email, address. Tested with curl."

  - task: "YouTube Membership Verification API"
    implemented: true
    working: true
    file: "/app/app/api/[[...path]]/route.js"
    stuck_count: 0
    priority: "medium"
    needs_retesting: false
    status_history:
      - working: "mock"
        agent: "main"
        comment: "POST /api/verify-youtube-membership implemented with mock (50% random). Real OAuth integration pending."
      - working: true
        agent: "testing"
        comment: "API tested successfully. Mock implementation working correctly - returns random membership status and updates user.isYTMember field. Authentication working properly."

  - task: "Activate Static Payment API"
    implemented: true
    working: true
    file: "/app/app/api/[[...path]]/route.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: "mock"
        agent: "main"
        comment: "POST /api/activate-static-payment implemented. Trust-based, no real payment verification."
      - working: true
        agent: "testing"
        comment: "API tested successfully. Trust-based payment activation working - sets hasPaid1Rupee=true and upiHash='staticQRverified'. Authentication and database updates working correctly."

  - task: "Generate Referral Link API"
    implemented: true
    working: true
    file: "/app/app/api/[[...path]]/route.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "POST /api/generate-referral-link implemented. Generates unique link with user ID. Tested with curl."

  - task: "Assign Referral API"
    implemented: true
    working: true
    file: "/app/app/api/[[...path]]/route.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "POST /api/assign-referral implemented. Links predecessor and successor. Needs end-to-end testing."
      - working: true
        agent: "testing"
        comment: "End-to-end referral chain testing completed successfully. User B's predecessor correctly set to User A's ID, User A's successors array includes User B's ID. Database relationships working correctly."

  - task: "MongoDB Connection"
    implemented: true
    working: true
    file: "/app/lib/db.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "MongoDB Atlas connection working. User model created and tested."

frontend:
  - task: "Home Page"
    implemented: true
    working: "NA"
    file: "/app/app/page.js"
    stuck_count: 0
    priority: "medium"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Landing page with features and 'Refer Now' button. Needs UI testing."

  - task: "OTP Login Flow"
    implemented: true
    working: "NA"
    file: "/app/app/start/page.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Phone input + OTP verification implemented. Needs full flow testing."

  - task: "User Details Form"
    implemented: true
    working: "NA"
    file: "/app/app/details/page.js"
    stuck_count: 0
    priority: "medium"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Optional form for name, email, address. Has skip button. Needs testing."

  - task: "YouTube Membership Page"
    implemented: true
    working: "NA"
    file: "/app/app/membership/page.js"
    stuck_count: 0
    priority: "medium"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Mock verification page. Shows appropriate alerts. Needs testing."

  - task: "Payment QR Page"
    implemented: true
    working: "NA"
    file: "/app/app/payment/page.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Displays UPI QR code and 'I HAVE PAID' button. Routes to correct page based on referral. Needs testing."

  - task: "Referral Link Display"
    implemented: true
    working: "NA"
    file: "/app/app/referral-link/page.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Shows referral link with copy and WhatsApp share buttons. Needs testing."

  - task: "Referral Handler"
    implemented: true
    working: "NA"
    file: "/app/app/referral/[id]/page.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Captures referrer ID from URL and redirects to /start. Stores in sessionStorage. Needs testing."

  - task: "Successor Success Page"
    implemented: true
    working: "NA"
    file: "/app/app/successor-success/page.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Calls assign-referral API and shows success message. Needs referral chain testing."

metadata:
  created_by: "main_agent"
  version: "1.0"
  test_sequence: 1
  run_ui: true

test_plan:
  current_focus:
    - "Full user registration flow (OTP → Details → Membership → Payment → Referral Link)"
    - "Referral chain flow (User A gets link → User B signs up via link → Verify predecessor/successor)"
    - "UI responsiveness and navigation"
  stuck_tasks: []
  test_all: true
  test_priority: "high_first"

agent_communication:
  - agent: "main"
    message: |
      Initial implementation complete. All backend APIs tested with curl and working.
      Frontend pages created with responsive UI. Need comprehensive UI testing for:
      1. Complete registration flow
      2. Referral link generation and sharing
      3. Referral chain linkage (predecessor/successor)
      4. All navigation flows work correctly
      5. Toast notifications display properly
      
      Test credentials: Use OTP "1234" for any phone number.
      MongoDB is working, UPI QR code generated at /public/upi.png.
      
      Priority: Test the complete flow end-to-end, especially referral chain logic.
  - agent: "testing"
    message: |
      COMPREHENSIVE BACKEND TESTING COMPLETED SUCCESSFULLY ✅
      
      All backend APIs tested and working correctly:
      ✅ OTP Send/Verify flow with JWT authentication
      ✅ User management (save-user-info, get /api/me)
      ✅ YouTube membership verification (mock implementation)
      ✅ Static payment activation (trust-based)
      ✅ Referral link generation
      ✅ Referral chain assignment (predecessor/successor relationships)
      ✅ Authentication security (401 for unauthorized access)
      ✅ Error handling for invalid inputs
      ✅ Database operations and data persistence
      
      End-to-end referral flow verified:
      - User A generates referral link
      - User B registers via OTP and gets assigned to User A
      - Database correctly establishes predecessor/successor relationships
      
      All backend tasks marked as working=true and needs_retesting=false.
      Backend is production-ready for the MVP scope.