// Mobile nav toggle
const navToggle = document.querySelector('.nav__toggle');
const navLinks = document.querySelector('.nav__links');
navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(open));
});
navLinks.querySelectorAll('a').forEach((a) =>
  a.addEventListener('click', () => {
    navLinks.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  })
);

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// ---------- Day / night mode ----------
const themeToggle = document.querySelector('.theme-toggle');
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  themeToggle.setAttribute('aria-pressed', String(theme === 'dark'));
  try {
    localStorage.setItem('wwsh-theme', theme);
  } catch (e) {
    /* localStorage unavailable, theme just won't persist */
  }
}
themeToggle.setAttribute(
  'aria-pressed',
  String(document.documentElement.getAttribute('data-theme') === 'dark')
);
themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  setTheme(current === 'dark' ? 'light' : 'dark');
});

// ---------- Membership Tabs ----------
const tabBtns = document.querySelectorAll('.tabs__btn[data-tab]');
const tabPanels = document.querySelectorAll('.tab-panel[data-panel]');

function activateTab(tab) {
  tabBtns.forEach((b) => {
    const active = b.dataset.tab === tab;
    b.classList.toggle('is-active', active);
    b.setAttribute('aria-selected', String(active));
  });
  tabPanels.forEach((p) => {
    p.hidden = p.dataset.panel !== tab;
  });
}

tabBtns.forEach((b) => b.addEventListener('click', () => activateTab(b.dataset.tab)));

// Nav links that point into a specific tab panel should switch to that tab first
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', () => {
    const targetEl = document.getElementById(a.getAttribute('href').slice(1));
    const panel = targetEl && targetEl.closest('.tab-panel[data-panel]');
    if (panel) activateTab(panel.dataset.panel);
  });
});

// ---------- Membership Calculator ----------
const CORP_TIERS = [
  { name: 'Corporate Tier 3', discount: 0.2, minSpend: 20000 },
  { name: 'Corporate Tier 2', discount: 0.15, minSpend: 10000 },
  { name: 'Corporate Tier 1', discount: 0.1, minSpend: 5000 },
];

const money = (n) => '$' + Math.round(n).toLocaleString('en-US');

function initCalculator(root) {
  const tierGroup = root.querySelector('.calc__tiers');
  const modelsInput = root.querySelector('.calc__models');
  const modelsOut = root.querySelector('.calc__models-out');
  const standardOut = root.querySelector('.calc__standard');
  const corpTierOut = root.querySelector('.calc__corp-tier');
  const discountedOut = root.querySelector('.calc__discounted');
  const savingsOut = root.querySelector('.calc__savings');
  const thresholdOut = root.querySelector('.calc__note');
  const unit = (root.dataset.unitLabel || 'Models').toLowerCase();

  let currentRate = Number(tierGroup.querySelector('.calc__tier-btn.is-active').dataset.rate);

  function update() {
    const count = Number(modelsInput.value);
    modelsOut.textContent = count;

    const standardTotal = currentRate * count;
    standardOut.textContent = money(standardTotal) + '/mo';

    const reached = CORP_TIERS.find((t) => standardTotal >= t.minSpend);

    if (reached) {
      const discounted = standardTotal * (1 - reached.discount);
      corpTierOut.textContent = `${reached.name} (${reached.discount * 100}% off)`;
      discountedOut.textContent = money(discounted) + '/mo';
      savingsOut.textContent = money(standardTotal - discounted) + '/mo';
      thresholdOut.textContent = '';
    } else {
      const next = CORP_TIERS[CORP_TIERS.length - 1];
      const countNeeded = Math.ceil(next.minSpend / currentRate);
      corpTierOut.textContent = 'Not yet qualified';
      discountedOut.textContent = money(standardTotal) + '/mo';
      savingsOut.textContent = '$0';
      thresholdOut.textContent = `Add ${countNeeded - count} more ${unit} on this tier to unlock ${next.name} (${next.discount * 100}% off).`;
    }
  }

  tierGroup.addEventListener('click', (e) => {
    const btn = e.target.closest('.calc__tier-btn');
    if (!btn) return;
    tierGroup.querySelectorAll('.calc__tier-btn').forEach((b) => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    currentRate = Number(btn.dataset.rate);
    update();
  });

  modelsInput.addEventListener('input', update);

  update();
}

document.querySelectorAll('.calc').forEach(initCalculator);

// ---------- Scroll reveal ----------
const revealTargets = document.querySelectorAll('.section__head, .panel, .tier-card, .stat-card, .perk-card');
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
revealTargets.forEach((el) => {
  el.classList.add('reveal');
  io.observe(el);
});
