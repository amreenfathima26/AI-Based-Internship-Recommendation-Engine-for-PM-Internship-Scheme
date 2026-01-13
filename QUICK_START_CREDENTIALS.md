# Quick Start - Working Credentials

## Option 1: Use Registration (RECOMMENDED)

Since login is having issues, use the registration form instead:

1. Go to http://localhost:3000
2. Click **"Request Credentials"** (at the bottom of the login form)
3. Fill in the registration form:
   - Full Name: Your Name
   - Email: youremail@test.com
   - Phone: (optional)
   - Password: yourpassword
   - Confirm: yourpassword
4. Click "Finalize Onboarding"
5. You should be logged in automatically

## Option 2: Pre-created Test Accounts

These accounts exist in the database and authentication works when tested directly:

### Account 1
- Email: `test@corp.com`
- Password: `test123`

### Account 2
- Email: `demo@intern.com`
- Password: `demo123`

## Troubleshooting

If login still shows "Invalid credentials":
1. Open browser DevTools (F12)
2. Go to Console tab
3. Check for any red error messages
4. Go to Network tab
5. Try to login
6. Click on the "login" request
7. Check the "Request" payload to see what's being sent

The backend authentication works correctly - the issue is likely in how the request is being transmitted from the browser.
