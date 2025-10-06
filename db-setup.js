const sqlite3 = require('sqlite3').verbose();

const oltp = new sqlite3.Database('./konter_oltp.db');

oltp.serialize(() => {
  oltp.run(`CREATE TABLE IF NOT EXISTS customers (
    customer_id INTEGER PRIMARY KEY,
    name VARCHAR,
    phone_number VARCHAR,
    email VARCHAR,
    created_at TIMESTAMP
  )`);

  oltp.run(`CREATE TABLE IF NOT EXISTS providers (
    provider_id INTEGER PRIMARY KEY,
    provider_name VARCHAR,
    provider_code VARCHAR,
    created_at TIMESTAMP
  )`);

  oltp.run(`CREATE TABLE IF NOT EXISTS product_categories (
    category_id INTEGER PRIMARY KEY,
    category_name VARCHAR,
    description TEXT
  )`);

  oltp.run(`CREATE TABLE IF NOT EXISTS products (
    product_id INTEGER PRIMARY KEY,
    provider_id INTEGER,
    category_id INTEGER,
    product_name VARCHAR,
    nominal INTEGER,
    price DECIMAL,
    cost_price DECIMAL,
    active BOOLEAN,
    created_at TIMESTAMP
  )`);

  oltp.run(`CREATE TABLE IF NOT EXISTS branches (
    branch_id INTEGER PRIMARY KEY,
    branch_name VARCHAR,
    address TEXT,
    city VARCHAR,
    phone_number VARCHAR,
    created_at TIMESTAMP
  )`);

  oltp.run(`CREATE TABLE IF NOT EXISTS employees (
    employee_id INTEGER PRIMARY KEY,
    branch_id INTEGER,
    name VARCHAR,
    role VARCHAR,
    phone_number VARCHAR,
    email VARCHAR,
    hire_date DATE,
    status VARCHAR,
    created_at TIMESTAMP
  )`);

  oltp.run(`CREATE TABLE IF NOT EXISTS transactions (
    transaction_id INTEGER PRIMARY KEY,
    branch_id INTEGER,
    employee_id INTEGER,
    customer_id INTEGER,
    transaction_date TIMESTAMP,
    payment_method VARCHAR,
    total_amount DECIMAL,
    status VARCHAR
  )`);

  oltp.run(`CREATE TABLE IF NOT EXISTS transaction_items (
    item_id INTEGER PRIMARY KEY,
    transaction_id INTEGER,
    product_id INTEGER,
    quantity INTEGER,
    unit_price DECIMAL,
    subtotal DECIMAL
  )`);
});

const dw = new sqlite3.Database('./konter_pulsa.db');

dw.serialize(() => {
  dw.run(`CREATE TABLE IF NOT EXISTS dim_branch (
    branch_id INTEGER PRIMARY KEY,
    branch_name VARCHAR,
    city VARCHAR,
    address TEXT,
    phone_number VARCHAR,
    opened_date DATE
  )`);

  dw.run(`CREATE TABLE IF NOT EXISTS dim_employee (
    employee_id INTEGER PRIMARY KEY,
    name VARCHAR,
    role VARCHAR,
    branch_id INTEGER,
    hire_date DATE,
    status VARCHAR
  )`);

  dw.run(`CREATE TABLE IF NOT EXISTS dim_customer (
    customer_id INTEGER PRIMARY KEY,
    name VARCHAR,
    phone_number VARCHAR,
    email VARCHAR,
    first_transaction_date DATE
  )`);

  dw.run(`CREATE TABLE IF NOT EXISTS dim_provider (
    provider_id INTEGER PRIMARY KEY,
    provider_name VARCHAR,
    provider_code VARCHAR
  )`);

  dw.run(`CREATE TABLE IF NOT EXISTS dim_category (
    category_id INTEGER PRIMARY KEY,
    category_name VARCHAR,
    description TEXT
  )`);

  dw.run(`CREATE TABLE IF NOT EXISTS dim_product (
    product_id INTEGER PRIMARY KEY,
    product_name VARCHAR,
    nominal INTEGER,
    price DECIMAL,
    provider_id INTEGER,
    category_id INTEGER
  )`);

  dw.run(`CREATE TABLE IF NOT EXISTS dim_payment (
    payment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    payment_method VARCHAR
  )`);

  dw.run(`CREATE TABLE IF NOT EXISTS dim_date (
    date_id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_date DATE,
    day INTEGER,
    month INTEGER,
    quarter INTEGER,
    year INTEGER,
    weekday VARCHAR
  )`);

  dw.run(`CREATE TABLE IF NOT EXISTS fact_sales (
    fact_id INTEGER PRIMARY KEY AUTOINCREMENT,
    branch_id INTEGER,
    employee_id INTEGER,
    customer_id INTEGER,
    product_id INTEGER,
    provider_id INTEGER,
    category_id INTEGER,
    date_id INTEGER,
    payment_id INTEGER,
    quantity INTEGER,
    unit_price DECIMAL,
    subtotal DECIMAL,
    total_transaction DECIMAL
  )`);
});

console.log("✅ Database setup completed!");
