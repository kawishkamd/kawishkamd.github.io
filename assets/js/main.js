const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-up').forEach(el => fadeObserver.observe(el));

  // Enable smooth scroll after initial load/render to prevent jumpiness on reload
  if (!REDUCED_MOTION) {
    setTimeout(() => {
      document.documentElement.style.scrollBehavior = 'smooth';
    }, 250);
  }

  // Helper to check if a link points to the same page with a hash
  function isAnchorLinkToCurrentPage(a) {
    try {
      const url = new URL(a.href, window.location.href);
      return url.origin === window.location.origin &&
             url.pathname === window.location.pathname &&
             url.search === window.location.search &&
             url.hash !== "";
    } catch (e) {
      return false;
    }
  }

  // Page exit transition — fade out before navigating to another page
  document.querySelectorAll('a').forEach(a => {
    const href = a.getAttribute('href');
    if (!href) return;
    // Skip: anchor links, javascript:, mailto:, tel:, target="_blank", and same-page hash
    if (
      href.startsWith('#') ||
      href.startsWith('javascript') ||
      href.startsWith('mailto') ||
      href.startsWith('tel') ||
      a.target === '_blank' ||
      isAnchorLinkToCurrentPage(a)
    ) return;

    a.addEventListener('click', e => {
      // Respect modified clicks (open in new tab/window) and non-left clicks
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      e.preventDefault();
      if (REDUCED_MOTION) {
        window.location.href = a.href;
        return;
      }
      document.body.classList.add('page-exit');
      const targetUrl = a.href; // Use resolved absolute URL
      setTimeout(() => { window.location.href = targetUrl; }, 260);
    });
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a').forEach(a => {
    const href = a.getAttribute('href');
    if (!href) return;

    if (href.startsWith('#') || isAnchorLinkToCurrentPage(a)) {
      a.addEventListener('click', e => {
        try {
          const url = new URL(a.href, window.location.href);
          const target = document.querySelector(url.hash);
          if (target) {
            e.preventDefault();
            const headerOffset = 0; // Scroll section all the way to the top of the viewport
            const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - headerOffset;

            window.scrollTo({
              top: offsetPosition,
              behavior: REDUCED_MOTION ? 'auto' : 'smooth'
            });
            // Update URL hash without a page reload
            history.pushState(null, null, url.hash);
          }
        } catch (err) {
          // Fallback if URL/selector fails
        }
      });
    }
  });

  // Handle offset scroll on initial page load if hash exists
  const initialHash = window.location.hash;
  if (initialHash) {
    setTimeout(() => {
      try {
        const target = document.querySelector(initialHash);
        if (target) {
          const headerOffset = 0;
          const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementPosition - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'auto'
          });
        }
      } catch (err) {
        // Fallback
      }
    }, 150);
  }

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const formStatus = document.getElementById('form-status');

    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();

      const sendBtn = document.getElementById('sendBtn');
      const originalText = sendBtn.textContent;

      sendBtn.textContent = 'Sending...';
      if (formStatus) formStatus.textContent = 'Sending...';
      sendBtn.disabled = true;

      const formData = new FormData(this);

      try {
        const response = await fetch(this.action, {
          method: "POST",
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          this.reset();
          sendBtn.textContent = 'Message Sent ✓';
          if (formStatus) formStatus.textContent = 'Message sent! I will get back to you soon.';
        } else {
          sendBtn.textContent = 'Error! Try again.';
          if (formStatus) formStatus.textContent = 'Something went wrong. Please try again.';
        }
      } catch (error) {
        sendBtn.textContent = 'Error! Try again.';
        if (formStatus) formStatus.textContent = 'Something went wrong. Please try again.';
      }

      setTimeout(() => {
        sendBtn.textContent = originalText;
        sendBtn.disabled = false;
        if (formStatus) formStatus.textContent = '';
      }, 3000);
    });
  }

  // Mobile Navigation Logic
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const topNavLinks = document.querySelectorAll('.nav-links a');
  const trackedSectionIds = ['about', 'skills', 'projects', 'qualification', 'shortcuts', 'contact'];
  const trackedSections = trackedSectionIds
    .map(id => ({ id, element: document.getElementById(id) }))
    .filter(section => section.element);
  let ticking = false;

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', function() {
      mobileNavLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // IntersectionObserver for extremely fast, zero-reflow scroll tracking
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px', // Triggers when section is comfortably in the top half of viewport
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Read scroll position BEFORE writing classes (avoids forced reflow)
        const scrollY = window.scrollY;
        const current = entry.target.id;
        
        // Map 'shortcuts' to 'qualification' (Journey) for mobile menu only
        const mobileCurrent = current === 'shortcuts' ? 'qualification' : current;
        const activeLink = document.querySelector(`.mobile-nav-link[data-target="${mobileCurrent}"]`);
        if (activeLink && !activeLink.classList.contains('active')) {
          mobileNavLinks.forEach(l => l.classList.remove('active'));
          activeLink.classList.add('active');
        }

        const topActiveLink = document.querySelector(`.nav-links a[href="#${current}"]`);
        if (topActiveLink && !topActiveLink.classList.contains('active')) {
          topNavLinks.forEach(l => l.classList.remove('active'));
          topActiveLink.classList.add('active');
        }

        // Update URL hash dynamically on scroll without page jump
        if (scrollY < 300) {
          if (window.location.hash) {
            history.replaceState(null, null, window.location.pathname + window.location.search);
          }
        } else {
          if (window.location.hash !== '#' + current) {
            history.replaceState(null, null, '#' + current);
          }
        }
      }
    });
  }, observerOptions);

  trackedSections.forEach(({ element }) => {
    navObserver.observe(element);
  });

  let lastScrollY = window.scrollY;
  const topHeader = document.querySelector('nav:not(.mobile-nav)');

  function handleScroll() {
    if (ticking) return;
    ticking = true;

    // Capture scroll position at event time, before the rAF callback
    // writes classes (read-after-write inside the frame forces reflow)
    const scrollY = window.scrollY;

    window.requestAnimationFrame(() => {
      if (topHeader) {
        if (scrollY <= 50) {
          topHeader.classList.remove('nav-hidden');
        } else if (scrollY > lastScrollY) {
          topHeader.classList.add('nav-hidden');
        } else if (scrollY < lastScrollY) {
          topHeader.classList.remove('nav-hidden');
        }
      }
      lastScrollY = scrollY;
      ticking = false;
    });
  }

  window.addEventListener('scroll', handleScroll, { passive: true });

  // Theme Toggle Button Logic
  const themeToggle = document.getElementById('theme-toggle');

  // Keep <meta name="theme-color"> in sync with the resolved theme,
  // not just the OS-level preference (fixes stale mobile browser chrome on manual toggle)
  function syncThemeColor() {
    const isDark = document.documentElement.classList.contains('dark-mode');
    document.querySelectorAll('meta[name="theme-color"]').forEach(meta => {
      meta.setAttribute('content', isDark ? '#09090b' : '#ffffff');
    });
  }
  syncThemeColor();

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.documentElement.classList.toggle('dark-mode');
      const isDark = document.documentElement.classList.contains('dark-mode');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      syncThemeColor();
    });
  }

  // Helper to copy shortcut commands to clipboard
  window.copyShortcutText = function(elementId, btnElement) {
    const text = document.getElementById(elementId).textContent;
    navigator.clipboard.writeText(text).then(() => {
      const copyIcon = btnElement.querySelector('.copy-icon');
      const checkIcon = btnElement.querySelector('.check-icon');
      if (copyIcon && checkIcon) {
        copyIcon.style.display = 'none';
        checkIcon.style.display = 'inline-flex';
        btnElement.classList.add('copied');
        setTimeout(() => {
          copyIcon.style.display = 'inline-flex';
          checkIcon.style.display = 'none';
          btnElement.classList.remove('copied');
        }, 2000);
      }
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };



  // Handle iOS/bfcache back-button loading issue
  window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
      document.body.classList.remove('page-exit');
    }
  });
