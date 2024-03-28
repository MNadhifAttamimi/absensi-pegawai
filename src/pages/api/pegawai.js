// Import modul atau fungsi yang Anda butuhkan dari db.js
import { pool } from '../utils/db';

// Handler untuk endpoint GET (menampilkan data pegawai)
export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            // Mendapatkan tanggal dari query string
            const tanggal = req.query.tanggal;

            // Lakukan kueri ke basis data untuk mendapatkan daftar pegawai berdasarkan tanggal
            const result = await pool.query('SELECT * FROM pegawai WHERE tanggal_hadir::date = $1', [tanggal]);

            // Respon dengan data pegawai yang ditemukan
            res.status(200).json(result.rows);
        } catch (error) {
            console.error('Error fetching pegawai:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    } else if (req.method === 'POST') {
        try {
            // Mendapatkan data pegawai dari body permintaan
            const { nama, nip } = req.body;

            // Memastikan data nama dan NIP tidak kosong
            if (!nama || !nip) {
                return res.status(400).json({ message: 'Nama dan NIP diperlukan' });
            }

            // Lakukan kueri untuk menambahkan pegawai ke dalam basis data
            const result = await pool.query('INSERT INTO pegawai (nama, nip, tanggal_hadir, jam_hadir, status) VALUES ($1, $2, CURRENT_DATE, CURRENT_TIME, $3) RETURNING *', [nama, nip, 'hadir']);

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
