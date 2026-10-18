/* ===== KIRIM DATA KE GOOGLE SHEETS =====
   Tempel URL Web App dari Google Apps Script di bawah (lihat google-sheet/PANDUAN.md).
   Kosongkan ('') untuk mematikan pengiriman. */
const SHEET_URL = 'https://script.google.com/macros/s/AKfycbyPyHFJbZC8jV1PwmLvQ8YxCex96B9KWEyGpfsMc7pOEBUDLdSE1DamVsieLK_7cEVqDw/exec';
const PERANGKAT = 'Display 1';   // nama layar/kios ini, supaya data tiap layar bisa dibedakan

/* Data disimpan dulu di antrean (localStorage), lalu dikirim.
   Kalau internet mati, antrean dikirim ulang saat halaman berikutnya dibuka. */
const SheetQ = {
  key: 'pilah_sheetq',
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
addEventListener('online', () => SheetQ.flush());
SheetQ.flush();
