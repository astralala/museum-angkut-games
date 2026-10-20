// Sound effect dibuat dengan WebAudio (tanpa file audio). Tombol 🔊 di pojok kanan atas untuk mute.
const SFX=(()=>{let ctx;const on=()=>localStorage.getItem('mml_mute')!=='1';
function tone(f,d=.12,type='sine',v=.2,t0=0,f2){if(!on())return;try{ctx=ctx||new (window.AudioContext||window.webkitAudioContext)();ctx.resume();
 const t=ctx.currentTime+t0,o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.setValueAtTime(f,t);
 if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+d);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+d);
 o.connect(g);g.connect(ctx.destination);o.start(t);o.stop(t+d)}catch(e){}}
const seq=(fs,d,type,v,gap)=>fs.forEach((f,i)=>tone(f,d,type,v,i*gap));
// click: bunyi "tip" tap layar yang sama dengan ../sfx.js (nada tinggi bening + kilau satu oktaf di atas)
return{click:()=>{tone(2000,.06,'sine',.18,0,1600);tone(4000,.04,'sine',.036)},pick:()=>tone(440,.08,'triangle'),
 drop:()=>{tone(520,.1);tone(780,.12,'sine',.2,.08)},wrong:()=>tone(220,.25,'sawtooth',.12,0,110),
 tick:()=>tone(900,.03,'square',.04),go:()=>seq([523,659,784],.15,'triangle',.2,.1),
 win:()=>seq([523,659,784,1047,1319],.25,'triangle',.25,.15),lose:()=>seq([392,330,262,196],.3,'sawtooth',.12,.22),
 coin:()=>{tone(988,.08,'square',.1);tone(1319,.25,'square',.1,.08)},on}})();
document.addEventListener('click',e=>{if(e.target.closest('.btn,.key,a,#play'))SFX.click()});
// Pindah halaman sedikit ditunda agar bunyi klik sempat terdengar
const goTo=u=>window.bgmGo?bgmGo(u):setTimeout(()=>{location.href=u},150);
// Reset leaderboard (untuk petugas): Ctrl+Y
addEventListener('keydown',e=>{if(e.ctrlKey&&!e.shiftKey&&!e.altKey&&e.code==='KeyY'){e.preventDefault();e.stopPropagation();
 if(!confirm('Hapus semua data leaderboard?'))return;localStorage.removeItem('mml_leaderboard');localStorage.removeItem('mml_last_id');location.reload()}},true);
addEventListener('DOMContentLoaded',()=>{const b=document.createElement('button');b.className='key';
 // Tombol mute disembunyikan sementara; hapus 'display:none' untuk menampilkannya lagi
 b.style.cssText='position:fixed;top:10px;right:10px;z-index:50;min-width:0;display:none';
 const set=()=>b.textContent=SFX.on()?'🔊':'🔇';set();
 b.onclick=e=>{e.stopPropagation();localStorage.setItem('mml_mute',SFX.on()?'1':'0');set()};document.body.append(b)});
