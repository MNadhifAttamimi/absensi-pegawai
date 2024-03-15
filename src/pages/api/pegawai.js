// pages/api/pegawai.js

// Import modul atau fungsi yang Anda butuhkan dari db.js
import { pool } from '../utils/db';

// Handler untuk endpoint GET (menampilkan data pegawai)
export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            // Lakukan kueri ke basis data untuk mendapatkan daftar pegawai
            const result = await pool.query('SELECT * FROM pegawai');
            res.status(200).json(result.rows);
        } catch (error) {
            console.error('Error fetching pegawai:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    } else if (req.method === 'POST') {
        try {
            // Mendapatkan data pegawai dari body permintaan
            const { nama, nip, status } = req.body;

            // Memastikan data nama dan NIP tidak kosong
            if (!nama || !nip) {
                return res.status(400).json({ message: 'Nama dan NIP diperlukan' });
            }

            // Lakukan kueri untuk menambahkan pegawai ke dalam basis data
            const result = await pool.query('INSERT INTO pegawai (nama, nip, status) VALUES ($1, $2, $3) RETURNING *', [nama, nip, status]);

            // Respon dengan data pegawai yang telah ditambahkan
            res.status(201).json(result.rows[0]);
        } catch (error) {
            console.error('Error adding pegawai:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    } else {
        // Menanggapi metode HTTP selain GET dan POST
        res.status(405).json({ message: 'Method not allowed' });
    }
}
