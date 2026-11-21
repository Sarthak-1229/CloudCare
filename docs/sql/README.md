
# CloudCare SQL Database

This folder contains the SQL files for the CloudCare Hospital Management System.

## Files

- `schema.sql` – Creates the database and six required tables.
- `seed.sql` – Inserts fictional sample users, doctors, patients, appointments and prescriptions.

## Database

Database name: `cloudcare`

Database engine: MySQL

## Important Notes

- All records are fictional.
- Passwords must be stored as bcrypt hashes.
- Never commit real credentials or database passwords.
- Execute the schema before inserting seed records.
- Confirm schema and seed compatibility with the backend API contract before execution.
