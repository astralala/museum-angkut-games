# Panduan Petugas – Eco Mission Challenge

Tombol rahasia untuk petugas.

## Pintasan

| Mau apa | Tombol | Berlaku di |
|---|---|---|
| **Reset leaderboard** | `Ctrl` + `Y` | Di dalam masing-masing game (hanya leaderboard game itu yang dihapus) |
| **Reset leaderboard** (alternatif) | `Alt` + `1` | Kurangi Sampah Sisa Makanan saja |
| **Musik latar on/off** | `Ctrl` + `Shift` + `.` (titik) | Semua halaman |
| **Unduh data pemain (CSV)** – hanya mode lokal | `Ctrl` + `Shift` + `D` | Halaman awal & halaman gameplay |
| |

### Catatan
- **Reset leaderboard** menanyakan konfirmasi dulu → pilih **OK**. Data pemain yang tersimpan (`ecomission_log`) **tidak** ikut terhapus.
- Leaderboard **Kurangi Sampah** juga otomatis kosong setiap browser dibuka ulang.
- **Musik on/off**: muncul tulisan kecil "Musik: mati / nyala" di atas layar. Pilihan diingat walau browser dibuka ulang.
- **Musik tidak langsung bunyi** saat game dibuka: aturan browser, musik mulai setelah layar disentuh/diklik pertama kali.
- **Unduh CSV**: file `ecomission-data.csv` masuk ke folder Downloads, bisa dibuka di Excel. Disarankan unduh rutin (mis. tiap sore), karena data lokal hilang kalau cache/riwayat browser dihapus.

## Melihat data di browser
`F12` → **Application** → **Local Storage** → alamat game → key `ecomission_log`.
Atau di tab **Console** ketik: `console.table(loadLog())` (mode lokal).
