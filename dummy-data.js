const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./konter_oltp.db');

db.serialize(() => {
  db.run("DELETE FROM customers");
  db.run("DELETE FROM providers");
  db.run("DELETE FROM product_categories");
  db.run("DELETE FROM products");
  db.run("DELETE FROM branches");
  db.run("DELETE FROM employees");
  db.run("DELETE FROM transactions");
  db.run("DELETE FROM transaction_items");

  db.run(`INSERT INTO customers VALUES (1, 'Rina', '08123456789', 'rina@example.com', '2024-10-01 10:00:00')`);
  db.run(`INSERT INTO providers VALUES (1, 'Telkomsel', 'TSEL', '2024-01-01')`);
  db.run(`INSERT INTO product_categories VALUES (1, 'Pulsa', 'Voucher isi ulang')`);
  db.run(`INSERT INTO products VALUES (1, 1, 1, 'Pulsa Telkomsel 50K', 50000, 55000, 50000, 1, '2024-02-01')`);
  db.run(`INSERT INTO branches VALUES (1, 'Konter Pusat', 'Jl. Merdeka 1', 'Banjarmasin', '0511-123456', '2024-01-01')`);
  db.run(`INSERT INTO employees VALUES (1, 1, 'Ghazi', 'Kasir', '081987654321', 'ghazi@konter.com', '2024-01-15', 'Active', '2024-01-15')`);
  db.run(`INSERT INTO transactions VALUES (1, 1, 1, 1, '2024-10-06 14:00:00', 'Cash', 55000, 'Completed')`);
  db.run(`INSERT INTO transaction_items VALUES (1, 1, 1, 1, 55000, 55000)`);
});

console.log("✅ Dummy data inserted!");
