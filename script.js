/* ============================================
   GYM FOR NORMAL PEOPLE — Interactivity
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- Mobile Menu Toggle ---
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  });

  // Close mobile menu on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // --- Smooth Scroll for all anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const navHeight = document.querySelector('.nav').offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

  // --- Scroll Reveal (IntersectionObserver) ---
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // --- Floating CTA (mobile) ---
  const floatingCta = document.getElementById('floatingCta');
  const heroSection = document.getElementById('hero');

  if (floatingCta && heroSection) {
    const floatingObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          floatingCta.classList.add('visible');
        } else {
          floatingCta.classList.remove('visible');
        }
      });
    }, { threshold: 0.1 });

    floatingObserver.observe(heroSection);
  }

  // --- Nav background on scroll ---
  const nav = document.querySelector('.nav');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 60) {
      nav.style.background = 'rgba(250,250,250,0.95)';
      nav.style.boxShadow = '0 1px 8px rgba(0,0,0,0.06)';
    } else {
      nav.style.background = 'rgba(250,250,250,0.85)';
      nav.style.boxShadow = 'none';
    }
    lastScroll = currentScroll;
  });

  // --- Contact Form (basic handler) ---
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const originalHTML = btn.innerHTML;

      btn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M20 6L9 17l-5-5"/></svg>
        Message Sent!
      `;
      btn.style.background = '#22c55e';
      btn.style.boxShadow = '0 4px 20px rgba(34,197,94,0.35)';

      // Redirect to Mad Libs consultation form after success animation
      setTimeout(() => {
        window.location.href = 'consultation.html';
      }, 2500);
    });
  }

  // --- Staggered reveal for cards ---
  const staggerContainers = document.querySelectorAll('.pain-grid, .steps-grid, .pricing-grid, .testimonials-grid');

  staggerContainers.forEach(container => {
    const cards = container.querySelectorAll('.reveal');
    cards.forEach((card, index) => {
      card.style.transitionDelay = `${index * 0.12}s`;
    });
  });

});
