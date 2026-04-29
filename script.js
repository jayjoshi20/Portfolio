/* ============================================================
   JAY JOSHI — NEURAL PORTFOLIO 2026
   Interactive JS: Loader · Cursor · Particles · Tilt · Reveal
   ============================================================ */

/* ── LOADER ──────────────────────────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('loader').classList.add('done'), 1800);
});

/* ── SCROLL PROGRESS ─────────────────────────────────── */
const scrollBar = document.getElementById('scroll-progress');
function updateScrollBar() {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  scrollBar.style.width = (window.scrollY / total * 100) + '%';
}
window.addEventListener('scroll', updateScrollBar, { passive: true });

/* ── NAVBAR SHRINK ───────────────────────────────────── */
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

/* ── ACTIVE NAV LINK ─────────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navAs    = document.querySelectorAll('.nav-links a');

const secObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navAs.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id);
      });
    }
  });
}, { threshold: 0.35 });

sections.forEach(s => secObs.observe(s));

/* ── MOBILE MENU ─────────────────────────────────────── */
const hamburger  = document.querySelector('.hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const mobileClose = document.querySelector('.mobile-close');

hamburger?.addEventListener('click', () => mobileMenu.classList.add('open'));
mobileClose?.addEventListener('click', () => mobileMenu.classList.remove('open'));
mobileMenu?.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => mobileMenu.classList.remove('open'))
);

/* ── SCROLL REVEAL ───────────────────────────────────── */
const revObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));

/* ── COUNTER ANIMATION ───────────────────────────────── */
function countUp(el, target, ms = 1400) {
  let n = 0;
  const step = target / (ms / 16);
  const t = setInterval(() => {
    n = Math.min(n + step, target);
    el.textContent = Math.floor(n) + '+';
    if (n >= target) clearInterval(t);
  }, 16);
}

const cntObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      countUp(e.target, +e.target.dataset.target);
      cntObs.unobserve(e.target);
    }
  });
}, { threshold: 0.6 });

document.querySelectorAll('[data-target]').forEach(el => cntObs.observe(el));

/* ── TYPING EFFECT ───────────────────────────────────── */
const phrases = ['the Future of AI', 'Intelligent Systems', 'LLM-Powered Apps', 'Real-Time Vision AI', 'Cloud-Native ML'];
let pIdx = 0, cIdx = 0, deleting = false;
const typEl = document.querySelector('.typing-text');

function tick() {
  if (!typEl) return;
  const p = phrases[pIdx];
  typEl.textContent = deleting ? p.slice(0, --cIdx) : p.slice(0, ++cIdx);

  if (!deleting && cIdx === p.length) { deleting = true; return setTimeout(tick, 2200); }
  if (deleting && cIdx === 0)        { deleting = false; pIdx = (pIdx + 1) % phrases.length; }
  setTimeout(tick, deleting ? 55 : 95);
}
tick();

/* ── CUSTOM CURSOR ───────────────────────────────────── */
const dot     = document.querySelector('.cursor-dot');
const outline = document.querySelector('.cursor-outline');
let tx = 0, ty = 0, ox = 0, oy = 0;

document.addEventListener('mousemove', e => {
  tx = e.clientX; ty = e.clientY;
  dot.style.left = tx + 'px';
  dot.style.top  = ty + 'px';
}, { passive: true });

(function animCursor() {
  ox += (tx - ox) * .13;
  oy += (ty - oy) * .13;
  outline.style.left = ox + 'px';
  outline.style.top  = oy + 'px';
  requestAnimationFrame(animCursor);
})();

document.querySelectorAll('a, button, .proj-card, .feature-card, .skill-tag, .stat-box').forEach(el => {
  el.addEventListener('mouseenter', () => outline.classList.add('big'));
  el.addEventListener('mouseleave', () => outline.classList.remove('big'));
});

/* ── PARTICLE NETWORK ────────────────────────────────── */
const canvas = document.getElementById('network-canvas');
const ctx    = canvas.getContext('2d');
let pts = [];

function sizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}

class Pt {
  constructor() {
    this.x  = Math.random() * canvas.width;
    this.y  = Math.random() * canvas.height;
    this.vx = (Math.random() - .5) * .45;
    this.vy = (Math.random() - .5) * .45;
    this.r  = Math.random() * 1.8 + .8;
    this.a  = Math.random() * .5 + .2;
  }
  move() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width)  this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0,245,255,${this.a})`;
    ctx.fill();
  }
}

function initPts() {
  const n = Math.min(Math.floor(canvas.width * canvas.height / 14000), 100);
  pts = Array.from({ length: n }, () => new Pt());
}

function drawFrame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  pts.forEach(p => { p.move(); p.draw(); });
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
      const d = Math.sqrt(dx*dx + dy*dy);
      if (d < 115) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(0,245,255,${(1 - d/115) * .18})`;
        ctx.lineWidth = .6;
        ctx.moveTo(pts[i].x, pts[i].y);
        ctx.lineTo(pts[j].x, pts[j].y);
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawFrame);
}

sizeCanvas(); initPts(); drawFrame();
window.addEventListener('resize', () => { sizeCanvas(); initPts(); });

/* ── 3D TILT ON PROJECT CARDS ────────────────────────── */
document.querySelectorAll('.proj-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r    = card.getBoundingClientRect();
    const rotX = ((e.clientY - r.top  - r.height/2) / (r.height/2)) * -7;
    const rotY = ((e.clientX - r.left - r.width /2) / (r.width /2)) *  7;
    card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

/* ── BACK TO TOP ─────────────────────────────────────── */
const btt = document.getElementById('back-top');
window.addEventListener('scroll', () => {
  btt.classList.toggle('show', window.scrollY > 500);
}, { passive: true });
btt?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
