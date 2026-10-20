
need('nama');need('area','area.html');
const LIMIT=30,$=id=>document.getElementById(id);
let score,ok,bad,left,t0,timer,over,lastSec;
$('frame').style.background=CFG.bg;layerBg($('frame'));$('hint').textContent='💡 Pilih sampah dengan tepat! — '+CFG.title;
function fmt(s){s=Math.max(0,Math.ceil(s));return '00:'+String(s).padStart(2,'0')}
function toggleMute(){window.MUTED=!window.MUTED;$('mute').textContent=window.MUTED?'🔇':'🔊'}
function start(){
  score=0;ok=0;bad=0;over=false;left=CFG.items.length;$('score').textContent=0;
  const grid=$('grid');grid.innerHTML='';
  [...CFG.items].sort(()=>Math.random()-.5).forEach(([img,t,label,path])=>{
    const c=document.createElement('div');c.className='cell';
    const i=document.createElement('div');i.className='item';i.dataset.t=t;
    i.innerHTML=typeof img==='number'?'<img draggable="false" src="'+SPR[img]+'">':'<span class="em">'+img+'</span><small>'+(label||'')+'</small>';
    if(path){const im=new Image();im.draggable=false;im.onload=()=>{i.innerHTML='';i.appendChild(im)};im.src=path}
    i.addEventListener('pointerdown',down);c.appendChild(i);grid.appendChild(c);
  });
  t0=Date.now();clearInterval(timer);$('time').textContent=fmt(LIMIT);
  timer=setInterval(()=>{
    const r=LIMIT-(Date.now()-t0)/1000;$('time').textContent=fmt(r);
    const sec=Math.ceil(r);if(sec!==lastSec){lastSec=sec;if(sec<=5&&sec>0)SFX.tick()}
    if(r<=0)finish('Waktu Habis!');
  },100);
}
function down(ev){
  if(over||(ev.pointerType==='mouse'&&ev.button>0))return;
  ev.preventDefault();SFX.pick();
  const el=ev.currentTarget,fr=$('frame'),id=ev.pointerId;
  /* salinan (ghost) dipasang langsung di #frame supaya posisinya tidak terpengaruh transform grid */
  const gh=el.cloneNode(true);gh.classList.add('drag');gh.style.left=gh.style.top='0px';
  /* ukuran salinan mengikuti ukuran icon yang tampil (ikut --item-scale), sedikit diperbesar saat diangkat */
  const k0=window.K||1,r0=el.getBoundingClientRect(),sz=Math.max(r0.width,r0.height)/k0*1.1;
  gh.style.width=gh.style.height=sz+'px';const em=gh.querySelector('.em');if(em)em.style.fontSize=(sz*0.73)+'px';
  fr.appendChild(gh);
  el.classList.add('picked');
  const place=e=>{const r=fr.getBoundingClientRect(),k=window.K||1;
    gh.style.left=((e.clientX-r.left)/k-gh.offsetWidth/2)+'px';gh.style.top=((e.clientY-r.top)/k-gh.offsetHeight/2)+'px'};
  place(ev);
  const mv=e=>{if(e.pointerId===id)place(e)};
  const end=e=>{
    if(e.pointerId!==id)return;
    removeEventListener('pointermove',mv);removeEventListener('pointerup',end);removeEventListener('pointercancel',end);
    gh.remove();el.classList.remove('picked');
    if(e.type==='pointerup')drop(el,e);
  };
  addEventListener('pointermove',mv);addEventListener('pointerup',end);addEventListener('pointercancel',end);
}
function drop(el,ev){
  if(over)return;
  let hit=null;
  document.querySelectorAll('.bin').forEach(b=>{const r=b.getBoundingClientRect();
    if(ev.clientX>=r.left&&ev.clientX<=r.right&&ev.clientY>=r.top&&ev.clientY<=r.bottom)hit=b});
  if(!hit)return;
  if(hit.dataset.t===el.dataset.t){score++;ok++;el.remove();flash(hit,'ok');left--;SFX.good()}
  else{score--;bad++;flash(hit,'bad');SFX.bad()}
  $('score').textContent=score;
  if(left===0)finish('Semua Terpilah!');
}
function flash(b,c){b.classList.add(c);setTimeout(()=>b.classList.remove(c),350)}
function finish(title){
  if(over)return;over=true;clearInterval(timer);
  const used=Math.min(LIMIT,(Date.now()-t0)/1000);
  S.set('skor',score);S.set('waktu',used.toFixed(1));S.set('benar',ok);S.set('salah',bad);S.set('judul',title);
  left===0?SFX.win():SFX.lose();
  setTimeout(()=>{location.href='kuis.html'},900);
}
start();
