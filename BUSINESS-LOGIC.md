# Business Logic

## Business Rules

### Health Check
- GET `/health-check` returns API status and available endpoints

### User Creation
- New users are assigned a unique ID automatically
- Name is required and must be a non-empty string
- Name is trimmed before saving

### User Update
- User must exist (404 if not found)
- Name is required and must be a non-empty string
- Name is trimmed before saving
- User not found (404) takes priority over name validation (400)

### User Deletion
- User must exist (404 if not found)
- After deletion, user cannot be retrieved (GET returns 404)

### Name Validation
- Must be a string
- Must not be empty after trimming

### Undefined Routes
- Any request to an undefined route returns 404

---

## Technical Notes

### Data Storage
- In-memory array
- Data resets on server restart
- Initial seed data: 3 users (Ayşe, Mehmet, Zeynep)

### ID Generation
- Highest existing ID + 1
- Starts at 1 if no users exist

---

## Testable Scenarios

### User Lifecycle
- Create a user → GET returns the user
- Update a user → GET returns updated data
- Delete a user → GET returns 404
- Delete a user twice → Second DELETE returns 404

### Validation Priority
- PUT with non-existent user and invalid name → 404 (user not found)
- PUT with existing user and invalid name → 400 (name required)

### Edge Cases
- Create user with whitespace-only name → 400
- Create user with leading/trailing spaces → Name is trimmed
- GET non-existent user → 404
- DELETE non-existent user → 404

### `:id` Parameter Edge Cases

| # | Scenario | Request | Result |
|---|---|---|---|
| 1 | Non-numeric id | `GET /users/abc` | 404 (`NaN` never matches) |
| 2 | Negative id | `GET /users/-1` | 404 |
| 3 | Decimal id | `GET /users/1.5` | 404 |
| 4 | Extremely large id | `GET /users/99999999999999999999` | 404, no crash |
| 5 | Empty id / trailing slash | `GET /users/` | 200 — falls through to list route, not `:id` route |
| 6 | Whitespace id | `GET /users/%20` | 404 (`Number(" ") === 0`, accidentally safe since id `0` doesn't exist) |
| 7 | Injection attempt | `GET /users/1;DROP TABLE users` (URL-encoded) | 404, no crash. **Currently safe only because there is no SQL layer** — must be re-tested once `better-sqlite3` is wired in |

### Malformed Input / Response Consistency

| # | Scenario | Request | Result |
|---|---|---|---|
| 8 | Extra field in body | `POST /users {"name":"Test","isAdmin":true}` | 201, extra field silently ignored (safe by accident, via destructuring — not an intentional mass-assignment guard) |
| 9 | Unsupported method | `PATCH /users/1` | 404 `Route not found` (see Known Issues — 405 would be more correct) |
| 10 | DELETE success response headers | `DELETE /users/:id` | 204, no `Content-Type` header — correct per HTTP spec |
| 11 | Content-Type mismatch, valid JSON body | `POST /users` with `Content-Type: text/plain` and body `{"name":"Test"}` | Body is **not parsed** (middleware only inspects the header, not content). `req.body` is empty/undefined → falls through to normal validation → 400 "Name is required", **not** a JSON parse error. Can be a confusing debugging trap for API consumers who set the wrong header. |

---

## Known Issues

### Malformed JSON — Information Disclosure (FIXED)
- **Issue:** Sending malformed JSON with `Content-Type: application/json` triggered Express's default error handler, which returned an HTML response containing the full stack trace and local file system path (OWASP Security Misconfiguration).
- **Fix:** Added a global 4-parameter error-handling middleware `(err, req, res, next)` in `index.js`, registered after all routes. Detects JSON parse failures via `err.type === 'entity.parse.failed'` combined with `err instanceof SyntaxError`, and returns a consistent `{"message": "Invalid JSON payload"}` response with `Content-Type: application/json`. Stack traces are logged server-side only, never sent to the client.
- **Status:** ✅ Fixed and verified via curl (2026-08-28).

### Unsupported HTTP Methods Return 404 Instead of 405
- `PATCH /users/:id` (or any unsupported method on an existing route) returns `404 Route not found` instead of the more semantically correct `405 Method Not Allowed`.
- **Status:** Accepted limitation, not scheduled for fix.

### Dead Code — `if (!users)` Check in GET `/users`
- The check `if (!users)` in the users list route is unreachable, since `users` is always an array reference (never `null`/`undefined`). The intended check was likely `if (!users.length)`, but returning 404 for an empty collection would violate REST convention (an empty collection is a valid 200 response).
- **Status:** Not fixed — flagged for awareness, current behavior (always falls through) is actually correct per REST convention.