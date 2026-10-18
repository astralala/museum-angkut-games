/* ===== Musik latar Eco Mission: assets/Little_Forest_Steps.mp3, looping =====
   Dipasang di semua halaman (root & ketiga misi) lewat <script src=".../bgm.js">.
   - Halaman biasa: musik jalan di volume VOL dan nyambung saat pindah halaman (posisi disimpan di sessionStorage).
   - Halaman gameplay (gameplay.html / game.html) dan ending Makanan Sehat: musik lanjut lalu TURUN pelan-pelan sampai hening.
   - Halaman sesudahnya: musik NAIK pelan-pelan dari hening ke VOL.
   - Browser melarang suara sebelum layar disentuh: kalau autoplay ditolak, musik mulai di sentuhan/tombol pertama.
   - Ctrl+Shift+. (titik), untuk petugas: matikan / nyalakan musik (disimpan di localStorage, berlaku di semua halaman).
   Sama seperti musik latar WasteSorting. */
(function () {
  const FILE = 'assets/Little_Forest_Steps.mp3';   // ganti nama file di sini untuk mengganti lagu
  const VOL = .63, FADE_DOWN = 2000, FADE_UP = 2000;
  const BASE = (document.currentScript && document.currentScript.src || '').replace(/bgm\.js(\?.*)?$/, '');
  /* halaman tanpa musik: gameplay ketiga misi + ending Misi Makanan Sehat.
     Ending Energi Bersih & Kurangi Sampah tetap bermusik (musik naik lagi pelan-pelan sesudah gameplay). */
  const SILENT = /(^|\/)(gameplay|game)\.html$/.test(location.pathname) || /\/misi-makanan-lokal\/ending\.html$/.test(location.pathname);
  const K = 'eco_bgm_t_' + FILE, LIVE = 'eco_bgm_live', AFTER = 'eco_bgm_after', OFF = 'eco_bgm_off';
  const ss = {get: k => { try { return sessionStorage.getItem(k) } catch (e) { return null } },
              set: (k, v) => { try { sessionStorage.setItem(k, v) } catch (e) {} }};
  const isOff = () => { try { return localStorage.getItem(OFF) === '1' } catch (e) { return false } };

  const a = new Audio(); a.loop = true; a.preload = 'auto'; a.volume = 0;
  /* Lagu dimuat utuh dulu (fetch → blob) supaya selalu bisa di-seek ke posisi tersimpan, walau server
     tidak mendukung Range request (mis. server preview python). Kalau fetch gagal (mis. file://), pakai URL biasa. */
  /* Lagu disimpan di Cache Storage browser sekali saja; halaman berikutnya mengambilnya dari cache (tanpa jaringan),
     supaya jeda saat pindah halaman sesingkat mungkin. Cache Storage hanya ada di https/localhost; selain itu fetch biasa. */
  let ready = false;
  const load = src => { a.src = src; ready = true; start() };
  async function songBlob(url) {
    if ('caches' in window) {
      try {
        const c = await caches.open('eco-bgm-v1'); let r = await c.match(url);
        if (!r) { r = await fetch(url); if (!r.ok) throw 0; await c.put(url, r.clone()) }
        return await r.blob();
      } catch (e) {}
    }
    const r = await fetch(url); if (!r.ok) throw 0; return r.blob();
  }
  songBlob(BASE + FILE).then(b => load(URL.createObjectURL(b))).catch(() => load(BASE + FILE));
  /* lanjutkan dari posisi tersimpan. currentTime bisa diabaikan browser kalau info lagu belum termuat,
     jadi dipasang lagi saat loadedmetadata dan tepat sebelum play() */
  const t0 = parseFloat(ss.get(K)) || 0;
  let seeked = false;
  const seek = () => { if (seeked || !(t0 > 0)) return; try { a.currentTime = t0 } catch (e) {} if (a.readyState >= 1) seeked = true };
  a.addEventListener('loadedmetadata', seek);
  const wasLive = ss.get(LIVE) === '1', wasSilent = ss.get(AFTER) === '1';

  let fadeT;
  /* ubah volume dari nilai sekarang ke `to` dalam `ms` milidetik; `done` dipanggil di akhir */
  function fade(to, ms, done) {
    clearInterval(fadeT); const from = a.volume, s = performance.now();
    fadeT = setInterval(() => { const p = Math.min(1, (performance.now() - s) / ms); a.volume = from + (to - from) * p;
      if (p >= 1) { clearInterval(fadeT); done && done() } }, 30);
  }
  const save = () => { if (!ready || a.readyState < 1) return;   // lagu belum termuat: jangan timpa posisi tersimpan dengan 0
    ss.set(K, a.currentTime); if (!SILENT) ss.set(LIVE, !a.paused && a.volume > 0 ? '1' : '0') };

  function start() {
    if (!ready || !a.paused || isOff()) return;
    seek();
    if (SILENT) {                                    // gameplay: lanjut sebentar lalu turun pelan-pelan sampai hening
      if (!wasLive || silentDone) return;            // hanya SEKALI saat masuk; sentuhan/drag berikutnya tidak menyalakan musik lagi
      silentDone = true;
      a.volume = VOL; a.play().then(() => fade(0, FADE_DOWN, () => { save(); a.pause() })).catch(() => {});
      return;
    }
    if (wasLive) a.volume = VOL;
    a.play().then(() => {
      if (wasSilent) { a.volume = 0; fade(VOL, FADE_UP); ss.set(AFTER, '0') }   // sesudah gameplay: naik pelan-pelan
      else a.volume = VOL;
    }).catch(() => { a.volume = 0 });
  }
  let silentDone = false;
  if (SILENT) { ss.set(LIVE, '0'); ss.set(AFTER, '1') }

  const kick = () => { start(); if (ready && (!a.paused || SILENT)) { removeEventListener('pointerdown', kick, true); removeEventListener('keydown', kick, true) } };
  addEventListener('pointerdown', kick, true); addEventListener('keydown', kick, true);
  addEventListener('pagehide', save); setInterval(() => { if (!a.paused) save() }, 1000);

  addEventListener('keydown', e => {
    if (!(e.ctrlKey && e.shiftKey && !e.altKey && e.code === 'Period')) return;
    e.preventDefault(); e.stopPropagation();
    const off = !isOff(); try { localStorage.setItem(OFF, off ? '1' : '0') } catch (err) {}
    if (off) fade(0, 400, () => a.pause());
    else if (!SILENT) { a.volume = 0; a.play().then(() => fade(VOL, 400)).catch(() => {}) }
    const t = document.createElement('div'); t.textContent = off ? '🔇 Musik: mati' : '🎵 Musik: nyala';
    t.style.cssText = 'position:fixed;left:50%;top:24px;transform:translateX(-50%);z-index:99999;padding:10px 22px;border-radius:999px;background:rgba(0,0,0,.72);color:#fff;font:600 18px Arial,sans-serif;pointer-events:none;transition:opacity .4s';
    document.body.append(t); setTimeout(() => t.style.opacity = 0, 1200); setTimeout(() => t.remove(), 1700);
  }, true);

  window.BGM = a;
  start();
})();
