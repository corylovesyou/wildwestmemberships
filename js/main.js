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

const tierGroup = document.getElementById('calcTierGroup');
const modelsInput = document.getElementById('calcModels');
const modelsOut = document.getElementById('calcModelsOut');
const standardOut = document.getElementById('calcStandard');
const corpTierOut = document.getElementById('calcCorpTier');
const discountedOut = document.getElementById('calcDiscounted');
const savingsOut = document.getElementById('calcSavings');
const thresholdOut = document.getElementById('calcThreshold');

let currentRate = 299;

const money = (n) =>
  '$' + Math.round(n).toLocaleString('en-US');

function updateCalculator() {
  const models = Number(modelsInput.value);
  modelsOut.textContent = models;

  const standardTotal = currentRate * models;
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
    const modelsNeeded = Math.ceil(next.minSpend / currentRate);
    corpTierOut.textContent = 'Not yet qualified';
    discountedOut.textContent = money(standardTotal) + '/mo';
    savingsOut.textContent = '$0';
    thresholdOut.textContent = `Add ${modelsNeeded - models} more model${modelsNeeded - models === 1 ? '' : 's'} on this tier to unlock ${next.name} (${next.discount * 100}% off).`;
  }
}

tierGroup.addEventListener('click', (e) => {
  const btn = e.target.closest('.calc__tier-btn');
  if (!btn) return;
  tierGroup.querySelectorAll('.calc__tier-btn').forEach((b) => b.classList.remove('is-active'));
  btn.classList.add('is-active');
  currentRate = Number(btn.dataset.rate);
  updateCalculator();
});

modelsInput.addEventListener('input', updateCalculator);

updateCalculator();

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
