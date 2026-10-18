# Integrasi QR Code pada Game Eco Mission dan Waste Sorting

## Instruksi untuk Mas Adit

Mohon bantu menambahkan script pemindaian QR Code menggunakan camera pada halaman `index` di masing-masing folder game, yaitu **Eco Mission** dan **Waste Sorting**.

### 1. Eco Mission

**Alur kerja:**
1. Pengguna membuka halaman `index` Eco Mission.
2. Sistem melakukan pemindaian QR Code Pengunjung menggunakan webcam.
3. Sistem memvalidasi QR Code yang berhasil dipindai.
4. Jika QR Code valid, pengguna otomatis diarahkan ke halaman `Select Age`.
5. Jika QR Code tidak valid, sistem tidak melakukan navigasi dan tetap menunggu pemindaian berikutnya.

### 2. Waste Sorting

**Alur kerja:**
1. Pengguna membuka halaman `index` Waste Sorting.
2. Sistem melakukan pemindaian QR Code pengunjung menggunakan webcam.
3. Sistem memvalidasi QR Code yang berhasil dipindai.
4. Jika QR Code valid, pengguna otomatis diarahkan ke halaman `Home`.
5. Jika QR Code tidak valid, sistem tidak melakukan navigasi dan tetap menunggu pemindaian berikutnya.

### 3. Hasil Akhir yang Diharapkan

**Eco Mission:**
QR Code berhasil dipindai dan divalidasi → otomatis masuk ke halaman `Select Age`.

**Waste Sorting:**
QR Code berhasil dipindai dan divalidasi → otomatis masuk ke halaman `Home`.

Mohon implementasikan langsung pada proyek yang tersedia.
