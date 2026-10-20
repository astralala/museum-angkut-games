const KEY_LB="misiEnergi_leaderboard",KEY_NAME="misiEnergi_name";
const fmt=ms=>{const s=Math.floor(ms/1000);return String(Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0")+"."+String(Math.floor(ms%1000/10)).padStart(2,"0")};
const getLB=()=>{try{return JSON.parse(localStorage.getItem(KEY_LB))||[]}catch(e){return[]}};
// Reset leaderboard (untuk petugas): Ctrl+Y
addEventListener('keydown',e=>{if(e.ctrlKey&&!e.shiftKey&&!e.altKey&&e.code==='KeyY'){e.preventDefault();e.stopPropagation();
 if(!confirm('Hapus semua data leaderboard?'))return;localStorage.removeItem(KEY_LB);location.reload()}},true);
// ===== Layar kaca buram saat memuat (sama seperti misi Kurangi Sampah) =====
// Halaman memakai loading.css (di <head>), <body class="loading">, dan <div id="veil"> di dalam .stage.
// Kelas `loading` dilepas setelah gambar (`load`), font, dan video di stage siap (maks. 6 detik).
// `pageReady` bisa dipakai halaman untuk menunda hal yang harus mulai setelah tampil (mis. timer game).
const pageReady=Promise.race([
 Promise.all([
  new Promise(r=>document.readyState==='complete'?r():addEventListener('load',r,{once:true})),
  document.fonts?document.fonts.ready:null,
  ...[...document.querySelectorAll('.stage video')].map(v=>new Promise(r=>v.readyState>=3?r():v.addEventListener('canplay',r,{once:true})))
 ]),
 new Promise(r=>setTimeout(r,6000))
]).then(()=>document.body.classList.remove('loading'));
const saveLB=e=>{const l=getLB();l.push(e);l.sort((a,b)=>a.time-b.time);localStorage.setItem(KEY_LB,JSON.stringify(l.slice(0,50)))};
