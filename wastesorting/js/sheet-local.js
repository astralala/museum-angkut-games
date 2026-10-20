/* ===== SIMPAN DATA HANYA DI LOCAL STORAGE (tanpa Google Sheets) =====
   Pengganti google-sheet/sheet.js. Pakai salah satu saja di index.html & hasil.html:
     <script src="google-sheet/sheet.js"></script>  -> kirim ke Google Sheets
     <script src="js/sheet-local.js"></script>  -> simpan di browser ini saja
   Data tersimpan di localStorage 'pilah_localdb' (tidak ikut terhapus oleh Ctrl+Y).
   Petugas: Ctrl+Shift+D untuk unduh semua data sebagai file CSV. */
const PERANGKAT = 'Display 1';   // nama layar/kios ini, supaya data tiap layar bisa dibedakan

const SheetQ = {
  key: 'pilah_localdb',
  load() { try { return JSON.parse(localStorage.getItem(this.key) || '[]') } catch (e) { return [] } },
  save(q) { try { localStorage.setItem(this.key, JSON.stringify(q)) } catch (e) {} },
  add(row) { const q = this.load(); q.push(row); this.save(q) },
  flush() {},
  csv() {
    const cols = ['t', 'nama', 'area', 'skor', 'kuis', 'total', 'waktu', 'benar', 'salah', 'perangkat'];
    const esc = v => '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"';
    const rows = this.load().map(r => cols.map(c => esc(c === 't' ? new Date(r.t).toLocaleString('id-ID') : r[c])).join(','));
    return [cols.join(',')].concat(rows).join('\r\n');
  },
  download() {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob(['﻿' + this.csv()], { type: 'text/csv' }));
    a.download = 'wastesorting-data.csv'; a.click();
  }
};
addEventListener('keydown', e => { if (e.ctrlKey && e.shiftKey && e.code === 'KeyD') { e.preventDefault(); SheetQ.download() } }, true);
