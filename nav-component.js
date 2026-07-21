/**
 * nav-component.js — HB Mouy
 * Navigation centralisée. Pour ajouter une page ou un lien,
 * modifie uniquement ce fichier.
 */

const HBM_NAV = {
  logo: {
    src: "images/logo.png",
    alt: "HBM Logo",
    href: "index.html"
  },
  left: [
    { label: "Accueil", url: "index.html" },
    { label: "Actualités", url: "actualites.html" },
    {
      label: "Saison",
      dropdown: [
        { label: "Planning", url: "planning.html" },
        { label: "Effectifs", url: "effectifs.html" },
        { label: "Prépa Physique", url: "prepa-physique.html" },
        { label: "Le Jeu 🎮", url: "jeu.html" }
      ]
    }
  ],
  right: [
    {
      label: "Le Club",
      dropdown: [
        { label: "Qui sommes-nous ?", url: "qui.html" },
        { label: "Le Bureau", url: "organigramme.html" },
        { label: "Documents utiles", url: "docs.html" }
      ]
    },
    { label: "Inscriptions", url: "inscriptions.html" },
    { label: "Partenaires", url: "partenaires.html" },
    {
      label: "Espace Membre",
      dropdown: [
        { label: "Connexion", url: "connexion.html" },
        { label: "Mon Profil", url: "espace-membre.html" }
      ]
    },
    { label: "Contact", url: "index.html#contact" }
  ]
};

/**
 * Détecte la page active en comparant l'URL courante
 */
function isActive(url) {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  const anchor  = window.location.hash;
  if (url.includes('#')) return url === current + anchor;
  return url === current || (current === '' && url === 'index.html');
}

/**
 * Génère un lien <li>
 */
function buildLink(item) {
  const active = isActive(item.url) ? ' class="active" style="color:var(--jersey-purple)"' : '';
  return `<li><a href="${item.url}"${active}>${item.label}</a></li>`;
}

/**
 * Génère un dropdown <li>
 */
function buildDropdown(item) {
  const hasActive = item.dropdown.some(d => isActive(d.url));
  const triggerStyle = hasActive ? ' style="color:var(--jersey-purple)"' : '';
  const links = item.dropdown.map(d => `<li><a href="${d.url}">${d.label}</a></li>`).join('');
  return `
    <li class="dropdown">
      <a class="dropdown-trigger"${triggerStyle}>${item.label} ▾</a>
      <ul class="dropdown-content">${links}</ul>
    </li>`;
}

/**
 * Génère un groupe de liens (left ou right)
 */
function buildGroup(items) {
  return items.map(item => item.dropdown ? buildDropdown(item) : buildLink(item)).join('');
}

/**
 * Génère le HTML complet de la nav
 */
function buildNav() {
  return `
  <nav>
    <div class="nav-container">

      <ul class="nav-group left" id="nav-left">
        <li>
          <button class="theme-toggle-btn" id="theme-toggle" aria-label="Changer de thème">
            <svg class="moon-icon" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            <svg class="sun-icon" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          </button>
        </li>
        ${buildGroup(HBM_NAV.left)}
      </ul>

      <a href="${HBM_NAV.logo.href}" class="nav-logo" id="logo-trigger">
        <img src="${HBM_NAV.logo.src}" alt="${HBM_NAV.logo.alt}">
      </a>

      <button class="burger" id="burger" aria-label="Ouvrir le menu">
        <span></span><span></span><span></span>
      </button>

      <ul class="nav-group right">
        ${buildGroup(HBM_NAV.right)}
      </ul>

    </div>
  </nav>`;
}

/**
 * Initialise la nav et tous ses comportements
 */
function initNav() {
  // Injection de la nav
  const placeholder = document.getElementById('hbm-nav');
  if (placeholder) {
    placeholder.outerHTML = buildNav();
  } else {
    document.body.insertAdjacentHTML('afterbegin', buildNav());
  }

  // Thème
  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      if (isDark) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
      }
    });
  }

  // Menu burger mobile
  const burger   = document.getElementById('burger');
  const navLeft  = document.getElementById('nav-left');
  if (burger && navLeft) {

    // Copier les liens right dans le menu mobile
    if (window.innerWidth <= 950) {
      document.querySelectorAll('.nav-group.right li').forEach(li => {
        navLeft.appendChild(li.cloneNode(true));
      });
    }

    burger.addEventListener('click', () => {
      navLeft.classList.toggle('active');
      burger.classList.toggle('toggle');
    });

    // Fermer le menu sur clic d'un lien normal
    document.querySelectorAll('.nav-group.left a:not(.dropdown-trigger)').forEach(link => {
      link.addEventListener('click', () => {
        navLeft.classList.remove('active');
        burger.classList.remove('toggle');
      });
    });
  }

  // Dropdowns mobile
  document.querySelectorAll('.dropdown').forEach(dropdown => {
    const trigger = dropdown.querySelector('.dropdown-trigger');
    if (trigger) {
      trigger.addEventListener('click', e => {
        if (window.innerWidth <= 950) {
          e.preventDefault();
          dropdown.classList.toggle('active');
        }
      });
    }
  });
}

// Lancement dès que le DOM est prêt
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNav);
} else {
  initNav();
}
