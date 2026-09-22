/* ===========================================
   LEZIONI ACCESSIBILI — INTEGRAZIONE DEL MENU DEL SITO
   ===========================================

   Serve SOLO alle pagine delle lezioni (/lezioni-accessibili/<lezione>/*.html),
   che hanno CSS, temi e script propri collaudati per l'accessibilita' e non
   devono essere toccati. Le pagine indice della sezione usano il menu normale.

   Come funziona: /assets/menu.js costruisce il menu dentro #site-menu e
   inietta i suoi stili nel <head>. Questo script, caricato SUBITO DOPO menu.js,
   sposta menu e stili dentro uno Shadow DOM agganciato a #site-menu.
   Cosi' gli stili del menu non raggiungono la lezione e gli stili della lezione
   non raggiungono il menu (le classi generiche delle lezioni restano intatte).
   menu.js non viene modificato: le altre pagine del sito non cambiano.

   Uso nella pagina:
     <div id="site-menu" data-lezioni-menu="full"></div>
     ...
     <script src="/assets/menu.js"></script>
     <script src="/lezioni-accessibili/assets/menu-lezioni.js"></script>

   Modalita':
     full     menu del sito completo, NON fisso (scorre via con la pagina),
              cosi' non copre i contenuti e non interferisce con gli header
              sticky delle lezioni.
     minimal  barra alta 48px con "<- Lezioni accessibili" e un pulsante
              "Menu del sito" che apre il menu solo su richiesta (Esc chiude).
              Per le pagine a schermo intero (es. "a tappe").
              Attributo opzionale data-back="URL" per il link di ritorno.
   =========================================== */
(function () {
    'use strict';
    var host = document.getElementById('site-menu');
    if (!host || host.shadowRoot || !host.attachShadow) return;

    var mode = host.getAttribute('data-lezioni-menu') === 'minimal' ? 'minimal' : 'full';

    // Stili iniettati da menu.js: li portiamo via dal documento
    var menuStyle = document.querySelector('style[data-menu-styles]');
    var styleText = menuStyle ? menuStyle.textContent : '';
    if (menuStyle) menuStyle.parentNode.removeChild(menuStyle);

    // Nodi costruiti da menu.js (i listener di apertura/chiusura restano attaccati)
    var built = document.createDocumentFragment();
    while (host.firstChild) built.appendChild(host.firstChild);

    var root = host.attachShadow({ mode: 'open' });

    if (mode === 'full') {
        var extra =
            /* isola il menu dagli stili ereditati dalla lezione */
            ':host{all:initial;display:block;position:relative;z-index:1000;font-family:"Outfit",system-ui,-apple-system,"Segoe UI",sans-serif;line-height:1.4;color:#e6edf3}' +
            /* non fisso: scorre con la pagina, non copre contenuti ne' header sticky */
            '.header{position:relative;backdrop-filter:none;-webkit-backdrop-filter:none}' +
            /* misure in px: le lezioni cambiano la dimensione del testo sulla radice (rem) */
            '.header-content{padding:10px 32px;height:64px}' +
            '.logo{gap:12px}.logo-icon{font-size:13.6px}.logo-text{font-size:17.6px}' +
            '.main-nav{gap:4px}' +
            '.nav-btn{padding:0 12px;font-size:13.6px;line-height:1.2;min-height:44px;display:inline-flex;align-items:center}' +
            '.hamburger{width:44px;height:44px}' +
            'a:focus-visible,button:focus-visible{outline:3px solid #00d9ff;outline-offset:2px}' +
            '@media (max-width:768px){.header-content{padding:10px 16px}.main-nav{position:absolute;top:64px;max-height:calc(100vh - 64px);overflow:auto}.nav-btn{padding:0 20px;font-size:16px;min-height:48px}}' +
            '@media (prefers-reduced-motion:reduce){*,*::before,*::after{transition:none!important;animation:none!important}}';
        var st = document.createElement('style');
        st.textContent = styleText + '\n' + extra;
        root.appendChild(st);
        root.appendChild(built);

        // Esc chiude il menu mobile e riporta il focus sul pulsante
        var toggle = root.getElementById('menu-toggle');
        root.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && toggle && toggle.getAttribute('aria-expanded') === 'true') {
                toggle.click();
                toggle.focus();
            }
        });
        if (toggle) toggle.setAttribute('aria-controls', 'main-nav');
        var nav = root.getElementById('main-nav');
        if (nav) nav.setAttribute('aria-label', 'Menu del sito');
        return;
    }

    // ---------- modalita' minimal ----------
    // Le voci arrivano da menu.js: una sola fonte per il menu del sito.
    var items = [];
    var links = built.querySelectorAll('.nav-btn');
    for (var i = 0; i < links.length; i++) {
        items.push({ href: links[i].getAttribute('href'), label: links[i].textContent });
    }
    var back = host.getAttribute('data-back') || '/lezioni-accessibili/';

    function esc(s) {
        return String(s).replace(/[&<>"]/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
        });
    }

    var css =
        /* colori: quelli della pagina (variabili CSS della lezione), con i valori chiari come riserva */
        ':host{all:initial;display:block;flex:0 0 auto;position:relative;z-index:40;' +
        'font-family:"Atkinson Hyperlegible",Verdana,Arial,sans-serif;font-size:16px;line-height:1.2;color:var(--ink,#1B2430)}' +
        '.bar{box-sizing:border-box;height:48px;display:flex;align-items:center;justify-content:space-between;gap:8px;' +
        'padding:0 10px;background:var(--card,#FFFFFF);border-bottom:1px solid var(--line,#C5CED9)}' +
        'a,button{font:inherit;color:inherit}' +
        '.back{display:inline-flex;align-items:center;gap:6px;min-height:44px;padding:0 6px;font-weight:700;text-decoration:underline;text-underline-offset:3px;border-radius:6px}' +
        '.menu-btn{box-sizing:border-box;min-height:44px;min-width:44px;padding:0 12px;font-weight:700;background:var(--card,#FFFFFF);' +
        'border:2px solid var(--line,#C5CED9);border-radius:8px;cursor:pointer}' +
        '.menu-btn[aria-expanded="true"]{border-color:var(--ink,#1B2430)}' +
        'a:focus-visible,button:focus-visible{outline:3px solid var(--primary,#1F4FA8);outline-offset:1px}' +
        '.panel{position:absolute;top:48px;right:8px;left:auto;box-sizing:border-box;width:min(320px,calc(100vw - 16px));' +
        'max-height:calc(100vh - 60px);overflow:auto;background:var(--card,#FFFFFF);border:2px solid var(--line,#C5CED9);border-radius:10px;padding:6px}' +
        '.panel[hidden]{display:none}' +
        '.panel ul{list-style:none;margin:0;padding:0}' +
        '.panel a{display:flex;align-items:center;min-height:44px;padding:0 12px;border-radius:6px;text-decoration:none}' +
        '.panel a:hover{text-decoration:underline}' +
        '.panel a[aria-current="page"]{font-weight:700;text-decoration:underline}' +
        '.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}';

    var list = items.map(function (it) {
        return '<li><a href="' + esc(it.href) + '">' + esc(it.label) + '</a></li>';
    }).join('');

    var st2 = document.createElement('style');
    st2.textContent = css;
    root.appendChild(st2);

    var wrap = document.createElement('div');
    wrap.innerHTML =
        '<div class="bar">' +
          '<a class="back" href="' + esc(back) + '"><span aria-hidden="true">&larr;</span> Lezioni accessibili</a>' +
          '<button type="button" class="menu-btn" aria-expanded="false" aria-controls="menu-sito">Menu del sito</button>' +
        '</div>' +
        '<nav class="panel" id="menu-sito" aria-label="Menu del sito" hidden><ul>' + list + '</ul></nav>';
    while (wrap.firstChild) root.appendChild(wrap.firstChild);

    var btn = root.querySelector('.menu-btn');
    var panel = root.getElementById('menu-sito');

    function openP() { panel.hidden = false; btn.setAttribute('aria-expanded', 'true'); }
    function closeP(focusBtn) {
        if (panel.hidden) return;
        panel.hidden = true; btn.setAttribute('aria-expanded', 'false');
        if (focusBtn) btn.focus();
    }
    btn.addEventListener('click', function () { panel.hidden ? openP() : closeP(false); });
    root.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && !panel.hidden) { e.stopPropagation(); closeP(true); }
    });
    // chiude se il focus o il clic escono dalla barra
    root.addEventListener('focusout', function (e) {
        if (e.relatedTarget && !root.contains(e.relatedTarget)) closeP(false);
    });
    document.addEventListener('click', function (e) {
        if (e.composedPath().indexOf(host) === -1) closeP(false);
    });
})();
