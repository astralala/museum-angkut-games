/* EcoMascot – maskot bumi animasi memakai gambar asli.
   Pakai:
     <div id="maskot"></div>
     <script src="maskot.js"></script>
     const m = EcoMascot.create(document.getElementById('maskot'), { mood: 'idle' });
     m.setMood('senang');   // 'idle' | 'senang' | 'gembira' | 'sedih'
   Opsi: { base: 'assets/' } kalau halaman ada di subfolder, misal base: '../assets/'
*/
(function () {
  var MOODS = ['idle', 'senang', 'gembira', 'sedih'];
  var IMG = {
    idle: 'maskot.webp',
    senang: 'maskot.webp',
    gembira: 'maskot.webp',
    sedih: 'maskot-murung.png'
  };

  var CSS = `
.eco-mascot{position:relative;display:inline-block;width:100%;max-width:320px;aspect-ratio:1100/1400}
.eco-mascot .em-shadow{position:absolute;left:20%;right:20%;bottom:0;height:4%;border-radius:50%;background:#000;opacity:.12}
.eco-mascot .em-body{position:absolute;inset:0 0 3% 0;transform-origin:50% 100%}
.eco-mascot .em-body img{width:100%;height:100%;object-fit:contain;mix-blend-mode:multiply;display:block;user-select:none;-webkit-user-drag:none}
.eco-mascot .em-fx{position:absolute;inset:0;pointer-events:none}
.eco-mascot .em-fx span{position:absolute;display:none}
.eco-mascot .em-star{width:12%;aspect-ratio:1;background:#ffd93b;clip-path:polygon(50% 0,62% 38%,100% 50%,62% 62%,50% 100%,38% 62%,0 50%,38% 38%)}
.eco-mascot .em-tear{width:5%;aspect-ratio:3/4;background:#5ad0ff;border:2px solid #0a7fd6;border-radius:50% 50% 50% 50%/60% 60% 40% 40%}

.eco-mascot.mood-idle .em-body{animation:em-breathe 3s ease-in-out infinite}
.eco-mascot.mood-idle .em-shadow{animation:em-shadowB 3s ease-in-out infinite}

.eco-mascot.mood-senang .em-body{animation:em-hop .8s ease-in-out infinite}
.eco-mascot.mood-senang .em-shadow{animation:em-shadowH .8s ease-in-out infinite}

.eco-mascot.mood-gembira .em-body{animation:em-jump .7s cubic-bezier(.3,0,.4,1) infinite}
.eco-mascot.mood-gembira .em-shadow{animation:em-shadowJ .7s cubic-bezier(.3,0,.4,1) infinite}
.eco-mascot.mood-gembira .em-star{display:block;animation:em-twinkle .9s ease-in-out infinite}
.eco-mascot.mood-gembira .em-star:nth-child(2){animation-delay:.3s}
.eco-mascot.mood-gembira .em-star:nth-child(3){animation-delay:.6s}
.eco-mascot.mood-gembira .em-star:nth-child(4){animation-delay:.15s}

.eco-mascot.mood-sedih .em-body{animation:em-sigh 4s ease-in-out infinite}
.eco-mascot.mood-sedih .em-body img{filter:saturate(.75)}
.eco-mascot.mood-sedih .em-tear{display:block;animation:em-tear 2.2s ease-in infinite}
.eco-mascot.mood-sedih .em-tear:nth-of-type(6){animation-delay:1.1s}

@keyframes em-breathe{0%,100%{transform:scale(1,1) rotate(0)}25%{transform:rotate(-1.5deg)}50%{transform:scale(1.02,.97)}75%{transform:rotate(1.5deg)}}
@keyframes em-shadowB{0%,100%{transform:scaleX(1)}50%{transform:scaleX(1.05)}}
@keyframes em-hop{0%,100%{transform:translateY(0) rotate(-3deg)}50%{transform:translateY(-7%) rotate(3deg)}}
@keyframes em-shadowH{0%,100%{transform:scaleX(1);opacity:.12}50%{transform:scaleX(.8);opacity:.07}}
@keyframes em-jump{0%,100%{transform:translateY(0) scale(1.08,.9)}15%{transform:translateY(0) scale(.94,1.07)}50%{transform:translateY(-20%) rotate(-6deg)}85%{transform:translateY(0) scale(1,1)}}
@keyframes em-shadowJ{0%,15%,100%{transform:scaleX(1.05);opacity:.14}50%{transform:scaleX(.55);opacity:.05}}
@keyframes em-twinkle{0%,100%{transform:scale(.3) rotate(0);opacity:0}50%{transform:scale(1.1) rotate(45deg);opacity:1}}
@keyframes em-sigh{0%,100%{transform:scale(1.02,.97) rotate(-2deg)}50%{transform:scale(1.04,.94) translateY(1%) rotate(-3deg)}}
@keyframes em-tear{0%{transform:translateY(0);opacity:0}15%{opacity:1}100%{transform:translateY(400%);opacity:0}}
@media (prefers-reduced-motion:reduce){.eco-mascot *{animation-duration:0s!important;animation-iteration-count:1!important}}
`;

  var HTML =
    '<div class="em-shadow"></div>' +
    '<div class="em-body"><img alt="Maskot bumi" draggable="false"></div>' +
    '<div class="em-fx">' +
      '<span class="em-star" style="left:2%;top:12%"></span>' +
      '<span class="em-star" style="right:0;top:5%"></span>' +
      '<span class="em-star" style="right:2%;top:60%"></span>' +
      '<span class="em-star" style="left:0;top:62%"></span>' +
      '<span class="em-tear" style="left:37%;top:45%"></span>' +
      '<span class="em-tear" style="left:70%;top:45%"></span>' +
    '</div>';

  function injectCss() {
    if (document.getElementById('eco-mascot-css')) return;
    var s = document.createElement('style');
    s.id = 'eco-mascot-css';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function create(el, opts) {
    opts = opts || {};
    var base = opts.base || 'assets/';
    injectCss();
    el.classList.add('eco-mascot');
    el.innerHTML = HTML;
    var img = el.querySelector('img');
    // preload semua gambar supaya ganti mood tidak berkedip
    Object.keys(IMG).forEach(function (k) { new Image().src = base + IMG[k]; });

    var api = {
      mood: null,
      setMood: function (m) {
        if (MOODS.indexOf(m) < 0) m = 'idle';
        MOODS.forEach(function (x) { el.classList.remove('mood-' + x); });
        img.src = base + IMG[m];
        el.classList.add('mood-' + m);
        api.mood = m;
      }
    };
    api.setMood(opts.mood || 'idle');
    return api;
  }

  window.EcoMascot = { create: create, MOODS: MOODS };
})();
