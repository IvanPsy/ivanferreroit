/* ===========================================
   IVAN FERRERO — MENU CONDIVISO
   ===========================================

   Uso: Includere in ogni pagina HTML:
   <div id="site-menu"></div>
   <script src="/assets/menu.js"></script>

   Configurazione: Modificare la variabile menuConfig qui sotto
   =========================================== */

const menuConfig = {
    // Logo/Brand
    brand: {
        icon: 'IF',
        text: 'Ivan Ferrero',
        highlight: 'Ivan',
        link: '/'
    },

    // Voci di navigazione
    items: [
        { label: 'Home', href: '/' },
        { label: 'Dashboard', href: '/dashboards/' },
        { label: 'Osservatorio', href: '/osservatorio/' },
        { label: 'Digitale Inclusivo', href: '/digitale-inclusivo/' },
        { label: 'Dialoghi', href: '/dialoghi/' },
        { label: 'Chi Sono', href: '/#chi-sono' },
        { label: 'Contatti', href: '/#contatti' }
    ]
};

// ===========================================
// NON MODIFICARE SOTTO QUESTA RIGA
// ===========================================

(function() {
    const menu = document.getElementById('site-menu');
    if (!menu) {
        console.warn('Menu container #site-menu non trovato');
        return;
    }

    const currentPath = window.location.pathname;

    function isActive(href) {
        if (href === '/') {
            return currentPath === '/' || currentPath === '/index.html';
        }
        return currentPath.startsWith(href);
    }

    function buildBrandText() {
        const { text, highlight } = menuConfig.brand;
        if (highlight && text.includes(highlight)) {
            return text.replace(highlight, `<span>${highlight}</span>`);
        }
        return text;
    }

    const navItems = menuConfig.items.map(item => {
        const activeClass = isActive(item.href) ? ' active' : '';
        return `<a href="${item.href}" class="nav-btn${activeClass}">${item.label}</a>`;
    }).join('');

    menu.innerHTML = `
        <header class="header">
            <div class="header-content">
                <a href="${menuConfig.brand.link}" class="logo">
                    <div class="logo-icon">${menuConfig.brand.icon}</div>
                    <div class="logo-text">${buildBrandText()}</div>
                </a>
                <button class="hamburger" id="menu-toggle" aria-label="Apri menu" aria-expanded="false">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                <nav class="main-nav" id="main-nav">
                    ${navItems}
                </nav>
            </div>
        </header>
        <div class="nav-overlay" id="nav-overlay"></div>
    `;

    if (!document.querySelector('style[data-menu-styles]')) {
        const styles = document.createElement('style');
        styles.setAttribute('data-menu-styles', 'true');
        styles.textContent = `
            .header {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                z-index: 1000;
                background: #0a0e14;
                border-bottom: 1px solid #30363d;
                backdrop-filter: blur(20px);
            }
            .header-content {
                max-width: 1600px;
                margin: 0 auto;
                padding: 0.9rem 2rem;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 2rem;
                height: 60px;
                box-sizing: border-box;
            }
            .logo {
                display: flex;
                align-items: center;
                gap: 1rem;
                text-decoration: none;
                flex-shrink: 0;
            }
            .logo-icon {
                width: 36px;
                height: 36px;
                border: 2px solid #00d9ff;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: 'JetBrains Mono', monospace;
                font-size: 0.85rem;
                color: #00d9ff;
                box-shadow: 0 0 30px #00d9ff15;
            }
            .logo-text {
                font-weight: 600;
                font-size: 1.1rem;
                letter-spacing: -0.02em;
                color: #e6edf3;
            }
            .logo-text span {
                color: #00d9ff;
            }
            .main-nav {
                display: flex;
                gap: 0.5rem;
            }
            .nav-btn {
                padding: 0.5rem 1rem;
                background: transparent;
                border: 1px solid transparent;
                color: #8b949e;
                font-family: 'Outfit', sans-serif;
                font-size: 0.85rem;
                font-weight: 500;
                cursor: pointer;
                border-radius: 6px;
                transition: all 0.2s ease;
                text-decoration: none;
                display: inline-block;
            }
            .nav-btn:hover {
                color: #e6edf3;
                background: #222c3a;
            }
            .nav-btn.active {
                color: #00d9ff;
                background: #00d9ff40;
                border-color: #00d9ff;
            }

            /* --- Hamburger button (nascosto su desktop) --- */
            .hamburger {
                display: none;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                gap: 5px;
                width: 40px;
                height: 40px;
                background: transparent;
                border: 1px solid #30363d;
                border-radius: 6px;
                cursor: pointer;
                padding: 8px;
                flex-shrink: 0;
                transition: border-color 0.2s ease;
            }
            .hamburger:hover {
                border-color: #00d9ff;
            }
            .hamburger span {
                display: block;
                width: 18px;
                height: 2px;
                background: #8b949e;
                border-radius: 2px;
                transition: all 0.25s ease;
                transform-origin: center;
            }
            .hamburger.open span:nth-child(1) {
                transform: translateY(7px) rotate(45deg);
                background: #00d9ff;
            }
            .hamburger.open span:nth-child(2) {
                opacity: 0;
                transform: scaleX(0);
            }
            .hamburger.open span:nth-child(3) {
                transform: translateY(-7px) rotate(-45deg);
                background: #00d9ff;
            }

            /* --- Overlay sfondo (mobile) --- */
            .nav-overlay {
                display: none;
                position: fixed;
                inset: 0;
                background: rgba(0,0,0,0.5);
                z-index: 999;
                backdrop-filter: blur(2px);
            }
            .nav-overlay.visible {
                display: block;
            }

            /* --- Mobile breakpoint --- */
            @media (max-width: 768px) {
                .hamburger {
                    display: flex;
                }
                .main-nav {
                    display: none;
                    position: fixed;
                    top: 60px;
                    left: 0;
                    right: 0;
                    z-index: 1000;
                    background: #0f1419;
                    border-bottom: 1px solid #30363d;
                    flex-direction: column;
                    gap: 0.25rem;
                    padding: 1rem;
                    box-shadow: 0 8px 30px rgba(0,0,0,0.4);
                }
                .main-nav.open {
                    display: flex;
                }
                .nav-btn {
                    padding: 0.85rem 1.25rem;
                    font-size: 1rem;
                    border-radius: 8px;
                    border: 1px solid transparent;
                }
                .nav-btn:hover,
                .nav-btn:active {
                    background: #222c3a;
                    color: #e6edf3;
                }
            }
        `;
        document.head.appendChild(styles);
    }

    // --- Toggle logic ---
    const toggle = document.getElementById('menu-toggle');
    const nav = document.getElementById('main-nav');
    const overlay = document.getElementById('nav-overlay');

    function openMenu() {
        nav.classList.add('open');
        toggle.classList.add('open');
        overlay.classList.add('visible');
        toggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        nav.classList.remove('open');
        toggle.classList.remove('open');
        overlay.classList.remove('visible');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    toggle.addEventListener('click', function() {
        nav.classList.contains('open') ? closeMenu() : openMenu();
    });

    // Chiudi cliccando sull'overlay
    overlay.addEventListener('click', closeMenu);

    // Chiudi dopo aver cliccato un link
    nav.querySelectorAll('.nav-btn').forEach(function(btn) {
        btn.addEventListener('click', closeMenu);
    });

    // Chiudi se si allarga la finestra oltre il breakpoint
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) closeMenu();
    });
})();
