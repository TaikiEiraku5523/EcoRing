/* ── Q&A アコーディオン ── */
  document.querySelectorAll('.qa-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.qa-item');
      item.classList.toggle('open');
    });
  });

/* ── ハンバーガーメニュー ── */
  (function () {
    const drawer   = document.getElementById('mobileDrawer');
    const openBtn  = document.querySelector('.header-menu-btn');
    const closeBtn = document.getElementById('mobileCloseBtn');
    const overlay  = document.getElementById('mobileOverlay');
    const navLinks = drawer.querySelectorAll('.mobile-nav-links a, .mobile-cta-area a');

    function openDrawer() {
      drawer.classList.add('open');
      drawer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
    function closeDrawer() {
      drawer.classList.remove('open');
      drawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    openBtn.addEventListener('click', openDrawer);
    closeBtn.addEventListener('click', closeDrawer);
    overlay.addEventListener('click', closeDrawer);
    navLinks.forEach(a => a.addEventListener('click', closeDrawer));

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeDrawer();
    });
  })();

/* ── 買取実績スライダー ── */
  (function () {
    const GAP = 16;
    const AUTOPLAY_MS = 5000;

    const sliderWrap = document.getElementById('perfSlider');
    const viewport   = sliderWrap.querySelector('.perf-slider-viewport');
    const track      = sliderWrap.querySelector('.perf-slider-track');
    const cards      = [...sliderWrap.querySelectorAll('.perf-card')];
    const prevBtn    = sliderWrap.querySelector('.perf-prev');
    const nextBtn    = sliderWrap.querySelector('.perf-next');
    const dotsWrap   = document.getElementById('perfDots');

    let current = 0;
    let timer   = null;

    function perView() {
      const w = viewport.offsetWidth;
      if (w >= 680) return 4;
      if (w >= 440) return 2;
      return 1;
    }

    function cardWidth() {
      const pv = perView();
      return (viewport.offsetWidth - GAP * (pv - 1)) / pv;
    }

    function maxStep() {
      return Math.max(0, cards.length - perView());
    }

    function buildDots() {
      dotsWrap.innerHTML = '';
      const steps = maxStep() + 1;
      for (let i = 0; i < steps; i++) {
        const btn = document.createElement('button');
        btn.className = 'perf-dot' + (i === current ? ' active' : '');
        btn.setAttribute('aria-label', (i + 1) + 'ページ目');
        btn.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(btn);
      }
    }

    function updateDots() {
      dotsWrap.querySelectorAll('.perf-dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });
    }

    function render() {
      const cw = cardWidth();
      cards.forEach(c => { c.style.width = cw + 'px'; c.style.flexShrink = '0'; });
      track.style.transform = `translateX(-${current * (cw + GAP)}px)`;
      prevBtn.disabled = current === 0;
      nextBtn.disabled = current >= maxStep();
      updateDots();
    }

    function goTo(idx) {
      current = Math.max(0, Math.min(maxStep(), idx));
      render();
      resetTimer();
    }

    function next() {
      current = current >= maxStep() ? 0 : current + 1;
      render();
    }

    function startTimer() {
      timer = setInterval(next, AUTOPLAY_MS);
    }

    function resetTimer() {
      clearInterval(timer);
      startTimer();
    }

    prevBtn.addEventListener('click', () => goTo(current - 1));
    nextBtn.addEventListener('click', () => goTo(current + 1));

    /* マウスオーバー中は停止 */
    sliderWrap.addEventListener('mouseenter', () => clearInterval(timer));
    sliderWrap.addEventListener('mouseleave', startTimer);

    /* タッチスワイプ */
    let touchStartX = 0;
    viewport.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    viewport.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
    });

    window.addEventListener('resize', () => { buildDots(); render(); });

    buildDots();
    render();
    startTimer();
  })();

/* ── スクロールフェードイン ── */
(function () {
  const targets = document.querySelectorAll(
    '.about-row1, .about-row2, .about-cards, ' +
    '.flyer-frame-wrap, .flyer-btn-wrap, ' +
    '.merits-lead, .merit-col, .merits-diagram-wrap, ' +
    '.target-img-wrap, ' +
    '.performance-lead, .perf-slider-wrap, .performance-banner, ' +
    '.flow-title, .flow-lead, .flow-step-img, ' +
    '.store-title-img, .store-photo, .store-info-card, .store-map, ' +
    '.qa-item, ' +
    '.footer-cta-banner'
  );

  targets.forEach(el => el.classList.add('fade-elem'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => observer.observe(el));
})();

const openBtn = document.getElementById('flyerOpenBtn');
  const lightbox = document.getElementById('flyerLightbox');
  const closeBtn = document.getElementById('flyerClose');

  openBtn.addEventListener('click', () => lightbox.classList.add('active'));
  closeBtn.addEventListener('click', (e) => { e.stopPropagation(); lightbox.classList.remove('active'); });
  lightbox.addEventListener('click', () => lightbox.classList.remove('active'));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') lightbox.classList.remove('active');
  });
