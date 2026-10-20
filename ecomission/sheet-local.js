/* ===== SIMPAN DATA PEMAIN HANYA DI LOCAL STORAGE =====
   <script src="sheet-local.js"></script>         -> simpan di browser ini saja
   (di dalam folder misi, path-nya diawali ../)
   Data tersimpan di localStorage 'ecomission_log' (tidak ikut terhapus oleh Ctrl+Y).
   Petugas: Ctrl+Shift+D untuk unduh semua data sebagai file CSV. */
const PERANGKAT = 'Display 2';   // nama layar/kios ini, supaya data tiap layar bisa dibedakan

const USIA_LABEL = { under17: 'Kurang dari 17 tahun', over17: 'Lebih dari 17 tahun', keluarga: 'Keluarga' };
const LOG_KEY = 'ecomission_log';

function loadLog() { try { return JSON.parse(localStorage.getItem(LOG_KEY) || '[]') } catch (e) { return [] } }

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
  try { const log = loadLog(); log.push(row); localStorage.setItem(LOG_KEY, JSON.stringify(log)); } catch (e) {}
}

function unduhCSV() {
  const cols = ['t', 'usia', 'misi', 'nama', 'skor', 'waktu', 'hasil', 'perangkat'];
  const esc = v => '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"';
  const rows = loadLog().map(r => cols.map(c => esc(c === 't' ? new Date(r.t).toLocaleString('id-ID') : r[c])).join(','));
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob(['﻿' + [cols.join(',')].concat(rows).join('\r\n')], { type: 'text/csv' }));
  a.download = 'ecomission-data.csv'; a.click();
}
addEventListener('keydown', e => { if (e.ctrlKey && e.shiftKey && e.code === 'KeyD') { e.preventDefault(); unduhCSV() } }, true);
