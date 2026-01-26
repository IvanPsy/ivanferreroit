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
        icon: 'IF',  // Testo nel box logo
        text: 'Ivan Ferrero',
        highlight: 'Ivan',  // Parte evidenziata in cyan
        link: '/'
    },
    
    // Voci di navigazione
    // Aggiungere/rimuovere/modificare qui
    items: [
        { label: 'Home', href: '/' },
        { label: 'Dashboard', href: '/dashboards/' },
        { label: 'Risorse', href: '/risorse/' },
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

    // Determina la pagina corrente per evidenziare il link attivo
    const currentPath = window.location.pathname;
    
    function isActive(href) {
        if (href === '/') {
            return currentPath === '/' || currentPath === '/index.html';
        }
        return currentPath.startsWith(href);
    }

    // Costruisce il testo del brand con highlight
    function buildBrandText() {
        const { text, highlight } = menuConfig.brand;
        if (highlight && text.includes(highlight)) {
            return text.replace(highlight, `<span>${highlight}</span>`);
        }
        return text;
    }

    // Genera HTML del menu
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
                <nav class="main-nav">
                    ${navItems}
                </nav>
            </div>
        </header>
    `;

    // Aggiungi stili necessari se non già presenti
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
                padding: 1rem 2rem;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 2rem;
            }
            .logo {
                display: flex;
                align-items: center;
                gap: 1rem;
                text-decoration: none;
            }
            .logo-icon {
                width: 40px;
                height: 40px;
                border: 2px solid #00d9ff;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: 'JetBrains Mono', monospace;
                font-size: 0.9rem;
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
            @media (max-width: 768px) {
                .header-content {
                    flex-direction: column;
                    gap: 1rem;
                }
                .main-nav {
                    flex-wrap: wrap;
                    justify-content: center;
                }
            }
        `;
        document.head.appendChild(styles);
    }
})();
