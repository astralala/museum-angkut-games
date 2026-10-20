/* EcoMascotRig – maskot bumi dirakit dari part (assets/parts/*.png).
   Pakai:
     <div id="maskot"></div>
     <script src="maskot-rig.js"></script>
     const m = EcoMascotRig.create(document.getElementById('maskot'), { mood: 'idle' });
     m.setMood('senang');   // 'idle' | 'senang' | 'gembira' | 'sedih'
   Opsi: { base: 'assets/parts/' }
*/
(function () {
  var MOODS = ['idle', 'senang', 'gembira', 'sedih'];
  var W = 700, H = 780;

  // slot: posisi tengah (x,y) di kanvas 700x780, lebar, dan gambar per mood
  var SLOTS = [
    { id: 'legL',   x: 285, y: 660, w: 165, img: 'leg-l' },
    { id: 'legR',   x: 420, y: 660, w: 163, img: 'leg-r' },
    { id: 'armL',   x: 95,  y: 500, w: 136, img: { idle: 'hand-fist', senang: 'hand-thumb', gembira: 'hand-open', sedih: 'arm-down' }, flip: { gembira: true, sedih: true } },
    { id: 'armR',   x: 612, y: 330, w: 168, img: { idle: 'hand-wave', senang: 'hand-wave', gembira: 'hand-wave', sedih: 'arm-down' } },
    { id: 'leaf',   x: 350, y: 112, w: 453, img: 'leaf' },
    { id: 'globe',  x: 350, y: 420, w: 486, img: 'globe' },
    { id: 'cheekL', x: 245, y: 478, w: 79,  img: 'cheek' },
    { id: 'cheekR', x: 455, y: 478, w: 79,  img: 'cheek' },
    { id: 'eyeL',   x: 285, y: 395, w: 77,  img: { idle: 'eye-l', senang: 'eye-happy-l', gembira: 'eye-joy-l', sedih: 'eye-l' } },
    { id: 'eyeR',   x: 415, y: 395, w: 77,  img: { idle: 'eye-r', senang: 'eye-happy-r', gembira: 'eye-joy-r', sedih: 'eye-r' } },
    { id: 'mouth',  x: 350, y: 500, w: 112, img: { idle: 'mouth-idle', senang: 'mouth-happy', gembira: 'mouth-joy', sedih: 'mouth-sad' } }
  ];

  var CSS = `
.emr{position:relative;width:100%;max-width:340px;aspect-ratio:${W}/${H};container-type:inline-size}
.emr-stage{position:absolute;left:0;top:0;width:${W}px;height:${H}px;transform-origin:0 0}
.emr-shadow{position:absolute;left:170px;width:360px;top:745px;height:26px;border-radius:50%;background:#000;opacity:.13}
.emr-rig{position:absolute;inset:0;transform-origin:50% 95%}
.emr-face{position:absolute;inset:0;transform-origin:50% 55%}
.emr-slot{position:absolute;transform:translate(-50%,-50%)}
.emr-slot>div{transform-origin:inherit}
.emr-slot img{display:block;width:100%;height:auto;user-select:none;-webkit-user-drag:none}
.emr-slot.flip img{transform:scaleX(-1)}
.emr [data-id=legL]>div,.emr [data-id=legR]>div{transform-origin:50% 10%}
.emr [data-id=armL]>div{transform-origin:90% 60%}
.emr [data-id=armR]>div{transform-origin:20% 90%}
.emr [data-id=leaf]>div{transform-origin:50% 100%}
.emr [data-id=eyeL]>div,.emr [data-id=eyeR]>div{transform-origin:50% 70%}
.emr .fx{position:absolute;display:none;pointer-events:none}
.emr .star{width:70px;height:70px;background:#ffd93b;clip-path:polygon(50% 0,62% 38%,100% 50%,62% 62%,50% 100%,38% 62%,0 50%,38% 38%)}
.emr .tear{width:26px;height:34px;background:#5ad0ff;border:3px solid #0a7fd6;border-radius:50% 50% 50% 50%/60% 60% 40% 40%}
.emr .emr-slot[data-id=globe] img{transition:filter .4s}

/* IDLE */
.emr.mood-idle .emr-rig{animation:r-breathe 3s ease-in-out infinite}
.emr.mood-idle [data-id=leaf]>div{animation:r-sway 3s ease-in-out infinite}
.emr.mood-idle [data-id=armR]>div{animation:r-armIdle 3s ease-in-out infinite}
.emr.mood-idle [data-id=armL]>div{animation:r-armIdleL 3s ease-in-out infinite}
.emr.mood-idle [data-id^=eye]>div{animation:r-blink 4s infinite}
.emr.mood-idle .emr-face{animation:r-look 6s ease-in-out infinite}

/* SENANG */
.emr.mood-senang .emr-rig{animation:r-hop .8s ease-in-out infinite}
.emr.mood-senang [data-id=leaf]>div{animation:r-sway .8s ease-in-out infinite}
.emr.mood-senang [data-id=armR]>div{animation:r-wave .4s ease-in-out infinite alternate}
.emr.mood-senang [data-id=armL]>div{animation:r-thumb .8s ease-in-out infinite}
.emr.mood-senang [data-id=legL]>div{animation:r-stepL .8s ease-in-out infinite}
.emr.mood-senang [data-id=legR]>div{animation:r-stepR .8s ease-in-out infinite}

/* GEMBIRA */
.emr.mood-gembira .emr-rig{animation:r-jump .7s cubic-bezier(.3,0,.4,1) infinite}
.emr.mood-gembira .emr-shadow{animation:r-shadowJ .7s cubic-bezier(.3,0,.4,1) infinite}
.emr.mood-gembira [data-id=leaf]>div{animation:r-leafPop .7s ease-in-out infinite}
.emr.mood-gembira [data-id=armR]>div{animation:r-cheerR .35s ease-in-out infinite alternate}
.emr.mood-gembira [data-id=armL]>div{animation:r-cheerL .35s ease-in-out infinite alternate}
.emr.mood-gembira [data-id=legL]>div{animation:r-kickL .7s ease-in-out infinite}
.emr.mood-gembira [data-id=legR]>div{animation:r-kickR .7s ease-in-out infinite}
.emr.mood-gembira .star{display:block;animation:r-twinkle .9s ease-in-out infinite}
.emr.mood-gembira .star:nth-of-type(2){animation-delay:.3s}
.emr.mood-gembira .star:nth-of-type(3){animation-delay:.6s}
.emr.mood-gembira .star:nth-of-type(4){animation-delay:.15s}

/* SEDIH */
.emr.mood-sedih .emr-rig{animation:r-sigh 4s ease-in-out infinite}
.emr.mood-sedih [data-id=globe] img{filter:saturate(.6) brightness(.95)}
.emr.mood-sedih [data-id=leaf]>div{animation:r-droop 4s ease-in-out infinite}
.emr.mood-sedih [data-id=armL]>div,.emr.mood-sedih [data-id=armR]>div{animation:r-dangle 4s ease-in-out infinite}
.emr.mood-sedih .emr-face{transform:translateY(12px)}
.emr.mood-sedih [data-id=eyeL] img{transform:rotate(-18deg) scaleY(.9)}
.emr.mood-sedih [data-id=eyeR] img{transform:rotate(18deg) scaleY(.9)}
.emr.mood-sedih .tear{display:block;animation:r-tear 2.2s ease-in infinite}
.emr.mood-sedih .tear:nth-of-type(6){animation-delay:1.1s}

@keyframes r-breathe{0%,100%{transform:scale(1,1)}50%{transform:scale(1.015,.985)}}
@keyframes r-sway{0%,100%{transform:rotate(-5deg)}50%{transform:rotate(5deg)}}
@keyframes r-armIdle{0%,100%{transform:rotate(0)}50%{transform:rotate(-10deg)}}
@keyframes r-armIdleL{0%,100%{transform:rotate(0)}50%{transform:rotate(6deg)}}
@keyframes r-blink{0%,93%,100%{transform:scaleY(1)}96%{transform:scaleY(.1)}}
@keyframes r-look{0%,40%,100%{transform:translateX(0)}50%,60%{transform:translateX(-12px)}70%,85%{transform:translateX(10px)}}
@keyframes r-hop{0%,100%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-40px) rotate(2deg)}}
@keyframes r-wave{from{transform:rotate(-22deg)}to{transform:rotate(18deg)}}
@keyframes r-thumb{0%,100%{transform:rotate(0) translateY(0)}50%{transform:rotate(-10deg) translateY(-10px)}}
@keyframes r-stepL{0%,100%{transform:rotate(0)}50%{transform:rotate(10deg)}}
@keyframes r-stepR{0%,100%{transform:rotate(0)}50%{transform:rotate(-10deg)}}
@keyframes r-jump{0%,100%{transform:translateY(0) scale(1.06,.93)}15%{transform:translateY(0) scale(.96,1.05)}50%{transform:translateY(-130px) rotate(-4deg)}85%{transform:translateY(0)}}
@keyframes r-shadowJ{0%,15%,100%{transform:scaleX(1.05);opacity:.15}50%{transform:scaleX(.55);opacity:.05}}
@keyframes r-leafPop{0%,100%{transform:rotate(-8deg) scale(1)}50%{transform:rotate(8deg) scale(1.12)}}
@keyframes r-cheerR{from{transform:rotate(-30deg) translateY(-20px)}to{transform:rotate(15deg)}}
@keyframes r-cheerL{from{transform:rotate(30deg) translateY(-140px)}to{transform:rotate(-10deg) translateY(-120px)}}
@keyframes r-kickL{0%,100%{transform:rotate(0)}50%{transform:rotate(22deg)}}
@keyframes r-kickR{0%,100%{transform:rotate(0)}50%{transform:rotate(-22deg)}}
@keyframes r-twinkle{0%,100%{transform:scale(.3) rotate(0);opacity:0}50%{transform:scale(1.1) rotate(45deg);opacity:1}}
@keyframes r-sigh{0%,100%{transform:translateY(10px) scale(1.02,.97)}50%{transform:translateY(16px) scale(1.04,.95)}}
@keyframes r-droop{0%,100%{transform:translateY(30px) rotate(-6deg) scale(.85,.6)}50%{transform:translateY(34px) rotate(-2deg) scale(.85,.55)}}
@keyframes r-dangle{0%,100%{transform:rotate(-3deg)}50%{transform:rotate(3deg)}}
@keyframes r-tear{0%{transform:translateY(0);opacity:0}15%{opacity:1}100%{transform:translateY(150px);opacity:0}}
@media (prefers-reduced-motion:reduce){.emr *{animation-duration:0s!important;animation-iteration-count:1!important}}
`;

  // posisi lengan saat sedih (menggantung di samping)
  var SAD_POS = { armL: [120, 560], armR: [580, 560] };

  function injectCss() {
    if (document.getElementById('emr-css')) return;
    var s = document.createElement('style');
    s.id = 'emr-css';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function create(el, opts) {
    opts = opts || {};
    var base = opts.base || 'assets/parts/';
    injectCss();
    el.classList.add('emr');

    var stage = document.createElement('div');
    stage.className = 'emr-stage';
    stage.innerHTML = '<div class="emr-shadow"></div><div class="emr-rig"><div class="emr-face"></div></div>';
    var rig = stage.querySelector('.emr-rig');
    var face = stage.querySelector('.emr-face');
    var isFace = { cheekL: 1, cheekR: 1, eyeL: 1, eyeR: 1, mouth: 1 };
    var nodes = {};

    SLOTS.forEach(function (s) {
      var d = document.createElement('div');
      d.className = 'emr-slot';
      d.dataset.id = s.id;
      d.style.width = s.w + 'px';
      d.innerHTML = '<div><img alt="" draggable="false"></div>';
      (isFace[s.id] ? face : rig).insertBefore(d, isFace[s.id] ? null : face);
      nodes[s.id] = { el: d, img: d.querySelector('img'), slot: s };
    });

    var fx = '<span class="fx star" style="left:20px;top:150px"></span>' +
      '<span class="fx star" style="left:600px;top:110px"></span>' +
      '<span class="fx star" style="left:610px;top:560px"></span>' +
      '<span class="fx star" style="left:10px;top:600px"></span>' +
      '<span class="fx tear" style="left:262px;top:450px"></span>' +
      '<span class="fx tear" style="left:425px;top:460px"></span>';
    face.insertAdjacentHTML('beforeend', fx);
    el.innerHTML = '';
    el.appendChild(stage);

    // skala kanvas mengikuti lebar container
    function fit() { stage.style.transform = 'scale(' + (el.clientWidth / W) + ')'; }
    fit();
    if (window.ResizeObserver) new ResizeObserver(fit).observe(el); else window.addEventListener('resize', fit);

    // preload
    SLOTS.forEach(function (s) {
      var srcs = typeof s.img === 'string' ? [s.img] : Object.keys(s.img).map(function (k) { return s.img[k]; });
      if (s.def) srcs.push(s.def);
      srcs.forEach(function (n) { new Image().src = base + n + '.png'; });
    });

    var api = {
      mood: null,
      setMood: function (m) {
        if (MOODS.indexOf(m) < 0) m = 'idle';
        Object.keys(nodes).forEach(function (id) {
          var n = nodes[id], s = n.slot;
          var name = typeof s.img === 'string' ? s.img : (s.img[m] || s.def);
          n.img.src = base + name + '.png';
          n.el.classList.toggle('flip', !!(s.flip && s.flip[m]));
          var p = (m === 'sedih' && SAD_POS[id]) || [s.x, s.y];
          n.el.style.left = p[0] + 'px';
          n.el.style.top = p[1] + 'px';
        });
        MOODS.forEach(function (x) { el.classList.remove('mood-' + x); });
        el.classList.add('mood-' + m);
        api.mood = m;
      }
    };
    api.setMood(opts.mood || 'idle');
    return api;
  }

  window.EcoMascotRig = { create: create, MOODS: MOODS };
})();
