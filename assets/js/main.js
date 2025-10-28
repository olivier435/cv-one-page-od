(function() {
  "use strict";

  /** Header toggle **/
  const headerToggleBtn = document.querySelector('.header-toggle');
  function headerToggle() {
    document.querySelector('#header').classList.toggle('header-show');
    headerToggleBtn.classList.toggle('bi-list');
    headerToggleBtn.classList.toggle('bi-x');
  }
  headerToggleBtn && headerToggleBtn.addEventListener('click', headerToggle);

  /** Hide mobile nav **/
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.header-show')) headerToggle();
    });
  });

  /** Dropdowns **/
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /** Preloader **/
  const preloader = document.querySelector('#preloader');
  if (preloader) window.addEventListener('load', () => preloader.remove());

  /** Scroll top **/
  const scrollTop = document.querySelector('.scroll-top');
  function toggleScrollTop() {
    if (scrollTop) window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
  }
  scrollTop && scrollTop.addEventListener('click', e => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /** AOS init **/
  function aosInit() {
    if (typeof AOS !== 'undefined') {
      AOS.init({ duration: 600, easing: 'ease-in-out', once: true, mirror: false });
    }
  }
  window.addEventListener('load', aosInit);

  /** Typed.js **/
  const selectTyped = document.querySelector('.typed');
  if (selectTyped && typeof Typed !== 'undefined') {
    let strings = selectTyped.getAttribute('data-typed-items').split(',');
    new Typed('.typed', { strings, loop: true, typeSpeed: 100, backSpeed: 50, backDelay: 2000 });
  }

  /** PureCounter **/
  if (typeof PureCounter !== 'undefined') new PureCounter();

  /** Skills progress **/
  let skillsAnimation = document.querySelectorAll('.skills-animation');
  skillsAnimation.forEach(item => {
    if (typeof Waypoint !== 'undefined') {
      new Waypoint({
        element: item,
        offset: '80%',
        handler: function() {
          item.querySelectorAll('.progress .progress-bar').forEach(el => {
            el.style.width = el.getAttribute('aria-valuenow') + '%';
          });
        }
      });
    }
  });

  /** Glightbox **/
  if (typeof GLightbox !== 'undefined') GLightbox({ selector: '.glightbox' });

  /** Isotope **/
  document.querySelectorAll('.isotope-layout').forEach(isotopeItem => {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';
    let initIsotope;
    if (typeof imagesLoaded !== 'undefined' && typeof Isotope !== 'undefined') {
      imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
        initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
          itemSelector: '.isotope-item',
          layoutMode: layout,
          filter,
          sortBy: sort
        });
      });
    }
    isotopeItem.querySelectorAll('.isotope-filters li').forEach(filterEl => {
      filterEl.addEventListener('click', function() {
        const active = isotopeItem.querySelector('.filter-active');
        active && active.classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope && initIsotope.arrange({ filter: this.getAttribute('data-filter') });
        aosInit();
      });
    });
  });

  /** Swiper **/
  function initSwiper() {
    if (typeof Swiper === 'undefined') return;
    document.querySelectorAll(".init-swiper").forEach(swiperElement => {
      let config = JSON.parse(swiperElement.querySelector(".swiper-config").innerHTML.trim());
      new Swiper(swiperElement, config);
    });
  }
  window.addEventListener("load", initSwiper);

  /** Scroll correction for hash **/
  window.addEventListener('load', function() {
    if (window.location.hash && document.querySelector(window.location.hash)) {
      setTimeout(() => {
        let section = document.querySelector(window.location.hash);
        let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
        window.scrollTo({ top: section.offsetTop - parseInt(scrollMarginTop), behavior: 'smooth' });
      }, 100);
    }
  });

  /** Scrollspy **/
  let navmenulinks = document.querySelectorAll('.navmenu a');
  function navmenuScrollspy() {
    navmenulinks.forEach(link => {
      if (!link.hash) return;
      let section = document.querySelector(link.hash);
      if (!section) return;
      let pos = window.scrollY + 200;
      if (pos >= section.offsetTop && pos <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      } else link.classList.remove('active');
    });
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

  /** ===== Formulaire de contact : UX ===== **/
  (function() {
    const form = document.querySelector('form.php-email-form');
    if (!form) return;

    const loadingEl = form.querySelector('.loading');
    const errorEl   = form.querySelector('.error-message');
    const sentEl    = form.querySelector('.sent-message');

    const show = el => el && (el.style.display = 'block');
    const hide = el => el && (el.style.display = 'none');
    const resetUI = () => { hide(loadingEl); hide(errorEl); hide(sentEl); };

    // crée / récupère un conteneur d'erreur sous le champ
    function getErrorBox(field) {
      let box = field.parentElement.querySelector('.invalid-feedback');
      if (!box) {
        box = document.createElement('small');
        box.className = 'invalid-feedback';
        field.parentElement.appendChild(box);
      }
      return box;
    }

    function setFieldError(field, msg) {
      field.classList.remove('is-valid');
      field.classList.add('is-invalid');
      field.setAttribute('aria-invalid', 'true');
      field.setCustomValidity(msg);
      getErrorBox(field).textContent = msg;
    }

    function clearFieldError(field) {
      field.classList.remove('is-invalid');
      field.classList.add('is-valid');
      field.removeAttribute('aria-invalid');
      field.setCustomValidity('');
      const box = field.parentElement.querySelector('.invalid-feedback');
      if (box) box.textContent = '';
    }

    function validate() {
      const name    = form.querySelector('input[name="name"]');
      const email   = form.querySelector('input[name="email"]');
      const subject = form.querySelector('input[name="subject"]');
      const message = form.querySelector('textarea[name="message"]');

      let ok = true;
      [name, email, subject, message].forEach(clearFieldError);

      if (!name.value || name.value.trim().length < 2) {
        setFieldError(name, '2 caractères minimum.');
        ok = false;
      }
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(email.value)) {
        setFieldError(email, 'Adresse e-mail invalide.');
        ok = false;
      }
      if (!subject.value || subject.value.trim().length < 3) {
        setFieldError(subject, '3 caractères minimum.');
        ok = false;
      }
      if (!message.value || message.value.trim().length < 10) {
        setFieldError(message, '10 caractères minimum.');
        ok = false;
      }
      return ok;
    }

    // Compteur live pour le message
    (function attachCounter() {
      const message = form.querySelector('textarea[name="message"]');
      if (!message) return;
      const min = parseInt(message.getAttribute('minlength') || '10', 10);
      let counter = message.parentElement.querySelector('.char-counter');
      if (!counter) {
        counter = document.createElement('small');
        counter.className = 'char-counter text-muted';
        message.parentElement.appendChild(counter);
      }
      const update = () => {
        const len = message.value.length;
        const remain = Math.max(0, min - len);
        counter.textContent = remain > 0
          ? `Encore ${remain} caractère(s) requis…`
          : `${len} caractère(s) saisis`;
      };
      message.addEventListener('input', update);
      update();
    })();

    form.addEventListener('submit', async e => {
      e.preventDefault();
      resetUI();

      if (!validate()) {
        errorEl.textContent = 'Merci de corriger les champs en rouge.';
        show(errorEl);
        return;
      }

      show(loadingEl);
      try {
        const res = await fetch(form.getAttribute('action') || 'forms/contact.php', {
          method: 'POST',
          headers: { 'X-Requested-With': 'XMLHttpRequest' },
          body: new FormData(form)
        });
        const data = await res.json().catch(() => ({}));
        hide(loadingEl);

        if (!data.ok) {
          // Remplir les erreurs champ par champ reçues du serveur
          if (data.fields) {
            Object.entries(data.fields).forEach(([key, msg]) => {
              const field = form.querySelector(`[name="${key}"]`);
              if (field) setFieldError(field, msg);
            });
          }
          errorEl.textContent = data.error || 'Merci de corriger les champs.';
          show(errorEl);
          return;
        }

        show(sentEl);
        form.reset();
        // Nettoyer les états visuels après reset
        form.querySelectorAll('.is-valid,.is-invalid').forEach(el => el.classList.remove('is-valid', 'is-invalid'));
      } catch (err) {
        hide(loadingEl);
        errorEl.textContent = 'Impossible de contacter le serveur. Réessayez.';
        show(errorEl);
      }
    });
  })();

})();
