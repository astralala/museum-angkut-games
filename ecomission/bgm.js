/* ===== Musik latar Eco Mission: assets/Mainkanlah_Lagu Ini.mp3, looping =====
   Dipasang di semua halaman (root & ketiga misi) lewat <script src=".../bgm.js">.
   - Halaman biasa: musik jalan di volume VOL dan nyambung saat pindah halaman (posisi disimpan di sessionStorage).
   - Halaman gameplay (gameplay.html / game.html) dan ending Makanan Sehat: musik lanjut lalu TURUN pelan-pelan sampai hening.
   - Halaman sesudahnya: musik NAIK pelan-pelan dari hening ke VOL.
   - Browser melarang suara sebelum layar disentuh: kalau autoplay ditolak, musik mulai di sentuhan/tombol pertama.
   - Ctrl+Shift+. (titik), untuk petugas: matikan / nyalakan musik (disimpan di localStorage, berlaku di semua halaman).
   Sama seperti musik latar WasteSorting. */
/* ===== Transisi halaman: fade dari hitam saat halaman dibuka, fade ke hitam sebelum pindah ===== */
(function () {
  /* Lapisan hitam di atas seluruh halaman; yang dianimasikan opacity-nya (paling ringan).
     Masuk: dari hitam memudar ke halaman. Keluar: halaman memudar ke hitam lalu pindah.
     Sesudah jelas, lapisan disembunyikan total (display:none) supaya tidak membebani selama bermain. */
  const st = document.createElement('style');
  st.textContent = '#pgBlur{position:fixed;inset:0;z-index:2147483646;pointer-events:none;background:rgba(255,255,255,.12);-webkit-backdrop-filter:blur(28px) saturate(1.3);backdrop-filter:blur(28px) saturate(1.3);opacity:1;transition:opacity .6s ease-in-out}' +
    '#pgBlur.clear{opacity:0}#pgBlur.out{opacity:1;pointer-events:auto}#pgBlur.gone{display:none}' +
    /* penutup hitam sejak frame PERTAMA (sebelum <body> ada), supaya halaman tidak sempat tampil lalu tertutup lagi */
    /* selama halaman baru belum siap, latar terang (bukan hitam) supaya tidak ada kilatan hitam di antara halaman */
    /* (sampai gambar latar halaman selesai dimuat, karena stage transparan sebelum gambarnya ada) */
    'html:not(.pg-loaded),html:not(.pg-loaded) body{background:#cfe6ef!important}' +
    'html:not(.pg-ready)::after{content:"";position:fixed;inset:0;z-index:2147483647;-webkit-backdrop-filter:blur(28px);backdrop-filter:blur(28px)}';
  document.head.appendChild(st);
  const veil = document.createElement('div'); veil.id = 'pgBlur';
  const mount = () => {
    document.body.appendChild(veil); document.documentElement.classList.add('pg-ready');
  };
  /* blur baru dibuka sesudah semua gambar halaman termuat, supaya halaman muncul utuh */
  const reveal = () => {
    requestAnimationFrame(() => requestAnimationFrame(() => {
      veil.classList.add('clear');
      setTimeout(() => { if (veil.classList.contains('clear')) veil.classList.add('gone') }, 700);
    }));
  };
  if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);
  const loaded = () => { document.documentElement.classList.add('pg-loaded'); reveal() };
  if (document.readyState === 'complete') loaded(); else addEventListener('load', loaded);
  /* blurOut(ms): halaman memudar ke hitam selama ms milidetik (barengan dengan musik yang memudar) */
  window.blurOut = ms => {
    veil.style.transitionDuration = (ms || 450) + 'ms';
    veil.classList.remove('gone'); veil.offsetWidth; veil.classList.remove('clear'); veil.classList.add('out');
  };
  /* kembali lewat tombol back (bfcache): hilangkan sisa lapisan */
  addEventListener('pageshow', e => { if (e.persisted) { veil.classList.remove('out'); veil.classList.add('clear', 'gone') } });
  /* cadangan kalau musik mati: tetap blur keluar dulu lalu pindah */
  window.bgmGo = (url, replace) => { blurOut(450); setTimeout(() => replace ? location.replace(url) : (location.href = url), 450) };
  addEventListener('click', e => {
    if (window.BGM) return;   // musik nyala: link ditangani di bawah
    const l = e.target.closest && e.target.closest('a[href]');
    if (!l || e.defaultPrevented || e.button || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
    if ((l.target && l.target !== '_self') || l.hasAttribute('download') || l.origin !== location.origin || l.getAttribute('href').startsWith('#')) return;
    e.preventDefault(); bgmGo(l.href);
  });
})();

(function () {
  const BGM_ON = true;   // false = musik latar dimatikan; ganti ke true untuk menyalakan lagi
  if (!BGM_ON) return;
  const FILE = 'assets/Mainkanlah_Lagu Ini.mp3';   // ganti nama file di sini untuk mengganti lagu
  const VOL = .27, FADE_DOWN = 2000, FADE_UP = 2000;
  const FADE_OUT = 600, FADE_IN = 1600;   // pindah halaman (FADE_OUT = lama layar memudar ke hitam juga): musik turun dulu sebelum pindah, lalu naik lagi di halaman baru
  const BASE = (document.currentScript && document.currentScript.src || '').replace(/bgm\.js(\?.*)?$/, '');
  /* halaman tanpa musik: gameplay ketiga misi + ending Misi Makanan Sehat.
     Ending Energi Bersih & Kurangi Sampah tetap bermusik (musik naik lagi pelan-pelan sesudah gameplay). */
  const SILENT = /(^|\/)(gameplay|game)\.html$/.test(location.pathname) || /\/misi-makanan-lokal\/ending\.html$/.test(location.pathname);
  const K = 'eco_bgm_t_' + FILE, LIVE = 'eco_bgm_live', AFTER = 'eco_bgm_after', OFF = 'eco_bgm_off';
  const ss = {get: k => { try { return sessionStorage.getItem(k) } catch (e) { return null } },
              set: (k, v) => { try { sessionStorage.setItem(k, v) } catch (e) {} }};
  const isOff = () => { try { return localStorage.getItem(OFF) !== '0' } catch (e) { return true } };   // default: mati

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
  /* ubah volume dari nilai sekarang ke `to` dalam `ms` milidetik; `done` dipanggil di akhir.
     Kurva kuadrat (naik: p², turun: (1-p)²) terdengar lebih halus di telinga dibanding garis lurus. */
  function fade(to, ms, done) {
    clearInterval(fadeT); const from = a.volume, s = performance.now();
    fadeT = setInterval(() => { const p = Math.min(1, (performance.now() - s) / ms);
      a.volume = to > from ? from + (to - from) * p * p : to + (from - to) * (1 - p) * (1 - p);
      if (p >= 1) { clearInterval(fadeT); a.volume = to; done && done() } }, 30);
  }
  let leaving = false;
  const save = () => { if (leaving || !ready || a.readyState < 1) return;   // lagu belum termuat: jangan timpa posisi tersimpan dengan 0
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
    a.volume = 0;
    a.play().then(() => {
      if (wasSilent) { fade(VOL, FADE_UP); ss.set(AFTER, '0') }   // sesudah gameplay: naik pelan-pelan
      else fade(VOL, FADE_IN);                                    // halaman biasa: naik singkat supaya sambungannya halus
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

  /* bgmGo(url): turunkan musik pelan-pelan, simpan posisinya, baru pindah halaman.
     Dipakai clickGo/goTo dan semua link <a>. Kalau musik tidak sedang bunyi, langsung pindah. */
  window.bgmGo = (url, replace) => {
    const nav = () => replace ? location.replace(url) : (location.href = url);
    if (leaving) return;
    leaving = true;
    if (SILENT || a.paused || a.volume <= 0) { blurOut(450); return setTimeout(nav, 450) }
    blurOut(FADE_OUT);
    let gone = false;
    const go = () => { if (gone) return; gone = true; clearInterval(fadeT);
      ss.set(K, a.currentTime); ss.set(LIVE, '1'); nav() };
    fade(0, FADE_OUT, go);
    setTimeout(go, FADE_OUT + 250);   // cadangan kalau timer fade tertahan
  };
  addEventListener('click', e => {
    const l = e.target.closest && e.target.closest('a[href]');
    if (!l || e.defaultPrevented || e.button || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
    if ((l.target && l.target !== '_self') || l.hasAttribute('download') || l.origin !== location.origin || l.getAttribute('href').startsWith('#')) return;
    e.preventDefault(); bgmGo(l.href);
  });

  addEventListener('pageshow', e => { if (e.persisted) leaving = false });
  window.BGM = a;
  start();
})();
