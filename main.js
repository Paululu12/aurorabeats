/**
 * AURORA BEATS — main.js
 * Liest CONFIG aus config.js und baut die Seite auf.
 * Kein Login, kein Bot — pure statische Seite.
 */

/* ════════════════════════════════════════════════════
   SEITE AUFBAUEN
════════════════════════════════════════════════════ */

function buildPage() {
  // ── Basis-Texte ────────────────────────────────
  setText('nav-logo',    CONFIG.djName);
  setText('hero-name-main', CONFIG.djName.split(' ')[0]);
  setText('hero-name-acc',  CONFIG.djName.split(' ').slice(1).join(' ') || '');
  setText('hero-tagline',   CONFIG.tagline);
  setText('footer-logo',    CONFIG.djName);
  setText('footer-domain',  CONFIG.domain);
  setText('footer-powered', 'Powered by ' + CONFIG.poweredBy);

  // ── Document Title ─────────────────────────────
  document.title = CONFIG.djName + ' – DJ';

  // ── Bio ────────────────────────────────────────
  const bioEl = document.getElementById('bio-paragraphs');
  if (bioEl) {
    bioEl.innerHTML = '';
    CONFIG.bio.forEach(para => {
      const p = document.createElement('p');
      p.textContent = para;
      bioEl.appendChild(p);
    });
  }

  // ── Genres ────────────────────────────────────
  const tagRow = document.getElementById('genre-tags');
  if (tagRow) {
    tagRow.innerHTML = '';
    CONFIG.genres.forEach(g => {
      const span = document.createElement('span');
      span.className = 'genre-tag';
      span.textContent = g;
      tagRow.appendChild(span);
    });
  }

  // ── Sendeplan ─────────────────────────────────
  const tbody = document.getElementById('sched-body');
  if (tbody) {
    tbody.innerHTML = '';
    CONFIG.schedule.forEach(row => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="td-day">${row.day}</td>
        <td class="td-time">${row.time}</td>
        <td class="td-show">
          ${escHtml(row.show)}
          ${row.live ? '<span class="live-badge">LIVE</span>' : ''}
        </td>
        <td class="td-genre">${escHtml(row.genre)}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  // ── Socials ───────────────────────────────────
  const socialGrid = document.getElementById('social-grid');
  if (socialGrid) {
    socialGrid.innerHTML = '';
    CONFIG.socials
      .filter(s => s.url && s.url !== null)
      .forEach(s => {
        const a = document.createElement('a');
        a.className = 'social-card reveal';
        a.href      = s.url;
        a.target    = '_blank';
        a.rel       = 'noopener noreferrer';
        a.innerHTML = `
          <div class="social-icon">${getSocialSVG(s.icon)}</div>
          <div>
            <div class="social-label">${escHtml(s.label)}</div>
            <div class="social-sub">↗ Besuchen</div>
          </div>
        `;
        socialGrid.appendChild(a);
      });
  }

  // ── Kontakt ───────────────────────────────────
  const mailHref = 'mailto:' + CONFIG.impressum.email;
  setAttr('contact-mail-link',  'href',        mailHref);
  setText('contact-mail-link',  CONFIG.impressum.email);
  setAttr('contact-mail-btn',   'href',        mailHref);

  // ── Impressum ─────────────────────────────────
  setText('imp-name',   CONFIG.impressum.name);
  setText('imp-street', CONFIG.impressum.street);
  setText('imp-city',   CONFIG.impressum.city);
  const impMail = document.getElementById('imp-email');
  if (impMail) {
    impMail.href        = mailHref;
    impMail.textContent = CONFIG.impressum.email;
  }
}

/* ════════════════════════════════════════════════════
   STATUS-SYSTEM
   Prio: 1) JSONBin (wenn enabled)  2) config.js
════════════════════════════════════════════════════ */

function applyStatus(online) {
  const pill = document.getElementById('status-pill');
  const text = document.getElementById('status-text');
  if (!pill || !text) return;

  if (online) {
    pill.className   = 'status-pill is-online';
    text.textContent = 'ONLINE';
  } else {
    pill.className   = 'status-pill';
    text.textContent = 'OFFLINE';
  }
}

/* ── JSONBin fetch ───────────────────────────────── */
async function fetchJsonBin() {
  if (!CONFIG.jsonbin.enabled) return;
  try {
    const res = await fetch(
      `https://api.jsonbin.io/v3/b/${CONFIG.jsonbin.binId}/latest`,
      { headers: { 'X-Master-Key': CONFIG.jsonbin.apiKey } }
    );
    if (!res.ok) throw new Error('JSONBin HTTP ' + res.status);
    const data = await res.json();
    applyStatus(data.record.online === true);
  } catch (e) {
    console.warn('[AuroraBeats] JSONBin nicht erreichbar, nutze config.js Status.', e.message);
  }
}

/* ── Polling ─────────────────────────────────────── */
function startPolling() {
  if (!CONFIG.jsonbin.enabled) return;
  const ms = (CONFIG.jsonbin.pollInterval || 30) * 1000;
  setInterval(fetchJsonBin, ms);
}

/* ════════════════════════════════════════════════════
   SCROLL REVEAL
════════════════════════════════════════════════════ */

function initReveal() {
  const els = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    }),
    { threshold: 0.08 }
  );
  els.forEach(el => obs.observe(el));
}

/* ════════════════════════════════════════════════════
   UTILS
════════════════════════════════════════════════════ */

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function setAttr(id, attr, val) {
  const el = document.getElementById(id);
  if (el) el.setAttribute(attr, val);
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function getSocialSVG(icon) {
  const icons = {
    ig: `<svg viewBox="0 0 24 24" fill="none" stroke="#f5d20a" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
           <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
           <circle cx="12" cy="12" r="4"/>
           <circle cx="17.5" cy="6.5" r="1" fill="#f5d20a" stroke="none"/>
         </svg>`,
    discord: `<svg viewBox="0 0 24 24" fill="#f5d20a">
                <path d="M20.317 4.37a19.8 19.8 0 0 0-4.885-1.515.07.07 0 0 0-.073.035 13.8 13.8 0 0 0-.622 1.28 18.3 18.3 0 0 0-5.487 0 12.6 12.6 0 0 0-.617-1.28.07.07 0 0 0-.073-.035A19.7 19.7 0 0 0 3.677 4.37a.06.06 0 0 0-.028.027C.533 9.046-.32 13.58.099 18.057a.08.08 0 0 0 .028.055 19.9 19.9 0 0 0 5.993 3.03.07.07 0 0 0 .077-.027 14.1 14.1 0 0 0 1.226-1.994.065.065 0 0 0-.036-.091 13.1 13.1 0 0 1-1.872-.892.066.066 0 0 1-.006-.11c.126-.094.252-.192.372-.291a.07.07 0 0 1 .071-.01c3.928 1.793 8.18 1.793 12.062 0a.07.07 0 0 1 .072.009c.12.099.246.198.373.292a.066.066 0 0 1-.005.11 12.3 12.3 0 0 1-1.873.892.066.066 0 0 0-.036.092c.36.698.772 1.362 1.225 1.993a.07.07 0 0 0 .078.028 19.8 19.8 0 0 0 6.002-3.03.08.08 0 0 0 .028-.054c.5-5.177-.838-9.674-3.549-13.66a.06.06 0 0 0-.028-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>`,
    twitch: `<svg viewBox="0 0 24 24" fill="#f5d20a">
               <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"/>
             </svg>`,
    youtube: `<svg viewBox="0 0 24 24" fill="#f5d20a">
                <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
              </svg>`,
    soundcloud: `<svg viewBox="0 0 24 24" fill="#f5d20a">
                   <path d="M1.175 12.225c-.015 0-.027.008-.03.022l-.4 2.318.4 2.306c.003.014.015.023.03.023.014 0 .026-.01.03-.022l.452-2.307-.452-2.318a.032.032 0 0 0-.03-.022zm.93-.695c-.018 0-.033.013-.036.03l-.33 3.013.33 2.99c.003.018.018.03.035.03.017 0 .032-.012.035-.03l.375-2.99-.375-3.013a.038.038 0 0 0-.035-.03z"/>
                 </svg>`,
  };
  return icons[icon] || `<span style="color:var(--yellow);font-size:1.1rem;">♪</span>`;
}

/* ════════════════════════════════════════════════════
   INIT
════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  buildPage();

  // Status: erst config.js, dann ggf. JSONBin überschreiben
  applyStatus(CONFIG.online);
  fetchJsonBin();
  startPolling();

  // Reveal nach buildPage (da Socials dynamisch eingefügt)
  setTimeout(initReveal, 50);
});
