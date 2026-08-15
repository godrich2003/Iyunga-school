// ============ MOBILE NAV TOGGLE ============
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

// ============ SCROLL: NAV SHRINK + PROGRESS BAR + ACTIVE LINK ============
const nav = document.getElementById('nav');
const progressBar = document.getElementById('progressBar');
const toTopBtn = document.getElementById('toTop');
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-link');

function onScroll(){
  const scrollY = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;

  nav.classList.toggle('scrolled', scrollY > 40);
  toTopBtn.classList.toggle('visible', scrollY > 500);
  progressBar.style.width = docHeight > 0 ? `${(scrollY / docHeight) * 100}%` : '0%';

  let currentId = sections[0]?.id;
  sections.forEach(section => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= 120) currentId = section.id;
  });
  navAnchors.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === `#${currentId}`);
  });
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

toTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ============ SCROLL REVEAL ============
const revealItems = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealItems.forEach(item => revealObserver.observe(item));

// ============ ANIMATED COUNTERS ============
const counters = document.querySelectorAll('.counter');
function animateCounter(el){
  const target = parseInt(el.dataset.target, 10);
  const duration = 1200;
  const start = performance.now();

  function tick(now){
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
counters.forEach(c => counterObserver.observe(c));

// ============ ACADEMICS TABS ============
const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.tab-panel');
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
    panels.forEach(p => p.classList.remove('active'));

    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    document.getElementById(tab.dataset.tab).classList.add('active');
  });
});

// ============ CONTACT FORM VALIDATION ============
const form = document.getElementById('contactForm');
const nameInput = document.getElementById('nameInput');
const emailInput = document.getElementById('emailInput');
const messageInput = document.getElementById('messageInput');
const formStatus = document.getElementById('formStatus');

function setError(input, errorEl, message){
  input.classList.toggle('invalid', Boolean(message));
  errorEl.textContent = message || '';
}

function validateName(){
  const value = nameInput.value.trim();
  const msg = value.length < 2 ? 'Please enter your full name.' : '';
  setError(nameInput, document.getElementById('nameError'), msg);
  return !msg;
}

function validateEmail(){
  const value = emailInput.value.trim();
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const msg = !pattern.test(value) ? 'Please enter a valid email address.' : '';
  setError(emailInput, document.getElementById('emailError'), msg);
  return !msg;
}

function validateMessage(){
  const value = messageInput.value.trim();
  const msg = value.length < 10 ? 'Message should be at least 10 characters.' : '';
  setError(messageInput, document.getElementById('messageError'), msg);
  return !msg;
}

nameInput.addEventListener('blur', validateName);
emailInput.addEventListener('blur', validateEmail);
messageInput.addEventListener('blur', validateMessage);

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const validName = validateName();
  const validEmail = validateEmail();
  const validMessage = validateMessage();

  if (validName && validEmail && validMessage){
    formStatus.textContent = `Thank you, ${nameInput.value.trim()} — your message has been noted. We'll reply by email soon.`;
    formStatus.className = 'form-status success';
    form.reset();
  } else {
    formStatus.textContent = 'Please correct the highlighted fields and try again.';
    formStatus.className = 'form-status error';
  }
});

// ============ FOOTER YEAR ============
document.getElementById('year').textContent = new Date().getFullYear();