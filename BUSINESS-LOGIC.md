# Business Logic

## Business Rules

### Health Check
- GET `/` returns API status and available endpoints

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
