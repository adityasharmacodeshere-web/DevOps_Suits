(() => {
  const body = document.body;
  const intro = document.querySelector('#intro');
  const site = document.querySelector('#site');
  const enter = document.querySelector('#enter');
  const cursor = document.querySelector('.cursor');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const activate = () => {
    intro.classList.add('is-dismissed');
    site.classList.add('is-visible');
    site.setAttribute('aria-hidden', 'false');
    body.classList.remove('intro-active');
    window.setTimeout(() => document.querySelector('#top').focus({ preventScroll: true }), 700);
  };
  body.classList.add('intro-active');
  enter.addEventListener('click', activate);
  enter.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') activate(); });

  if (!reducedMotion && cursor) {
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let targetX = x;
    let targetY = y;
    const move = (event) => { targetX = event.clientX; targetY = event.clientY; };
    window.addEventListener('pointermove', move, { passive: true });
    const follow = () => {
      x += (targetX - x) * 0.14;
      y += (targetY - y) * 0.14;
      cursor.style.left = `${x}px`;
      cursor.style.top = `${y}px`;
      requestAnimationFrame(follow);
    };
    follow();
    document.querySelectorAll('a, button, input, summary, [data-tilt]').forEach((element) => {
      element.addEventListener('mouseenter', () => cursor.classList.add('is-hover'));
      element.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
    });
  }

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add('is-visible'); });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

  if (!reducedMotion && window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('[data-tilt]').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        const rotateX = ((event.clientY - rect.top) / rect.height - 0.5) * -5;
        const rotateY = ((event.clientX - rect.left) / rect.width - 0.5) * 5;
        card.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
    const visual = document.querySelector('[data-parallax]');
    window.addEventListener('pointermove', (event) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 12;
      const y = (event.clientY / window.innerHeight - 0.5) * 12;
      visual.style.transform = `translate(${x}px, ${y}px)`;
    }, { passive: true });
  }

  const form = document.querySelector('#register-form');
  const status = document.querySelector('#form-status');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = new FormData(form).get('name');
    status.textContent = `Seat confirmed, ${name}. See you in the room.`;
    form.reset();
    form.querySelector('button').disabled = true;
  });
})();
