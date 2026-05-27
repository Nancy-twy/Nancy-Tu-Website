// Shared site script: tagline rotation, reveals, tweaks, accent persistence

(function(){
  // ---------- Accent + animation persistence ----------
  const ACCENTS = {
    terracotta: { '--accent': '#C25E3C', '--accent-soft': '#E3A883', '--accent-ink': '#7A2E16' },
    ochre:      { '--accent': '#B98231', '--accent-soft': '#E0B984', '--accent-ink': '#6A4612' },
    olive:      { '--accent': '#6E7C3A', '--accent-soft': '#B8C284', '--accent-ink': '#3D4520' },
    ink:        { '--accent': '#2A211A', '--accent-soft': '#8C7E6F', '--accent-ink': '#000' },
  };
  const BG_TONES = {
    cream:  { '--bg': '#F4ECDD', '--bg-2': '#EADFC9', '--paper': '#FBF6EC' },
    sand:   { '--bg': '#EFE3CC', '--bg-2': '#E1D2B4', '--paper': '#F7EFDD' },
    rose:   { '--bg': '#F6E9DF', '--bg-2': '#EBD4C2', '--paper': '#FCF1E8' },
    linen:  { '--bg': '#F2EDE2', '--bg-2': '#E0D8C4', '--paper': '#FAF6EC' },
    mist:   { '--bg': '#E8EAE5', '--bg-2': '#D2D6CD', '--paper': '#F2F4EF' },
    shell:  { '--bg': '#F5E6DC', '--bg-2': '#E8CFBE', '--paper': '#FBEEE5' },
    olive:  { '--bg': '#ECEAD8', '--bg-2': '#D8D5BA', '--paper': '#F5F3E2' },
    bone:   { '--bg': '#F7F2E8', '--bg-2': '#E8E2D4', '--paper': '#FDF9F0' },
  };

  function applyAccent(name){
    const c = ACCENTS[name] || ACCENTS.terracotta;
    Object.keys(c).forEach(k => document.documentElement.style.setProperty(k, c[k]));
    try { localStorage.setItem('nt_accent', name); } catch(e){}
  }
  function applyBg(name){
    const c = BG_TONES[name] || BG_TONES.cream;
    Object.keys(c).forEach(k => document.documentElement.style.setProperty(k, c[k]));
    try { localStorage.setItem('nt_bg', name); } catch(e){}
  }
  function applyMotion(level){
    document.documentElement.dataset.motion = level;
    try { localStorage.setItem('nt_motion', level); } catch(e){}
  }

  // Restore prefs
  try {
    applyAccent(localStorage.getItem('nt_accent') || 'terracotta');
    applyBg(localStorage.getItem('nt_bg') || 'cream');
    applyMotion(localStorage.getItem('nt_motion') || 'gentle');
  } catch(e){}

  // ---------- Tagline rotation ----------
  function initTaglines(){
    const stage = document.querySelector('[data-taglines]');
    if (!stage) return;
    const items = stage.querySelectorAll('.tagline');
    const dotsWrap = document.querySelector('[data-tagline-dots]');
    if (!items.length) return;

    // build dots
    if (dotsWrap) {
      dotsWrap.innerHTML = '';
      items.forEach((_,i)=>{
        const s = document.createElement('span');
        if (i===0) s.classList.add('is-active');
        dotsWrap.appendChild(s);
      });
    }
    let i = 0;
    items[0].classList.add('is-active');
    setInterval(()=>{
      items[i].classList.remove('is-active');
      if (dotsWrap) dotsWrap.children[i].classList.remove('is-active');
      i = (i+1) % items.length;
      items[i].classList.add('is-active');
      if (dotsWrap) dotsWrap.children[i].classList.add('is-active');
    }, 2400);
  }

  // ---------- Cursor-tilt on title ----------
  function initTitleTilt(){
    const t = document.querySelector('[data-tilt]');
    if (!t) return;
    const rect = ()=>t.getBoundingClientRect();
    t.addEventListener('mousemove', e => {
      if (document.documentElement.dataset.motion === 'still') return;
      const r = rect();
      const x = (e.clientX - (r.left + r.width/2)) / r.width;
      const y = (e.clientY - (r.top + r.height/2)) / r.height;
      t.style.transform = `translate(${x*6}px, ${y*4}px)`;
    });
    t.addEventListener('mouseleave', ()=>{ t.style.transform = ''; });
  }

  // ---------- Tweaks panel ----------
  function initTweaks(){
    const panel = document.querySelector('[data-tweaks]');
    const toggle = document.querySelector('[data-tweaks-toggle]');
    if (!panel || !toggle) return;

    toggle.addEventListener('click', ()=>{
      panel.classList.toggle('is-on');
    });
    const closeBtn = panel.querySelector('[data-tweaks-close]');
    if (closeBtn) closeBtn.addEventListener('click', ()=> panel.classList.remove('is-on'));

    // accent swatches
    panel.querySelectorAll('[data-accent]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const name = btn.getAttribute('data-accent');
        panel.querySelectorAll('[data-accent]').forEach(b=>b.classList.remove('is-on'));
        btn.classList.add('is-on');
        applyAccent(name);
      });
    });
    panel.querySelectorAll('[data-bg]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const name = btn.getAttribute('data-bg');
        panel.querySelectorAll('[data-bg]').forEach(b=>b.classList.remove('is-on'));
        btn.classList.add('is-on');
        applyBg(name);
      });
    });
    panel.querySelectorAll('[data-motion]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const name = btn.getAttribute('data-motion');
        panel.querySelectorAll('[data-motion]').forEach(b=>b.classList.remove('is-on'));
        btn.classList.add('is-on');
        applyMotion(name);
      });
    });

    // mark initial state
    const a = localStorage.getItem('nt_accent') || 'terracotta';
    const b = localStorage.getItem('nt_bg') || 'cream';
    const m = localStorage.getItem('nt_motion') || 'gentle';
    panel.querySelectorAll('[data-accent]').forEach(btn => btn.classList.toggle('is-on', btn.dataset.accent===a));
    panel.querySelectorAll('[data-bg]').forEach(btn => btn.classList.toggle('is-on', btn.dataset.bg===b));
    panel.querySelectorAll('[data-motion]').forEach(btn => btn.classList.toggle('is-on', btn.dataset.motion===m));
  }

  // ---------- Page dots (section indicator) ----------
  function initPageDots(){
    const dots = document.querySelectorAll('[data-page-dots] .page-dot');
    if (!dots.length) return;
    const targets = Array.from(dots).map(d => ({
      btn: d,
      el: document.getElementById(d.dataset.target)
    })).filter(t => t.el);

    // Click → smooth scroll
    targets.forEach(t => {
      t.btn.addEventListener('click', () => {
        window.scrollTo({ top: t.el.offsetTop - 20, behavior: 'smooth' });
      });
    });

    // Scroll → update active
    let raf = null;
    function update(){
      raf = null;
      const mid = window.scrollY + window.innerHeight * 0.35;
      let active = targets[0];
      for (const t of targets) {
        if (t.el.offsetTop <= mid) active = t;
      }
      targets.forEach(t => t.btn.classList.toggle('is-on', t === active));
    }
    function onScroll(){
      if (raf) return;
      raf = requestAnimationFrame(update);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
  }

  // ---------- Boot ----------
  document.addEventListener('DOMContentLoaded', ()=>{
    initTaglines();
    initTitleTilt();
    initTweaks();
    initPageDots();
  });
})();
