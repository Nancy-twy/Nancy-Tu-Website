// Shared site script: tagline rotation, reveals, page dots

(function(){
  // Motion is fixed to "gentle"
  document.documentElement.dataset.motion = 'gentle';

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
      const r = rect();
      const x = (e.clientX - (r.left + r.width/2)) / r.width;
      const y = (e.clientY - (r.top + r.height/2)) / r.height;
      t.style.transform = `translate(${x*6}px, ${y*4}px)`;
    });
    t.addEventListener('mouseleave', ()=>{ t.style.transform = ''; });
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
    initPageDots();
  });
})();
