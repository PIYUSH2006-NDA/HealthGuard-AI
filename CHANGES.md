# Project Changes

## 1. Contact Support
- **Fixed:** "Contact Support" link in the dashboard now points to a dedicated page instead of a `mailto:` link.
- **Added:** New Contact Support page at `/contact` featuring:
  - Responsive contact form with name, email, subject, and message fields.
  - Loading state and success toast notification.
  - Sidebar with support email, phone number, and office address.

## 2. Authentication
- **Fixed:** "Invalid Credentials" error when logging in with existing accounts.
- **Improved:** Login error messages are now more specific:
  - "Email not found" for unregistered emails.
  - "Incorrect password" for wrong passwords.
- **Enhanced:** `AuthContext` logic:
  - Added robust `JSON.parse` handling to prevent crashes from corrupted local storage.
  - Added `console.log` debug statements (prefixed with `[v0]`) to help troubleshoot auth flow.
  - Ensured email matching is always case-insensitive and trimmed.
  - Added safeguards to `signup` to prevent overwriting existing user lists if parsing fails.

## How to Test
1. **Contact Support:**
   - Go to Dashboard -> Profile Dropdown -> Contact Support.
   - Verify it opens the new Contact page.
   - Fill out the form and submit to see the success message.

2. **Authentication:**
   - Sign up a new user (e.g., `test@example.com`).
   - Logout.
   - Login with `test@example.com` (try `Test@Example.com ` with spaces/caps to verify fix).
   - Try a wrong password to see "Incorrect password".
   - Try a non-existent email to see "Email not found".
