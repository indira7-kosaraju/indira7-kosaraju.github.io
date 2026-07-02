document.addEventListener('DOMContentLoaded', () => {

  /* =========================================================
     PRELOADER — typewriter + fake progress
  ========================================================= */
  (function preloader(){
    const el = document.getElementById('preloader');
    const typeEl = document.getElementById('preloaderType');
    const fillEl = document.getElementById('preloaderFill');
    const text = 'loading portfolio...';
    let i = 0;
    let progress = 0;

    const typeTimer = setInterval(() => {
      typeEl.textContent = text.slice(0, i);
      i++;
      if (i > text.length) clearInterval(typeTimer);
    }, 45);

    const progTimer = setInterval(() => {
      progress = Math.min(100, progress + Math.random() * 18);
      fillEl.style.width = progress + '%';
      if (progress >= 100) {
        clearInterval(progTimer);
        setTimeout(() => {
          el.classList.add('is-hidden');
          document.body.style.overflow = '';
        }, 300);
      }
    }, 160);

    document.body.style.overflow = 'hidden';
    // Safety: never trap the user behind the preloader
    setTimeout(() => {
      el.classList.add('is-hidden');
      document.body.style.overflow = '';
    }, 3500);
  })();

  /* =========================================================
     CUSTOM CURSOR
  ========================================================= */
  (function cursor(){
    if (window.matchMedia('(hover: none)').matches) return;
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    let mx = 0, my = 0, rx = 0, ry = 0;

    window.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top = my + 'px';
    });

    function loop(){
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      requestAnimationFrame(loop);
    }
    loop();

    document.querySelectorAll('a, button, .field input, .field textarea').forEach(node => {
      node.addEventListener('mouseenter', () => ring.classList.add('is-active'));
      node.addEventListener('mouseleave', () => ring.classList.remove('is-active'));
    });
  })();

  /* =========================================================
     HEADER STATE + BACK-TO-TOP + SCROLL PROGRESS
  ========================================================= */
  (function scrollUI(){
    const header = document.getElementById('siteHeader');
    const toTop = document.getElementById('toTop');
    const ring = toTop.querySelector('circle');
    const circumference = 2 * Math.PI * 20;
    ring.style.strokeDasharray = circumference;

    function onScroll(){
      const scrolled = window.scrollY;
      header.classList.toggle('is-scrolled', scrolled > 40);
      toTop.classList.toggle('is-visible', scrolled > 400);

      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? scrolled / docHeight : 0;
      ring.style.strokeDashoffset = circumference * (1 - pct);
    }
    window.addEventListener('scroll', onScroll, { passive:true });
    onScroll();

    toTop.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));
  })();

  /* =========================================================
     MOBILE MENU
  ========================================================= */
  (function mobileMenu(){
    const menu = document.getElementById('mobileMenu');
    const overlay = document.getElementById('overlay');
    const openBtn = document.getElementById('menuToggle');
    const closeBtn = document.getElementById('mobileMenuClose');

    function open(){
      menu.classList.add('is-open');
      overlay.classList.add('is-visible');
      openBtn.setAttribute('aria-expanded', 'true');
    }
    function close(){
      menu.classList.remove('is-open');
      overlay.classList.remove('is-visible');
      openBtn.setAttribute('aria-expanded', 'false');
    }
    openBtn.addEventListener('click', open);
    closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', close);
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  })();

  /* =========================================================
     ACTIVE NAV LINK ON SCROLL
  ========================================================= */
  (function activeNav(){
    const links = document.querySelectorAll('[data-nav]');
    const sections = [...links]
      .map(l => document.querySelector(l.getAttribute('href')))
      .filter(Boolean);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          const id = '#' + entry.target.id;
          links.forEach(l => l.classList.toggle('is-active', l.getAttribute('href') === id));
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(s => observer.observe(s));
  })();

  /* =========================================================
     REVEAL-ON-SCROLL
  ========================================================= */
  (function reveal(){
    const items = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    items.forEach(item => observer.observe(item));
  })();

  /* =========================================================
     ANIMATED COUNTERS
  ========================================================= */
  (function counters(){
    const nums = document.querySelectorAll('[data-count]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const decimals = parseInt(el.dataset.decimal || '0', 10);
        const suffix = el.dataset.suffix ?? '';
        const duration = 1400;
        const start = performance.now();

        function tick(now){
          const p = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          const value = target * eased;
          el.textContent = value.toFixed(decimals) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        observer.unobserve(el);
      });
    }, { threshold: 0.5 });
    nums.forEach(n => observer.observe(n));
  })();

  /* =========================================================
     MARQUEE — pause on hover, duplicate track for seamless loop
  ========================================================= */
  (function marquee(){
    const track = document.getElementById('marqueeTrack');
    if (!track) return;
    track.innerHTML += track.innerHTML; // duplicate for seamless scroll
    track.parentElement.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
    track.parentElement.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');
  })();

  /* =========================================================
     CONTACT FORM VALIDATION
  ========================================================= */
  (function contactForm(){
    const form = document.getElementById('contactForm');
    if (!form) return;
    const status = document.getElementById('formStatus');

    const rules = {
      name: v => v.trim().length >= 2 || 'Please enter your name.',
      email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Please enter a valid email.',
      subject: v => v.trim().length >= 3 || 'Please enter a subject.',
      message: v => v.trim().length >= 10 || 'Message should be at least 10 characters.'
    };

    function validateField(field){
      const input = form.elements[field];
      const errorEl = form.querySelector(`[data-error-for="${field}"]`);
      const result = rules[field](input.value);
      if (result === true){
        input.classList.remove('is-invalid');
        errorEl.textContent = '';
        return true;
      } else {
        input.classList.add('is-invalid');
        errorEl.textContent = result;
        return false;
      }
    }

    Object.keys(rules).forEach(field => {
      form.elements[field].addEventListener('blur', () => validateField(field));
      form.elements[field].addEventListener('input', () => {
        if (form.elements[field].classList.contains('is-invalid')) validateField(field);
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const validations = Object.keys(rules).map(validateField);
      const allValid = validations.every(Boolean);

      if (!allValid){
        status.textContent = 'Please fix the highlighted fields.';
        status.className = 'form-status is-error';
        return;
      }

      // No backend wired up — swap this for a real fetch() call to your endpoint.
      status.textContent = 'Sending…';
      status.className = 'form-status';
      setTimeout(() => {
        status.textContent = 'Message sent — I\u2019ll get back to you soon!';
        status.className = 'form-status is-success';
        form.reset();
      }, 700);
    });
  })();

  /* =========================================================
     FOOTER YEAR
  ========================================================= */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});