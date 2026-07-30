/* ==========================================================================
   D&R PNEUS - Script principal (JavaScript natif, sans dépendance)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ------------------------------------------------------------------ */
  /* Lien vers les avis Google — à modifier ici avant la mise en ligne. */
  /* Remplacer "#" par l'URL réelle de la fiche Google du garage.       */
  /* ------------------------------------------------------------------ */
  const GOOGLE_REVIEWS_URL = "#";

  const googleReviewsLink = document.getElementById('googleReviewsLink');
  if (googleReviewsLink) {
    googleReviewsLink.setAttribute('href', GOOGLE_REVIEWS_URL);
  }

  /* ------------------------------------------------------------------ */
  /* Année courante dans le pied de page                                */
  /* ------------------------------------------------------------------ */
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ------------------------------------------------------------------ */
  /* Menu mobile (ouverture / fermeture)                                */
  /* ------------------------------------------------------------------ */
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  function openMenu() {
    mobileNav.classList.add('is-open');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileNav.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', function () {
      const isOpen = mobileNav.classList.contains('is-open');
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Fermer le menu quand on clique sur un lien
    mobileLinks.forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    // Fermer le menu avec la touche Echap (accessibilité clavier)
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) {
        closeMenu();
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /* Slider "Réalisations" : défilement tactile, flèches, autoscroll    */
  /* ------------------------------------------------------------------ */
  const sliderTrack = document.getElementById('sliderTrack');
  const sliderPrev = document.getElementById('sliderPrev');
  const sliderNext = document.getElementById('sliderNext');

  if (sliderTrack) {
    // Distance de défilement par clic sur une flèche : largeur d'une carte + espace
    function getScrollStep() {
      const firstSlide = sliderTrack.querySelector('.slide-item');
      if (!firstSlide) return 300;
      const style = window.getComputedStyle(sliderTrack);
      const gap = parseInt(style.gap) || 18;
      return firstSlide.offsetWidth + gap;
    }

    if (sliderPrev) {
      sliderPrev.addEventListener('click', function () {
        sliderTrack.scrollBy({ left: -getScrollStep(), behavior: 'smooth' });
      });
    }

    if (sliderNext) {
      sliderNext.addEventListener('click', function () {
        sliderTrack.scrollBy({ left: getScrollStep(), behavior: 'smooth' });
      });
    }

    // Défilement automatique lent, qui s'arrête dès que l'utilisateur interagit
    let autoScrollInterval = null;
    let userInteracted = false;

    function startAutoScroll() {
      // Respect de la préférence "mouvement réduit"
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      autoScrollInterval = setInterval(function () {
        if (userInteracted) return;

        const maxScroll = sliderTrack.scrollWidth - sliderTrack.clientWidth;
        if (sliderTrack.scrollLeft >= maxScroll - 2) {
          // Revenir au début une fois la fin atteinte
          sliderTrack.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          sliderTrack.scrollBy({ left: 1, behavior: 'auto' });
        }
      }, 30);
    }

    function stopAutoScrollPermanently() {
      userInteracted = true;
      if (autoScrollInterval) {
        clearInterval(autoScrollInterval);
      }
    }

    // L'utilisateur interagit -> on arrête définitivement l'autoscroll
    ['pointerdown', 'wheel', 'touchstart'].forEach(function (evt) {
      sliderTrack.addEventListener(evt, stopAutoScrollPermanently, { passive: true });
    });
    if (sliderPrev) sliderPrev.addEventListener('click', stopAutoScrollPermanently);
    if (sliderNext) sliderNext.addEventListener('click', stopAutoScrollPermanently);

    startAutoScroll();
  }

});
