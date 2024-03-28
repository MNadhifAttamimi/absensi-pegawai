"use strict";

require("dotenv").config({ path: ".env" });

const { sql } = require("@vercel/postgres");

async function execute() {
    const deleteTable = await sql`DROP TABLE IF EXISTS absensi_pegawai`;
    console.log(deleteTable);

    try {
        await sql`DROP TYPE IF EXISTS status_absensi_enum`;
    } catch (err) {
        console.log("Error deleting enum type: ", err);
    }

    const createEnum =
        await sql`CREATE TYPE status_absensi_enum AS ENUM('hadir', 'ijin', 'sakit', 'tanpa keterangan');`;

    const createTable = await sql`
    CREATE TABLE IF NOT EXISTS absensi_pegawai (
        id SERIAL PRIMARY KEY,
        nama VARCHAR(255) NOT NULL,
        nip VARCHAR(20) NOT NULL,
        tanggal_hadir DATE DEFAULT CURRENT_DATE,
        jam_hadir TIME DEFAULT CURRENT_TIME,
        status status_absensi_enum NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    `;
    console.log(`Created "absensi_pegawai" table `, createTable);
    return {
        createTable,
    };
}

execute();
