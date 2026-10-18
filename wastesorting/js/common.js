const P='pilah_';let mem={};
const S={
 get(k){try{const v=localStorage.getItem(P+k);if(v!==null)return v}catch(e){}return (P+k) in mem?mem[P+k]:null},
 set(k,v){v=String(v);try{localStorage.setItem(P+k,v)}catch(e){mem[P+k]=v}},
 reset(){['nama','area','skor','waktu','benar','salah','judul','kuis','saved'].forEach(k=>{try{localStorage.removeItem(P+k)}catch(e){}delete mem[P+k]})},
 board(){try{localStorage.removeItem(P+'leaderboard');return JSON.parse(sessionStorage.getItem(P+'leaderboard')||'[]')}catch(e){return []}},
 saveBoard(b){try{sessionStorage.setItem(P+'leaderboard',JSON.stringify(b))}catch(e){}}
};
let AC=null;
function tone(f,d,type,when,vol){if(window.MUTED)return;try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();AC.resume();const t=AC.currentTime+(when||0),o=AC.createOscillator(),g=AC.createGain();o.type=type||'sine';o.frequency.value=f;g.gain.setValueAtTime(vol||.2,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g);g.connect(AC.destination);o.start(t);o.stop(t+d)}catch(e){}}
/* Bunyi tombol "tip" tap layar, sama dengan ecomission/sfx.js: nada tinggi bening yang turun sedikit + kilau satu oktaf di atas */
function tip(){if(window.MUTED)return;try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();AC.resume();const t=AC.currentTime;
 [[2000,1600,.18,.06],[4000,4000,.036,.04]].forEach(([f1,f2,v,d])=>{const o=AC.createOscillator(),g=AC.createGain();o.type='sine';
  o.frequency.setValueAtTime(f1,t);o.frequency.exponentialRampToValueAtTime(f2,t+d*.66);
  g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v,t+.002);g.gain.exponentialRampToValueAtTime(.0001,t+d);
  o.connect(g);g.connect(AC.destination);o.start(t);o.stop(t+d+.01)})}catch(e){}}
const SFX={pick(){tone(520,.08,'sine',0,.12)},tick(){tone(1000,.05,'square',0,.08)},win(){[523,659,784,1047].forEach((f,i)=>tone(f,.2,'triangle',i*.12,.25))},lose(){[400,330,260].forEach((f,i)=>tone(f,.25,'sine',i*.18,.22))},click(){tip()},good(){tone(660,.12,'triangle',0,.25);tone(880,.18,'triangle',.1,.25)},bad(){tone(180,.25,'sawtooth',0,.18);tone(130,.25,'sawtooth',.12,.18)}};
/* ===== Musik latar: assets/videos/<BGM_FILE>, pelan & looping =====
   Posisi lagu disimpan di sessionStorage supaya saat pindah halaman musik lanjut (tidak mulai dari awal).
   Browser melarang suara sebelum layar disentuh: kalau autoplay ditolak, musik mulai di sentuhan/tombol pertama.
   Ikut tombol mute (window.MUTED).
   Di halaman permainan pilah sampah (game-*.html) dan kuis (kuis.html) musik DIAM: goTo() memudarkannya sebelum masuk,
   dan setelah kuis musik muncul lagi pelan-pelan (di hasil.html) dari posisi terakhir sebelum game.
   BGM_ON = false untuk mematikan musik latar. */
const BGM_ON=true;
const BGM_SILENT=url=>/(^|\/)(game-[^\/]*|kuis\.html)$/.test(String(url).split(/[?#]/)[0]);   // halaman tanpa musik: game pilah sampah & kuis
const BGM_FILE='BouncyGameGroove.mp3';   // ganti nama file di sini untuk mengganti lagu (file di assets/videos/)
/* kunci posisi memakai nama file, supaya lagu baru mulai dari awal (bukan dari posisi lagu lama) */
const BGM=BGM_ON&&(()=>{const a=new Audio(),VOL=.63,K='pilah_bgm_t_'+BGM_FILE;a.loop=true;a.preload='auto';a.volume=0;
 /* lanjutkan dari posisi tersimpan. currentTime bisa diabaikan browser kalau info lagu belum termuat,
    jadi dipasang saat loadedmetadata dan tepat sebelum play() */
 const T0=(()=>{try{return parseFloat(sessionStorage.getItem(K))||0}catch(e){return 0}})();let seeked=false,ready=false;
 const seek=()=>{if(seeked||!(T0>0))return;try{a.currentTime=T0}catch(e){}if(a.readyState>=1)seeked=true};
 a.addEventListener('loadedmetadata',seek);
 /* musik langsung di volume penuh (tanpa naik pelan-pelan) */
 let fadeT;function fadeIn(){clearInterval(fadeT);a.volume=VOL}
 /* naik pelan-pelan dari hening ke VOL dalam ms milidetik (dipakai sesudah game/kuis) */
 function fadeUp(ms){clearInterval(fadeT);a.volume=0;const t0=performance.now();fadeT=setInterval(()=>{const p=Math.min(1,(performance.now()-t0)/ms);a.volume=VOL*p;if(p>=1)clearInterval(fadeT)},30)}
 /* pudar sampai hilang dalam ms milidetik, lalu berhenti */
 a.fadeOut=ms=>{clearInterval(fadeT);const v0=a.volume,t0=performance.now();fadeT=setInterval(()=>{const p=Math.min(1,(performance.now()-t0)/ms);a.volume=v0*(1-p);if(p>=1){clearInterval(fadeT);a.pause()}},30)};
 /* LIVE = musik sedang jalan saat halaman sebelumnya ditutup. Kalau ya, halaman ini langsung lanjut di volume penuh
    (tidak "hilang lalu naik lagi"); fade-in hanya saat musik baru mulai atau kembali dari game/kuis. */
 const LIVE='pilah_bgm_live',wasLive=(()=>{try{return sessionStorage.getItem(LIVE)==='1'}catch(e){return false}})();
 /* AFTER = baru keluar dari game/kuis: musik di halaman berikutnya naik pelan-pelan (fadeUp) */
 const AFTER='pilah_bgm_after',wasSilent=(()=>{try{return sessionStorage.getItem(AFTER)==='1'}catch(e){return false}})();
 if(BGM_SILENT(location.pathname)){try{sessionStorage.setItem(LIVE,'0');sessionStorage.setItem(AFTER,'1')}catch(e){}return a}   // halaman game/kuis: jangan putar, posisi tersimpan dipakai sesudahnya
 /* Lagu dimuat utuh dulu (fetch → blob) supaya selalu bisa di-seek ke posisi tersimpan, walau server tidak
    mendukung Range request. Kalau fetch gagal (mis. file://), pakai URL biasa. */
 /* Lagu disimpan di Cache Storage browser sekali saja; halaman berikutnya mengambilnya dari cache (tanpa jaringan),
    supaya jeda saat pindah halaman sesingkat mungkin. Cache Storage hanya ada di https/localhost; selain itu fetch biasa. */
 const load=src=>{a.src=src;ready=true;start()};
 const songBlob=async url=>{if('caches' in window){try{const c=await caches.open('pilah-bgm-v1');let r=await c.match(url);
   if(!r){r=await fetch(url);if(!r.ok)throw 0;await c.put(url,r.clone())}return await r.blob()}catch(e){}}
  const r=await fetch(url);if(!r.ok)throw 0;return r.blob()};
 const SRC=new URL('assets/videos/'+BGM_FILE,location.href).href;
 songBlob(SRC).then(b=>load(URL.createObjectURL(b))).catch(()=>load(SRC));
 const save=()=>{if(!ready||a.readyState<1)return;   // lagu belum termuat: jangan timpa posisi tersimpan dengan 0
  try{sessionStorage.setItem(K,a.currentTime);sessionStorage.setItem(LIVE,!a.paused&&a.volume>0?'1':'0')}catch(e){}};
 /* Ctrl+Shift+. (titik) (untuk petugas): matikan / nyalakan musik latar. Pilihan disimpan di localStorage, berlaku di semua halaman. */
 const OFF='pilah_bgm_off',isOff=()=>{try{return localStorage.getItem(OFF)==='1'}catch(e){return false}};
 addEventListener('keydown',e=>{if(!(e.ctrlKey&&e.shiftKey&&!e.altKey&&e.code==='Period'))return;e.preventDefault();e.stopPropagation();
  const off=!isOff();try{localStorage.setItem(OFF,off?'1':'0')}catch(e){}
  if(off)a.fadeOut(400);else{a.volume=0;a.play().then(fadeIn).catch(()=>{})}
  const t=document.createElement('div');t.textContent=off?'🔇 Musik: mati':'🎵 Musik: nyala';
  t.style.cssText='position:fixed;left:50%;top:24px;transform:translateX(-50%);z-index:9999;padding:10px 22px;border-radius:999px;background:rgba(0,0,0,.72);color:#fff;font:600 18px Arial,sans-serif;pointer-events:none;transition:opacity .4s';
  document.body.append(t);setTimeout(()=>t.style.opacity=0,1200);setTimeout(()=>t.remove(),1700)},true);
 function start(){if(!ready||!a.paused||isOff())return;seek();if(wasLive)a.volume=VOL;
  a.play().then(()=>{if(wasSilent){fadeUp(2000);try{sessionStorage.setItem(AFTER,'0')}catch(e){}}else if(!wasLive)fadeIn()}).catch(()=>{a.volume=0})}
 const kick=()=>{start();if(ready&&!a.paused){removeEventListener('pointerdown',kick,true);removeEventListener('keydown',kick,true)}};
 addEventListener('pointerdown',kick,true);addEventListener('keydown',kick,true);
 addEventListener('pagehide',save);setInterval(save,1000);
 setInterval(()=>{a.muted=!!window.MUTED},250);
 start();return a})();
function need(k,to){if(S.get(k)===null){location.replace(to||'home.html')}}

window.K=1;
function fit(){const f=document.getElementById('frame');if(!f)return;const k=Math.min(innerWidth/1080,innerHeight/1920);window.K=k;f.style.transform='translate('+(-540*k)+'px,'+(-960*k)+'px) scale('+k+')';
 /* frame disembunyikan di CSS sampai ukurannya pas, supaya tidak sempat tampil besar lalu "zoom" mengecil */
 f.style.visibility='visible'}
addEventListener('resize',fit);addEventListener('orientationchange',fit);fit();

/* pindah halaman dengan efek blur keluar */
/* Menuju halaman game/kuis saat musik nyala: musik memudar pelan 1.5 dtk, perpindahan ditunda sampai pudarnya selesai */
function goTo(url){let wait=450;
 if(BGM&&BGM_SILENT(url)&&!BGM.paused){BGM.fadeOut(1500);wait=1500}
 const f=document.getElementById('frame');if(!f){setTimeout(()=>{location.href=url},wait-450);return}
 setTimeout(()=>{f.classList.remove('blurin');f.classList.add('pg-out')},wait-450);setTimeout(()=>{location.href=url},wait)}
/* kalau kembali lewat tombol back (bfcache), hilangkan sisa blur */
addEventListener('pageshow',e=>{if(e.persisted){const f=document.getElementById('frame');if(f)f.classList.remove('pg-out')}});

function pageId(){return (location.pathname.split('/').pop()||'index').replace('.html','')}
/* Pasang gambar assets/bg/<nama-halaman>.png di atas latar bawaan (kalau file ada). */
function layerBg(el,id){id=id||pageId();const cur=getComputedStyle(el).backgroundImage;
 el.style.backgroundImage="url('assets/bg/"+id+".png'), "+cur;el.style.backgroundSize='cover, auto';el.style.backgroundPosition='center, center';el.style.backgroundRepeat='no-repeat, no-repeat'}
(function(){const f=document.getElementById('frame');if(f&&!window.CFG)layerBg(f)})();

/* Reset leaderboard rahasia (untuk petugas):
   - keyboard: Ctrl+Y (hapus semua localStorage & sessionStorage)
   - layar sentuh: ketuk pojok kiri atas 5x dalam 3 detik */
function resetBoard(){if(!confirm('Hapus semua data (leaderboard & storage)?'))return;
 /* antrean Google Sheets (pilah_sheetq) tetap disimpan supaya data yang belum terkirim tidak hilang */
 try{const q=localStorage.getItem('pilah_sheetq');localStorage.clear();if(q!==null)localStorage.setItem('pilah_sheetq',q)}catch(e){}try{sessionStorage.clear()}catch(e){}mem={};location.reload()}
addEventListener('keydown',e=>{if(e.ctrlKey&&!e.shiftKey&&!e.altKey&&e.code==='KeyY'){e.preventDefault();e.stopPropagation();resetBoard()}},true);
(function(){let n=0,t0=0;addEventListener('pointerdown',e=>{if(e.clientX>120||e.clientY>120)return;
 const now=Date.now();if(now-t0>3000){n=0;t0=now}if(++n>=5){n=0;resetBoard()}},true)})();
