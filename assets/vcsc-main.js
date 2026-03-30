/* ============================================================
   VIBE CODER SUPPLY CO. — Main JS
   Pure vanilla. No frameworks. Much like your code review process.
   ============================================================ */

(function () {
  'use strict';

  /* ── Mobile nav ─────────────────────────────────────────── */
  var hamburger = document.getElementById('hamburger-btn');
  var mobileNav = document.getElementById('mobile-nav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function () {
      var isOpen = mobileNav.classList.toggle('is-open');
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close nav on link click
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileNav.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ── Header scroll state ────────────────────────────────── */
  var header = document.querySelector('.vcsc-header');
  if (header) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 20) {
        header.style.boxShadow = '0 2px 20px rgba(9,12,20,0.08)';
      } else {
        header.style.boxShadow = 'none';
      }
    }, { passive: true });
  }

  /* ── Reviews carousel ───────────────────────────────────── */
  var track       = document.getElementById('reviews-track');
  var prevBtn     = document.getElementById('reviews-prev');
  var nextBtn     = document.getElementById('reviews-next');
  var dotsWrap    = document.getElementById('reviews-dots');

  if (track && prevBtn && nextBtn && dotsWrap) {
    var cards     = track.querySelectorAll('.vcsc-review-card');
    var cardCount = cards.length;
    var current   = 0;

    // Build dots
    for (var i = 0; i < cardCount; i++) {
      var dot = document.createElement('button');
      dot.className = 'vcsc-reviews__dot' + (i === 0 ? ' is-active' : '');
      dot.setAttribute('aria-label', 'Go to review ' + (i + 1));
      (function (idx) {
        dot.addEventListener('click', function () { goTo(idx); });
      })(i);
      dotsWrap.appendChild(dot);
    }

    function getCardWidth() {
      if (!cards[0]) return 340;
      var style = window.getComputedStyle(cards[0]);
      return cards[0].offsetWidth + parseInt(style.marginRight || 0) + 20; // 20 = gap
    }

    function goTo(idx) {
      current = Math.max(0, Math.min(idx, cardCount - 1));
      var offset = current * getCardWidth();
      track.parentElement.scrollTo({ left: offset, behavior: 'smooth' });
      dotsWrap.querySelectorAll('.vcsc-reviews__dot').forEach(function (d, di) {
        d.classList.toggle('is-active', di === current);
      });
    }

    prevBtn.addEventListener('click', function () { goTo(current - 1); });
    nextBtn.addEventListener('click', function () { goTo(current + 1); });

    // Sync dots on scroll
    track.parentElement.addEventListener('scroll', function () {
      var scrollLeft = track.parentElement.scrollLeft;
      var cw = getCardWidth();
      var idx = Math.round(scrollLeft / cw);
      if (idx !== current) {
        current = idx;
        dotsWrap.querySelectorAll('.vcsc-reviews__dot').forEach(function (d, di) {
          d.classList.toggle('is-active', di === current);
        });
      }
    }, { passive: true });
  }

  /* ── Smooth anchor scroll ───────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var headerH = header ? header.offsetHeight : 64;
        var top = target.getBoundingClientRect().top + window.pageYOffset - headerH - 16;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ── Intersection observer — fade-in on scroll ──────────── */
  if ('IntersectionObserver' in window) {
    var style = document.createElement('style');
    style.textContent = [
      '.vcsc-fade-in { opacity: 0; transform: translateY(20px); transition: opacity 0.55s ease, transform 0.55s ease; }',
      '.vcsc-fade-in.is-visible { opacity: 1; transform: none; }'
    ].join('');
    document.head.appendChild(style);

    var fadeTargets = [
      '.vcsc-review-card',
      '.vcsc-specs',
      '.vcsc-bom',
      '.vcsc-founder__inner',
      '.vcsc-warranty__card',
      '.vcsc-press__logo-item',
    ];
    document.querySelectorAll(fadeTargets.join(',')).forEach(function (el) {
      el.classList.add('vcsc-fade-in');
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.vcsc-fade-in').forEach(function (el) {
      observer.observe(el);
    });
  }

})();
