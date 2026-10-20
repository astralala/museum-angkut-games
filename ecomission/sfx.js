// Suara tombol bersama (WebAudio, tanpa file).
// clickSfx()          : bunyi "tip/tik" tap layar yang tinggi, bening & singkat, untuk tombol.
// clickGo(url)        : bunyi "tip" lalu pindah halaman setelah bunyinya sempat terdengar.
let sfxCtx;
function clickSfx() {
  try {
    sfxCtx = sfxCtx || new (window.AudioContext || window.webkitAudioContext)();
    const t = sfxCtx.currentTime, o = sfxCtx.createOscillator(), g = sfxCtx.createGain();
    // Nada tinggi bening yang sangat singkat, sedikit turun: "tip/tik" seperti tap di layar HP
    o.type = 'sine';
    o.frequency.setValueAtTime(2000, t);
    o.frequency.exponentialRampToValueAtTime(1600, t + 0.04);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.18, t + 0.002);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
    o.connect(g).connect(sfxCtx.destination);
    o.start(t); o.stop(t + 0.07);
    // Lapisan "ting" halus satu oktaf di atas, memberi kilau
    const o2 = sfxCtx.createOscillator(), g2 = sfxCtx.createGain();
    o2.type = 'sine'; o2.frequency.setValueAtTime(4000, t);
    g2.gain.setValueAtTime(0.0001, t);
    g2.gain.exponentialRampToValueAtTime(0.036, t + 0.002);
    g2.gain.exponentialRampToValueAtTime(0.0001, t + 0.04);
    o2.connect(g2).connect(sfxCtx.destination);
    o2.start(t); o2.stop(t + 0.05);
  } catch (e) {}
}
function clickGo(url) {
  clickSfx();
  if (window.bgmGo) bgmGo(url);   // musik latar turun dulu (lebih lama dari bunyi tombol), lalu pindah
  else setTimeout(() => { location.href = url; }, 150);
}
