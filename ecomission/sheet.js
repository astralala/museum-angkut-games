/* ===== KIRIM DATA PEMAIN KE GOOGLE SHEETS =====
   Tempel URL Web App dari Google Apps Script di bawah (lihat google-sheet/PANDUAN.md).
   Kosongkan ('') untuk mematikan pengiriman; data tetap tersimpan di localStorage. */
const SHEET_URL = 'https://script.google.com/macros/s/AKfycbx-8Lt4vWJ3G7P1p_LOwx_21XpeUKoECsHu9swPVUk6wIf1MhBCIzG6Q4055yUtmwqi/exec';
const PERANGKAT = 'Display 2';   // nama layar/kios ini, supaya data tiap layar bisa dibedakan

const USIA_LABEL = { under17: 'Kurang dari 17 tahun', over17: 'Lebih dari 17 tahun', keluarga: 'Keluarga' };

/* Data disimpan dulu di antrean (localStorage), lalu dikirim.
   Kalau internet mati, antrean dikirim ulang saat halaman berikutnya dibuka.
   Salinan semua permainan juga disimpan di 'ecomission_log'. */
const SheetQ = {
  key: 'ecomission_sheetq',
  load() { try { return JSON.parse(localStorage.getItem(this.key) || '[]') } catch (e) { return [] } },
  save(q) { try { localStorage.setItem(this.key, JSON.stringify(q.slice(-500))) } catch (e) {} },
  add(row) { const q = this.load(); q.push(row); this.save(q); this.flush() },
  async flush() {
    if (!SHEET_URL || !navigator.onLine) return;
    let q = this.load();
    while (q.length) {
      try {
        /* text/plain + no-cors: tidak memicu preflight CORS di Apps Script */
        await fetch(SHEET_URL, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(q[0]) });
        q.shift(); this.save(q);
      } catch (e) { return }
    }
  }
};

/* Panggil saat satu misi selesai.
   misi: nama misi, nama: nama pemain, skor: angka skor, waktu: lama main (detik), hasil: keterangan singkat */
function catatMain({ misi, nama, skor = '', waktu = '', hasil = '' }) {
  let usia = '';
  try { usia = localStorage.getItem('ecomission_age') || ''; } catch (e) {}
  const row = {
    id: Date.now() + '-' + Math.random().toString(36).slice(2, 7),
    t: new Date().toISOString(),
    usia: USIA_LABEL[usia] || usia || '-',
    misi, nama: nama || 'Pemain', skor, waktu, hasil,
    perangkat: PERANGKAT
  };
  try {
    const log = JSON.parse(localStorage.getItem('ecomission_log') || '[]');
    log.push(row); localStorage.setItem('ecomission_log', JSON.stringify(log.slice(-2000)));
  } catch (e) {}
  SheetQ.add(row);
}

addEventListener('online', () => SheetQ.flush());
SheetQ.flush();
