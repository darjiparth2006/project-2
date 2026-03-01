# Parth Library — Lightweight Library Management

This is a simple web prototype built with HTML/CSS/JS and PHP + MySQL.

Getting started

1. Place the project in a PHP-capable webroot (XAMPP, WAMP, or a PHP-enabled server).
2. Create the database (adjust credentials in `php/db.php`):

```sql
-- run the SQL in `sql/schema.sql`
``` 

3. Update DB credentials in `php/db.php` (`$DB_HOST`, `$DB_NAME`, `$DB_USER`, `$DB_PASS`).
4. Open `index.html` in a browser (via the server URL, e.g. `http://localhost/YourFolder/index.html`).

Files
- `index.html` — Landing page
- `books.html` — Create/update books & allocate to students
- `students.html` — Create/update students; see allocated books
- `status.html` — Current allocation list
- `php/*.php` — Simple JSON APIs (edit `php/db.php` first)
- `sql/schema.sql` — DB schema

Notes & next steps
- Input validation and authentication are intentionally minimal for the prototype. Add user login, better validation, and UI polishing for production.
- You can extend features: returns, due dates, availability status, search, filters, pagination, and export.
