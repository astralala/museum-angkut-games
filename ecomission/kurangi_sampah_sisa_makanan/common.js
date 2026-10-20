const LB='fw_leaderboard';
// Leaderboard reset otomatis saat tab/web ditutup lalu dibuka lagi
if(!sessionStorage.getItem('fw_alive')){localStorage.removeItem(LB);sessionStorage.setItem('fw_alive','1');}
// Reset manual leaderboard: Ctrl+Y (Alt+1 juga masih bisa)
document.addEventListener('keydown',e=>{if((e.ctrlKey&&!e.shiftKey&&!e.altKey&&e.code==='KeyY')||(e.altKey&&(e.key==='1'||e.code==='Digit1'))){e.preventDefault();e.stopPropagation();
 if(!confirm('Hapus semua data leaderboard?'))return;localStorage.removeItem(LB);if(typeof renderLB==='function')renderLB();}},true);
// ===== Layar kaca buram saat memuat =====
// Halaman memakai loading.css (di <head>), <body class="loading">, dan <div id="veil"> di dalam .stage.
// Kelas `loading` dilepas setelah gambar (`load`), font, dan video di stage siap (maks. 6 detik).
// `pageReady` bisa dipakai halaman untuk menunda hal yang harus mulai setelah tampil (mis. timer game, suara).
const pageReady=Promise.race([
 Promise.all([
  new Promise(r=>document.readyState==='complete'?r():addEventListener('load',r,{once:true})),
  document.fonts?document.fonts.ready:null,
  ...[...document.querySelectorAll('.stage video')].map(v=>new Promise(r=>v.readyState>=3?r():v.addEventListener('canplay',r,{once:true})))
 ]),
 new Promise(r=>setTimeout(r,6000))
]).then(()=>document.body.classList.remove('loading'));

const S={get:(k,d)=>{try{const v=sessionStorage.getItem(k);return v===null?d:JSON.parse(v)}catch{return d}},set:(k,v)=>sessionStorage.setItem(k,JSON.stringify(v))};
const $=id=>document.getElementById(id);

// ===== Sound effect (disintesis dengan Web Audio, tanpa file audio) =====
const SFX=(()=>{let ctx,mute=localStorage.getItem('fw_mute')==='1';
 function ac(){if(!ctx){try{ctx=new(window.AudioContext||window.webkitAudioContext)()}catch{}}if(ctx&&ctx.state==='suspended')ctx.resume();return ctx}
 function tone(f,t0,d,type='sine',v=.2,f2){const c=ac();if(!c||mute)return;const o=c.createOscillator(),g=c.createGain(),t=c.currentTime+t0;
  o.type=type;o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+d);
  g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g);g.connect(c.destination);o.start(t);o.stop(t+d+.02)}
 return{
  click:()=>{tone(2000,0,.06,'sine',.18,1600);tone(4000,0,.04,'sine',.036)},  // "tip" sama dengan ../sfx.js
  pick:()=>tone(520,0,.06,'sine',.12),
  ok:()=>{tone(660,0,.1,'triangle',.2);tone(880,.09,.16,'triangle',.2)},
  bad:()=>tone(220,0,.28,'sawtooth',.12,110),
  tick:()=>tone(1000,0,.05,'square',.06),
  level:()=>[523,659,784,1047].forEach((f,i)=>tone(f,i*.1,.18,'triangle',.2)),
  timeup:()=>{tone(440,0,.2,'square',.1);tone(330,.2,.35,'square',.1)},
  win:()=>[523,659,784,659,784,1047].forEach((f,i)=>tone(f,i*.12,.22,'triangle',.18)),
  toggle(){mute=!mute;localStorage.setItem('fw_mute',mute?'1':'0');return mute},
  get muted(){return mute}}})();
document.addEventListener('pointerdown',()=>SFX.pick&&0,{once:true});
document.addEventListener('click',e=>{if(e.target.closest('.btn,.key,.homebtn'))SFX.click()});
// Pindah halaman sedikit ditunda agar bunyi klik sempat terdengar
const goTo=u=>window.bgmGo?bgmGo(u):setTimeout(()=>{location.href=u},150);
window.addEventListener('DOMContentLoaded',()=>{const st=document.querySelector('.stage');if(!st)return;
 const b=document.createElement('button');b.style.cssText='position:absolute;right:1.2cqw;top:1.2cqw;width:5.2cqw;height:5.2cqw;border-radius:50%;border:.35cqw solid #fff;background:#2d9a2f;font-size:2.6cqw;cursor:pointer;z-index:60;display:none'; /* tombol suara disembunyikan */
 if(SFX.muted)SFX.toggle(); /* tanpa tombol, pastikan suara tidak tertinggal dalam keadaan mute */
 b.title='Suara';b.textContent=SFX.muted?'🔇':'🔊';b.onclick=e=>{e.stopPropagation();b.textContent=SFX.toggle()?'🔇':'🔊';if(!SFX.muted)SFX.click()};st.append(b)});
