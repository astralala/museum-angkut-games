# Panduan Petugas – Waste Sorting Hub

Tombol rahasia untuk petugas. Berlaku di **semua halaman** game.

## Pintasan

| Mau apa | Keyboard | Layar sentuh |
|---|---|---|
| **Reset leaderboard** (hapus papan skor & data sementara) | `Ctrl` + `Y` | Ketuk **pojok kiri atas** 5× dalam 3 detik |
| **Musik latar on/off** | `Ctrl` + `Shift` + `.` (titik) | – |
| **Unduh data pemain (CSV)** – hanya mode lokal | `Ctrl` + `Shift` + `D` | – |

### Catatan
- **Reset leaderboard** akan menanyakan konfirmasi dulu → pilih **OK**.
- **Musik on/off**: pilihan diingat, tetap berlaku walau halaman/browser dibuka ulang.
- **Musik tidak langsung bunyi** saat game dibuka: itu aturan browser, musik mulai setelah layar disentuh/diklik pertama kali.
- **Unduh CSV**: file `wastesorting-data.csv` masuk ke folder Downloads, bisa dibuka di Excel. Disarankan unduh rutin (mis. tiap sore), karena data lokal hilang kalau cache/riwayat browser dihapus.

## Melihat data di browser
`F12` → **Application** → **Local Storage** → alamat game → key `pilah_localdb`.
Atau di tab **Console** ketik: `console.table(SheetQ.load())`
