const sqlite3 = require('sqlite3').verbose();
const moment = require('moment');

const oltp = new sqlite3.Database('./konter_oltp.db');
const dw = new sqlite3.Database('./konter_pulsa.db');

function insertDimDate(dateStr, callback) {
  const d = moment(dateStr);
  const full_date = d.format("YYYY-MM-DD");
  const day = d.date();
  const month = d.month() + 1;
  const quarter = Math.ceil(month / 3);
  const year = d.year();
  const weekday = d.format("dddd");

  dw.run(
    `INSERT INTO dim_date (full_date, day, month, quarter, year, weekday)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [full_date, day, month, quarter, year, weekday],
    function (err) {
      if (err) return callback(err);
      callback(null, this.lastID);
    }
  );
}

oltp.serialize(() => {
  oltp.all(`
    SELECT * FROM transactions
    JOIN transaction_items USING(transaction_id)
    JOIN products USING(product_id)
    JOIN product_categories USING(category_id)
    JOIN providers USING(provider_id)
    JOIN employees USING(employee_id)
    JOIN customers USING(customer_id)
    JOIN branches USING(branch_id)
  `, (err, rows) => {
    if (err) throw err;

    rows.forEach(row => {
      insertDimDate(row.transaction_date, (err, date_id) => {
        if (err) console.error(err);

        dw.run(`INSERT OR IGNORE INTO dim_customer VALUES (?, ?, ?, ?, ?)`,
          [row.customer_id, row.name, row.phone_number, row.email, row.created_at]);

        dw.run(`INSERT OR IGNORE INTO dim_branch VALUES (?, ?, ?, ?, ?, ?)`,
          [row.branch_id, row.branch_name, row.city, row.address, row.phone_number, row.created_at]);

        dw.run(`INSERT OR IGNORE INTO dim_employee VALUES (?, ?, ?, ?, ?, ?)`,
          [row.employee_id, row.name, row.role, row.branch_id, row.hire_date, row.status]);

        dw.run(`INSERT OR IGNORE INTO dim_provider VALUES (?, ?, ?)`,
          [row.provider_id, row.provider_name, row.provider_code]);

        dw.run(`INSERT OR IGNORE INTO dim_category VALUES (?, ?, ?)`,
          [row.category_id, row.category_name, row.description]);

        dw.run(`INSERT OR IGNORE INTO dim_product VALUES (?, ?, ?, ?, ?, ?)`,
          [row.product_id, row.product_name, row.nominal, row.price, row.provider_id, row.category_id]);

        dw.run(`INSERT OR IGNORE INTO dim_payment (payment_method) VALUES (?)`, [row.payment_method]);

        dw.run(`INSERT INTO fact_sales (
          branch_id, employee_id, customer_id, product_id,
          provider_id, category_id, date_id, payment_id,
          quantity, unit_price, subtotal, total_transaction
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, 
          (SELECT payment_id FROM dim_payment WHERE payment_method = ?),
          ?, ?, ?, ?)`,
          [
            row.branch_id, row.employee_id, row.customer_id, row.product_id,
            row.provider_id, row.category_id, date_id, row.payment_method,
            row.quantity, row.unit_price, row.subtotal, row.total_amount
          ]
        );
      });
    });

     setTimeout(() => {
      console.log("\n✅ ETL Completed. Berikut isi tabel fact_sales:\n");
      dw.all(`SELECT * FROM fact_sales`, (err, factRows) => {
        if (err) throw err;
        console.table(factRows);

        // 🟢 Tambahan: tampilkan salah satu dimensi (contoh: dim_product)
        console.log("\n📊 Contoh isi tabel dim_product:\n");
        dw.all(`SELECT * FROM dim_product LIMIT 10`, (err, dimRows) => {
          if (err) throw err;
          console.table(dimRows);
        });
      });
    }, 1000);
  });
});