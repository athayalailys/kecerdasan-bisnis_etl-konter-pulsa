1. Instalasi

Pastikan kamu sudah menginstal:

Node.js (versi 18 ke atas)

npm (biasanya sudah satu paket dengan Node.js)

Lalu jalankan di terminal:

npm init -y
npm install sqlite3 moment


2. Setup Database

Jalankan file db-setup.js untuk membuat database awal (OLTP dan Data Warehouse) lengkap dengan data dummy:

node db-setup.js


Setelah dijalankan, kamu akan memiliki dua file database:

konter_oltp.db → Database transaksi harian (OLTP)

konter_pulsa.db → Database Data Warehouse (dimensional model)


3. Jalankan Proses ETL

Gunakan perintah berikut untuk mengeksekusi proses ETL:

node etl-process.js


Proses ini akan:

Extract data dari database OLTP

Transform menjadi format dimensional (menghitung date_id, payment_id, dsb)

Load hasilnya ke tabel fact_sales dan seluruh tabel dim_*


4. Output di Console

Setelah selesai, kamu akan melihat tampilan seperti ini di terminal:

✅ ETL Completed. Berikut isi tabel fact_sales:

┌────────────┬────────────┬────────────┬────────────┬────────────┐
│ branch_id  │ employee_id│ customer_id│ product_id │ total_trans│
├────────────┼────────────┼────────────┼────────────┼────────────┤
│ 1          │ 3          │ 2          │ 5          │ 100000     │
└────────────┴────────────┴────────────┴────────────┴────────────┘

📊 Contoh isi tabel dim_product:
┌────────────┬─────────────────┬─────────┬────────────┐
│ product_id │ product_name    │ nominal │ price      │
├────────────┼─────────────────┼─────────┼────────────┤
│ 1          │ Pulsa Telkomsel │ 10000   │ 12000      │
└────────────┴─────────────────┴─────────┴────────────┘
