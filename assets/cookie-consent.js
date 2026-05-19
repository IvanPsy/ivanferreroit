/* ===========================================
   IVAN FERRERO — COOKIE CONSENT BANNER
   ===========================================

   Banner di consenso GDPR + Google Consent Mode v2.
   Vanilla JS, zero dipendenze, ~10KB.

   Auto-iniettato dalla coda di menu.js, ma anche caricabile
   direttamente con: <script src="/assets/cookie-consent.js"></script>

   API pubblica:
     window.ivfConsent.open()    — riapri il banner per modificare la scelta
     window.ivfConsent.reset()   — cancella la scelta e mostra di nuovo il banner
     window.ivfConsent.get()     — leggi lo stato corrente

   Versione: 1.0.0 (2026-05-19)
   =========================================== */

(function() {
  'use strict';

  // Evita doppio caricamento (menu.js + script tag diretto su dashboard senza menu)
  if (window.__ivfConsentLoaded) return;
  window.__ivfConsentLoaded = true;

  var STORAGE_KEY = 'ivf_cookie_consent_v1';
  var CONSENT_VERSION = '1.0.0';

  // ---------- Google Consent Mode v2 ----------
  // Imposta default deny PRIMA che qualunque tag Google si carichi.
  // Sicuro anche se gtag non e' presente: la coda dataLayer viene processata
  // quando/se gtag.js verra' aggiunto in futuro.
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function() { window.dataLayer.push(arguments); };

  window.gtag('consent', 'default', {
    'ad_storage': 'denied',
    'ad_user_data': 'denied',
    'ad_personalization': 'denied',
    'analytics_storage': 'denied',
    'functionality_storage': 'granted',
    'security_storage': 'granted',
    'wait_for_update': 500
  });

  // ---------- Lettura scelta salvata ----------
  function readSaved() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var data = JSON.parse(raw);
      if (data.version !== CONSENT_VERSION) return null;
      return data;
    } catch (e) {
      return null;
    }
  }

  function applyConsent(state) {
    window.gtag('consent', 'update', {
      'ad_storage':         state.marketing ? 'granted' : 'denied',
      'ad_user_data':       state.marketing ? 'granted' : 'denied',
      'ad_personalization': state.marketing ? 'granted' : 'denied',
      'analytics_storage':  state.analytics ? 'granted' : 'denied'
    });
  }

  function saveConsent(state) {
    state.version = CONSENT_VERSION;
    state.timestamp = new Date().toISOString();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      // localStorage non disponibile (modalita' privata Safari, etc.) — fallback su sessione corrente
      console.warn('[ivfConsent] localStorage non disponibile, scelta valida solo per la sessione corrente.');
    }
    applyConsent(state);
  }

  // Applica subito lo stato salvato (se esiste), prima di mostrare il banner
  var saved = readSaved();
  if (saved) applyConsent(saved);

  // ---------- CSS iniettato ----------
  var css = '' +
    '.ivf-cc-banner, .ivf-cc-modal, .ivf-cc-fab { font-family: "Outfit", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif; }' +
    '.ivf-cc-banner * , .ivf-cc-modal * { box-sizing: border-box; }' +
    '.ivf-cc-banner { position: fixed; left: 1rem; right: 1rem; bottom: 1rem; max-width: 720px; margin: 0 auto; background: rgba(15, 20, 25, 0.97); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); border: 1px solid rgba(0, 217, 255, 0.28); border-radius: 14px; padding: 1.3rem 1.4rem; color: #e6edf3; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(0, 217, 255, 0.04); z-index: 2147483646; display: none; }' +
    '.ivf-cc-banner.is-open { display: block; animation: ivf-cc-slide-up 0.35s cubic-bezier(0.16, 1, 0.3, 1); }' +
    '@keyframes ivf-cc-slide-up { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }' +
    '.ivf-cc-banner h2 { font-size: 1.05rem; font-weight: 600; margin: 0 0 0.5rem; color: #e6edf3; letter-spacing: -0.01em; }' +
    '.ivf-cc-banner p { font-size: 0.92rem; line-height: 1.55; color: #b3bdc7; margin: 0 0 1rem; }' +
    '.ivf-cc-banner a { color: #00d9ff; text-decoration: underline; text-decoration-color: rgba(0, 217, 255, 0.3); text-underline-offset: 3px; }' +
    '.ivf-cc-banner a:hover { text-decoration-color: #00d9ff; }' +
    '.ivf-cc-actions { display: flex; flex-wrap: wrap; gap: 0.55rem; }' +
    '.ivf-cc-btn { font-family: inherit; font-size: 0.88rem; font-weight: 500; padding: 0.65rem 1.1rem; border-radius: 8px; border: 1px solid transparent; cursor: pointer; transition: all 0.18s ease; line-height: 1.2; }' +
    '.ivf-cc-btn-primary { background: #00d9ff; color: #0a0e14; border-color: #00d9ff; }' +
    '.ivf-cc-btn-primary:hover { background: #5ce5ff; border-color: #5ce5ff; }' +
    '.ivf-cc-btn-secondary { background: transparent; color: #e6edf3; border-color: rgba(230, 237, 243, 0.22); }' +
    '.ivf-cc-btn-secondary:hover { background: rgba(230, 237, 243, 0.06); border-color: rgba(230, 237, 243, 0.4); }' +
    '.ivf-cc-btn-text { background: transparent; color: #b3bdc7; border-color: transparent; padding: 0.65rem 0.5rem; }' +
    '.ivf-cc-btn-text:hover { color: #00d9ff; }' +
    '.ivf-cc-overlay { position: fixed; inset: 0; background: rgba(5, 8, 12, 0.72); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); z-index: 2147483647; display: none; align-items: center; justify-content: center; padding: 1rem; }' +
    '.ivf-cc-overlay.is-open { display: flex; animation: ivf-cc-fade 0.25s ease; }' +
    '@keyframes ivf-cc-fade { from { opacity: 0; } to { opacity: 1; } }' +
    '.ivf-cc-modal { background: #0f1419; border: 1px solid rgba(0, 217, 255, 0.22); border-radius: 14px; max-width: 540px; width: 100%; max-height: 90vh; overflow-y: auto; padding: 1.7rem 1.7rem 1.4rem; color: #e6edf3; }' +
    '.ivf-cc-modal h2 { font-size: 1.25rem; font-weight: 600; margin: 0 0 0.4rem; }' +
    '.ivf-cc-modal > p { font-size: 0.92rem; line-height: 1.55; color: #b3bdc7; margin: 0 0 1.4rem; }' +
    '.ivf-cc-cat { padding: 1rem 0; border-top: 1px solid rgba(230, 237, 243, 0.08); display: grid; grid-template-columns: 1fr auto; gap: 0.8rem 1rem; }' +
    '.ivf-cc-cat:last-of-type { border-bottom: 1px solid rgba(230, 237, 243, 0.08); margin-bottom: 1.3rem; }' +
    '.ivf-cc-cat-name { font-weight: 500; font-size: 0.98rem; color: #e6edf3; }' +
    '.ivf-cc-cat-desc { grid-column: 1 / -1; font-size: 0.85rem; line-height: 1.5; color: #9aa3ad; margin: 0; }' +
    '.ivf-cc-toggle { position: relative; width: 42px; height: 24px; background: rgba(230, 237, 243, 0.14); border-radius: 12px; cursor: pointer; transition: background 0.2s; flex-shrink: 0; align-self: center; }' +
    '.ivf-cc-toggle::after { content: ""; position: absolute; top: 2px; left: 2px; width: 20px; height: 20px; background: #e6edf3; border-radius: 50%; transition: transform 0.2s ease; }' +
    '.ivf-cc-toggle.is-on { background: #00d9ff; }' +
    '.ivf-cc-toggle.is-on::after { transform: translateX(18px); background: #0a0e14; }' +
    '.ivf-cc-toggle.is-locked { opacity: 0.55; cursor: not-allowed; background: rgba(0, 217, 255, 0.4); }' +
    '.ivf-cc-modal-actions { display: flex; flex-wrap: wrap; gap: 0.55rem; justify-content: flex-end; }' +
    '.ivf-cc-fab { position: fixed; left: 1rem; bottom: 1rem; width: 40px; height: 40px; border-radius: 50%; background: rgba(15, 20, 25, 0.92); border: 1px solid rgba(0, 217, 255, 0.3); color: #00d9ff; font-size: 1.1rem; cursor: pointer; z-index: 2147483645; display: none; align-items: center; justify-content: center; transition: all 0.18s ease; backdrop-filter: blur(10px); }' +
    '.ivf-cc-fab.is-visible { display: flex; }' +
    '.ivf-cc-fab:hover { background: rgba(0, 217, 255, 0.15); border-color: #00d9ff; transform: scale(1.08); }' +
    '@media (max-width: 560px) { .ivf-cc-banner { padding: 1.1rem; } .ivf-cc-btn { font-size: 0.85rem; padding: 0.6rem 0.9rem; } .ivf-cc-actions { flex-direction: column; } .ivf-cc-actions .ivf-cc-btn { width: 100%; } .ivf-cc-modal { padding: 1.3rem; } }';

  var styleEl = document.createElement('style');
  styleEl.id = 'ivf-cc-styles';
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // ---------- DOM banner + modal + FAB ----------
  function buildDOM() {
    var banner = document.createElement('div');
    banner.className = 'ivf-cc-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-live', 'polite');
    banner.setAttribute('aria-label', 'Banner consenso cookie');
    banner.innerHTML = '' +
      '<h2>Cookie e tracciamento</h2>' +
      '<p>Uso cookie tecnici (sempre attivi) e, con il tuo consenso, cookie di analisi e marketing per misurare il traffico e l\'efficacia delle campagne. Puoi accettare tutto, rifiutare tutto, o scegliere per categoria. Approfondisci nella <a href="/privacy-policy/">privacy policy</a>.</p>' +
      '<div class="ivf-cc-actions">' +
        '<button type="button" class="ivf-cc-btn ivf-cc-btn-primary" data-ivf-action="accept-all">Accetta tutto</button>' +
        '<button type="button" class="ivf-cc-btn ivf-cc-btn-secondary" data-ivf-action="reject-all">Solo necessari</button>' +
        '<button type="button" class="ivf-cc-btn ivf-cc-btn-text" data-ivf-action="customize">Personalizza</button>' +
      '</div>';

    var overlay = document.createElement('div');
    overlay.className = 'ivf-cc-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Preferenze cookie');
    overlay.innerHTML = '' +
      '<div class="ivf-cc-modal">' +
        '<h2>Preferenze cookie</h2>' +
        '<p>Scegli per categoria. Le tue scelte si applicano a questo sito e sono revocabili in qualsiasi momento.</p>' +
        '<div class="ivf-cc-cat">' +
          '<span class="ivf-cc-cat-name">Necessari</span>' +
          '<div class="ivf-cc-toggle is-on is-locked" aria-label="Sempre attivi" role="switch" aria-checked="true" aria-disabled="true"></div>' +
          '<p class="ivf-cc-cat-desc">Indispensabili al funzionamento del sito (preferenze, sicurezza). Non richiedono consenso.</p>' +
        '</div>' +
        '<div class="ivf-cc-cat">' +
          '<span class="ivf-cc-cat-name">Analitici</span>' +
          '<div class="ivf-cc-toggle" data-ivf-cat="analytics" role="switch" aria-checked="false" tabindex="0"></div>' +
          '<p class="ivf-cc-cat-desc">Google Analytics e simili: aiutano a capire quali contenuti funzionano, in forma aggregata e pseudonima.</p>' +
        '</div>' +
        '<div class="ivf-cc-cat">' +
          '<span class="ivf-cc-cat-name">Marketing</span>' +
          '<div class="ivf-cc-toggle" data-ivf-cat="marketing" role="switch" aria-checked="false" tabindex="0"></div>' +
          '<p class="ivf-cc-cat-desc">Google Ads e remarketing: misurazione delle conversioni e personalizzazione degli annunci.</p>' +
        '</div>' +
        '<div class="ivf-cc-modal-actions">' +
          '<button type="button" class="ivf-cc-btn ivf-cc-btn-secondary" data-ivf-action="reject-all">Solo necessari</button>' +
          '<button type="button" class="ivf-cc-btn ivf-cc-btn-primary" data-ivf-action="save-custom">Salva scelte</button>' +
        '</div>' +
      '</div>';

    var fab = document.createElement('button');
    fab.type = 'button';
    fab.className = 'ivf-cc-fab';
    fab.setAttribute('aria-label', 'Gestisci preferenze cookie');
    fab.setAttribute('title', 'Gestisci preferenze cookie');
    fab.innerHTML = '&#9881;'; // cog icon

    document.body.appendChild(banner);
    document.body.appendChild(overlay);
    document.body.appendChild(fab);

    return { banner: banner, overlay: overlay, fab: fab };
  }

  // ---------- Logica ----------
  function init() {
    var dom = buildDOM();

    function openBanner() { dom.banner.classList.add('is-open'); }
    function closeBanner() { dom.banner.classList.remove('is-open'); }
    function openModal() {
      // Sync toggle con stato corrente (salvato o default off)
      var current = readSaved() || { analytics: false, marketing: false };
      dom.overlay.querySelectorAll('[data-ivf-cat]').forEach(function(t) {
        var cat = t.getAttribute('data-ivf-cat');
        if (current[cat]) {
          t.classList.add('is-on');
          t.setAttribute('aria-checked', 'true');
        } else {
          t.classList.remove('is-on');
          t.setAttribute('aria-checked', 'false');
        }
      });
      dom.overlay.classList.add('is-open');
    }
    function closeModal() { dom.overlay.classList.remove('is-open'); }
    function showFab() { dom.fab.classList.add('is-visible'); }

    function commit(state) {
      saveConsent(state);
      closeBanner();
      closeModal();
      showFab();
    }

    // Click handlers (delegation)
    document.addEventListener('click', function(e) {
      var action = e.target.getAttribute && e.target.getAttribute('data-ivf-action');
      if (!action) return;

      if (action === 'accept-all') commit({ analytics: true, marketing: true });
      else if (action === 'reject-all') commit({ analytics: false, marketing: false });
      else if (action === 'customize') openModal();
      else if (action === 'save-custom') {
        var state = { analytics: false, marketing: false };
        dom.overlay.querySelectorAll('[data-ivf-cat]').forEach(function(t) {
          state[t.getAttribute('data-ivf-cat')] = t.classList.contains('is-on');
        });
        commit(state);
      }
    });

    // Toggle clicks dentro al modal
    dom.overlay.addEventListener('click', function(e) {
      var t = e.target;
      if (!t.classList || !t.classList.contains('ivf-cc-toggle')) return;
      if (t.classList.contains('is-locked')) return;
      var on = t.classList.toggle('is-on');
      t.setAttribute('aria-checked', on ? 'true' : 'false');
    });

    // Toggle via keyboard (accessibilita')
    dom.overlay.addEventListener('keydown', function(e) {
      if ((e.key === ' ' || e.key === 'Enter') && e.target.classList && e.target.classList.contains('ivf-cc-toggle') && !e.target.classList.contains('is-locked')) {
        e.preventDefault();
        var on = e.target.classList.toggle('is-on');
        e.target.setAttribute('aria-checked', on ? 'true' : 'false');
      }
    });

    // Chiudi modal cliccando fuori (ma NON il banner — quello richiede scelta esplicita)
    dom.overlay.addEventListener('click', function(e) {
      if (e.target === dom.overlay) closeModal();
    });

    // Esc chiude solo il modal
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && dom.overlay.classList.contains('is-open')) closeModal();
    });

    // FAB riapre banner
    dom.fab.addEventListener('click', function() {
      openModal();
    });

    // Stato iniziale: se nessuna scelta, mostra banner; se scelta presente, mostra solo FAB
    if (saved) {
      showFab();
    } else {
      // Piccolo delay per non sembrare aggressivo
      setTimeout(openBanner, 350);
    }

    // API pubblica
    window.ivfConsent = {
      open: openModal,
      reset: function() {
        try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
        location.reload();
      },
      get: function() { return readSaved(); }
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
