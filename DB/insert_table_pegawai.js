"use strict";

require("dotenv").config({ path: ".env" });

const { sql } = require("@vercel/postgres");

async function execute() {
    try {
        // Lakukan penambahan data (insert) ke tabel absensi_pegawai
        const insertData = await sql`
            INSERT INTO absensi_pegawai (nama, nip, status)
            VALUES ('John Doe', '123456789', 'hadir')
            RETURNING *;
        `;
        console.log("Inserted data into absensi_pegawai:", insertData);
    } catch (err) {
        console.error("Error inserting data into absensi_pegawai:", err);
    }
}

execute();
