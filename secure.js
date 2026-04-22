const Database = require('better-sqlite3');
const db = new Database('nyondo_stock.db');

function searchProductSafe(name) {
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


function loginSafe(username, password) {
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

console.log('=== SECURE FUNCTIONS - SHOULD RETURN EMPTY RESULTS ===\n');

// Test 1: OR 1=1 attack - should return empty array
console.log('--- TEST 1: searchProductSafe("\\\' OR 1=1--") ---');
searchProductSafe("' OR 1=1--");

// Test 2: UNION attack - should return empty array
console.log('--- TEST 2: searchProductSafe("\\\' UNION SELECT id,username,password,role FROM users--") ---');
searchProductSafe("' UNION SELECT id,username,password,role FROM users--");

// Test 3: Login bypass with admin'-- - should return null
console.log('--- TEST 3: loginSafe("admin\'--", "anything") ---');
loginSafe("admin'--", "anything");

// Test 4: Always true login - should return null
console.log('--- TEST 4: loginSafe("\' OR \'1\'=\'1", "\' OR \'1\'=\'1") ---');
loginSafe("' OR '1'='1", "' OR '1'='1");

db.close();