const Database = require('better-sqlite3');
const db = new Database('nyondo_stock.db');

// Validation functions
function validateProductName(name) {
    if (typeof name !== 'string') {
        console.log(`Validation failed: name must be a string`);
        return false;
    }
    if (name.length < 2) {
        console.log(`Validation failed: name must be at least 2 characters (got: "${name}")`);
        return false;
    }
    // Check for dangerous characters: < > ; or any HTML tags
    const dangerousPattern = /[<>;]/;
    if (dangerousPattern.test(name)) {
        console.log(`Validation failed: name contains invalid characters: "${name}"`);
        return false;
    }
    return true;
}

function validatePrice(price) {
    if (typeof price !== 'number' || isNaN(price)) {
        console.log(`Validation failed: price must be a number`);
        return false;
    }
    if (price <= 0) {
        console.log(`Validation failed: price must be greater than 0 (got: ${price})`);
        return false;
    }
    return true;
}

function validateUsername(username) {
    if (typeof username !== 'string') {
        console.log(`Validation failed: username must be a string`);
        return false;
    }
    if (username.length === 0) {
        console.log(`Validation failed: username cannot be empty`);
        return false;
    }
    if (username.includes(' ')) {
        console.log(`Validation failed: username cannot contain spaces (got: "${username}")`);
        return false;
    }
    return true;
}

function validatePassword(password) {
    if (typeof password !== 'string') {
        console.log(`Validation failed: password must be a string`);
        return false;
    }
    if (password.length < 6) {
        console.log(`Validation failed: password must be at least 6 characters (got: ${password.length} chars)`);
        return false;
    }
    return true;
}
// SECURE WITH VALIDATION--
function searchProductSafe(name) {
    console.log(`\n>>> searchProductSafe("${name}")`);
    
    // Input validation first
    if (!validateProductName(name)) {
        console.log('Result: [] (validation failed, database not touched)\n');
        return [];
    }
    // Parameterized query - ? acts as a placeholder
    const query = `SELECT * FROM products WHERE name LIKE '%' || ? || '%'`;
    console.log(`Query: ${query}`);
    console.log(`Parameter: ${name}`);
    
    try {
        const rows = db.prepare(query).all(name);
        console.log(`Result: ${JSON.stringify(rows, null, 2)}\n`);
        return rows;
    } catch (error) {
        console.log(`Error: ${error.message}\n`);
        return [];
    }
}


// SECURE WITH VALIDATION--
function loginSafe(username, password) {
    console.log(`\n>>> loginSafe("${username}", "${password}")`);
    
    // Input validation first
    if (!validateUsername(username)) {
        console.log('Result: null (validation failed, database not touched)\n');
        return null;
    }
    if (!validatePassword(password)) {
        console.log('Result: null (validation failed, database not touched)\n');
        return null;
    }
    // Parameterized query - ? placeholders for both values
    const query = `SELECT * FROM users WHERE username = ? AND password = ?`;
    console.log(`Query: ${query}`);
    console.log(`Parameters: username=${username}, password=${password}`);
    
    try {
        const row = db.prepare(query).get(username, password);
        console.log(`Result: ${JSON.stringify(row, null, 2)}\n`);
        return row;
    } catch (error) {
        console.log(`Error: ${error.message}\n`);
        return null;
    }
}

// Test cases
console.log('--- TEST 1: search_product_safe("cement") ---');
searchProductSafe('cement');

console.log('--- TEST 2: search_product_safe(")") ---');
searchProductSafe(')');

console.log('--- TEST 3: search_product_safe("<script>") ---');
searchProductSafe('<script>');

console.log('--- TEST 4: login_safe("admin", "admin123") ---');
loginSafe('admin', 'admin123');

console.log('--- TEST 5: login_safe("admin", "ab") ---');
loginSafe('admin', 'ab');

console.log('--- TEST 6: login_safe("ad min", "pass123") ---');
loginSafe('ad min', 'pass123');

db.close();