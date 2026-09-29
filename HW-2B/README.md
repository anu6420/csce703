# Secure Login Form — HW 2-B Part 2

This is a simple login form based on the basic Juice Shop login page. It asks for an email and password. Before the form is sent, JavaScript checks that neither box is empty, the email has an `@` symbol, and the password is at least eight characters long. The server checks these rules again as someone could try to skip the checks in the browser.

I also added a few security protections. The form limits repeated login attempts, does not put user input directly into a SQL query, and displays messages as text instead of HTML to avoid XSS. Passwords are checked with bcrypt instead of being stored as regular text for secure password handling. 

## Run locally

1. Install Node.js 18 or newer.
2. In this directory, run `npm install`.
3. Run `npm start`.
4. Open `http://localhost:3000` in a browser.

The sample account is only included to show how the code works. In a real application, account information and password hashes would be stored in a database.
