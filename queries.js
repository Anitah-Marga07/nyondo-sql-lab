const Database = require('better-sqlite3');
const db = new Database('nyondo_stock.db');

console.log('=== TASK 2: SQL QUERIES ===\n');

// Query A: Select all products
console.log('Query A: SELECT * FROM products');
const allProducts = db.prepare('SELECT * FROM products').all();
console.log('Output:', allProducts);
console.log();

// Query B: Select products with price less than 50000
console.log('Query B: SELECT * FROM products WHERE price < 50000');
const cheapProducts = db.prepare('SELECT * FROM products WHERE price < 50000').all();
console.log('Output:', cheapProducts);
console.log();

// Query C: Select products with price greater than 100000
console.log('Query C: SELECT * FROM products WHERE price > 100000');
const expensiveProducts = db.prepare('SELECT * FROM products WHERE price > 100000').all();
console.log('Output:', expensiveProducts);
console.log();

// Query D: Select products ordered by price descending
console.log('Query D: SELECT * FROM products ORDER BY price DESC');
const priceDesc = db.prepare('SELECT * FROM products ORDER BY price DESC').all();
console.log('Output:', priceDesc);
console.log();

// Query E: Count total number of products
console.log('Query E: SELECT COUNT(*) as total FROM products');
const count = db.prepare('SELECT COUNT(*) as total FROM products').get();
console.log('Output:', count);
console.log();

// Query F: Select product with highest price
console.log('Query F: SELECT * FROM products ORDER BY price DESC LIMIT 1');
const mostExpensive = db.prepare('SELECT * FROM products ORDER BY price DESC LIMIT 1').get();
console.log('Output:', mostExpensive);
console.log();

// Query G: Select product with lowest price
console.log('Query G: SELECT * FROM products ORDER BY price ASC LIMIT 1');
const cheapest = db.prepare('SELECT * FROM products ORDER BY price ASC LIMIT 1').get();
console.log('Output:', cheapest);
console.log();

db.close();