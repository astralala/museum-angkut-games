// Preloader (dipakai di index.html): mengunduh seluruh aset game ke cache browser dengan progress bar,
// latar di belakangnya diburamkan. Hanya berjalan SEKALI per sesi (pertama kali game dibuka);
// kembali ke index sesudahnya tidak memuat ulang. Daftar file: preload-list.js (buat-preload-list.ps1).
(function () {
  // service worker lama sudah tidak dipakai: lepas sisa pendaftarannya di browser yang pernah membukanya
  if ('serviceWorker' in navigator) navigator.serviceWorker.getRegistrations().then(rs => rs.forEach(r => r.unregister())).catch(() => {});
  if ('caches' in window) caches.keys().then(ks => ks.forEach(k => { if (/^ecomission/.test(k)) caches.delete(k); })).catch(() => {});

  const KEY = 'eco_preloaded';
  try { if (sessionStorage.getItem(KEY) === '1') { window.PRELOAD_DONE = Promise.resolve(); return; } } catch (e) {}

  const list = window.PRELOAD_LIST || [];
  const isVideo = p => /\.(mp4|mp3)$/i.test(p);
  const wajib = list.filter(p => !isVideo(p));
  const video = list.filter(isVideo);

  const box = document.createElement('div');
  box.id = 'preloader';
  box.innerHTML = '<div class="pl-text">Memuat... <span>0%</span></div><div class="pl-bar"><i></i></div>';
  const css = document.createElement('style');
  css.textContent =
    '#preloader{position:fixed;inset:0;z-index:9999;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;background:rgba(0,0,0,.25);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);transition:opacity .5s;font:700 22px/1 system-ui,sans-serif;color:#fff;text-shadow:0 2px 6px rgba(0,0,0,.5)}' +
    '#preloader.done{opacity:0;pointer-events:none}' +
    '#preloader .pl-bar{width:min(60vw,520px);height:16px;border-radius:99px;background:rgba(255,255,255,.3);overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.3)}' +
    '#preloader .pl-bar i{display:block;height:100%;width:0;background:linear-gradient(90deg,#7ed957,#2fb34a);border-radius:99px;transition:width .2s}';
  document.head.appendChild(css);
  document.body.appendChild(box);
  const pct = box.querySelector('span'), bar = box.querySelector('i');

  async function jalankan() {
    let selesai = 0, i = 0;
    const worker = async () => {
      while (i < wajib.length) {
        try { await (await fetch(wajib[i++])).blob(); } catch (e) { /* satu file gagal tidak boleh menahan game */ }
        selesai++;
        const n = Math.round(selesai / wajib.length * 100);
        pct.textContent = n + '%'; bar.style.width = n + '%';
      }
    };
    await Promise.all(Array.from({ length: 6 }, worker));
    // Video & lagu besar diunduh di latar belakang, tidak menahan layar
    video.forEach(p => fetch(p).then(r => r.blob()).catch(() => {}));
  }

  const halamanSiap = new Promise(r => document.readyState === 'complete' ? r() : window.addEventListener('load', r));
  window.PRELOAD_DONE = Promise.all([jalankan(), halamanSiap]).then(() => {
    try { sessionStorage.setItem(KEY, '1'); } catch (e) {}
    box.classList.add('done');
    setTimeout(() => box.remove(), 600);
  });
})();
