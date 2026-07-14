window.observer = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-up').forEach(el => window.observer.observe(el));

  // Enable smooth scroll after initial load/render to prevent jumpiness on reload
  setTimeout(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
  }, 250);

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
      e.preventDefault();
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
              behavior: 'smooth'
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
    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();

      const sendBtn = document.getElementById('sendBtn');
      const originalText = sendBtn.textContent;

      sendBtn.textContent = 'Sending...';
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
        } else {
          sendBtn.textContent = 'Error! Try again.';
        }
      } catch (error) {
        sendBtn.textContent = 'Error! Try again.';
      }

      setTimeout(() => {
        sendBtn.textContent = originalText;
        sendBtn.disabled = false;
      }, 3000);
    });
  }

  const tabs = document.querySelectorAll('.qualification-btn[data-target]'),
        tabContents = document.querySelectorAll('.qualification-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = document.querySelector(tab.dataset.target);

      tabContents.forEach(tc => tc.classList.remove('active'));
      target.classList.add('active');

      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });

  // Mobile Navigation Logic
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const indicator = document.querySelector('.mobile-nav-indicator');
  const navList = document.querySelector('.mobile-nav-list');
  const topNavLinks = document.querySelectorAll('.nav-links a');
  const trackedSectionIds = ['about', 'skills', 'projects', 'qualification', 'shortcuts', 'contact'];
  const trackedSections = trackedSectionIds
    .map(id => ({ id, element: document.getElementById(id) }))
    .filter(section => section.element);
  let ticking = false;

  function updateIndicator(activeLink) {
    if (!activeLink || !indicator || !navList) return;
    const linkRect = activeLink.getBoundingClientRect();
    const navRect = navList.getBoundingClientRect();
    const offset = linkRect.left - navRect.left + (linkRect.width / 2) - 25;
    indicator.style.transform = `translateX(${offset}px)`;
  }

  setTimeout(() => {
    const defaultActive = document.querySelector('.mobile-nav-link.active');
    if (defaultActive) updateIndicator(defaultActive);
  }, 100);

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', function() {
      mobileNavLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
      updateIndicator(this);
    });
  });

  function syncActiveNavState() {
    let current = '';
    const scrollY = window.scrollY;

    trackedSections.forEach(({ id, element }) => {
      const sectionTop = element.offsetTop - 150;
      const sectionHeight = element.offsetHeight;
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        current = id;
      }
    });

    // Default to 'about' if near the top of the page (Hero section)
    if (!current && scrollY < 300) {
      current = 'about';
    }

    if (current) {
      // Map 'shortcuts' to 'qualification' (Journey) for mobile menu only
      const mobileCurrent = current === 'shortcuts' ? 'qualification' : current;
      const activeLink = document.querySelector(`.mobile-nav-link[data-target="${mobileCurrent}"]`);
      if (activeLink && !activeLink.classList.contains('active')) {
        mobileNavLinks.forEach(l => l.classList.remove('active'));
        activeLink.classList.add('active');
        updateIndicator(activeLink);
      }

      const topActiveLink = document.querySelector(`.nav-links a[href="#${current}"]`);
      if (topActiveLink && !topActiveLink.classList.contains('active')) {
        topNavLinks.forEach(l => l.classList.remove('active'));
        topActiveLink.classList.add('active');
      }

      // Update URL hash dynamically on scroll without page jump
      if (scrollY < 300) {
        // At the top/Hero section: clear the hash
        if (window.location.hash) {
          history.replaceState(null, null, window.location.pathname + window.location.search);
        }
      } else {
        // Inside a section: update hash to match current section
        if (window.location.hash !== '#' + current) {
          history.replaceState(null, null, '#' + current);
        }
      }
    }
  }

  let lastScrollY = window.scrollY;
  const topHeader = document.querySelector('nav:not(.mobile-nav)');

  function handleScroll() {
    if (ticking) return;
    ticking = true;

    window.requestAnimationFrame(() => {
      syncActiveNavState();

      const scrollY = window.scrollY;
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

  window.addEventListener('resize', () => {
    syncActiveNavState();
    const activeLink = document.querySelector('.mobile-nav-link.active');
    if (activeLink) updateIndicator(activeLink);
  });

  syncActiveNavState();

  // Theme Toggle Button Logic
  const themeToggle = document.getElementById('theme-toggle');
  const themeToggleIcon = document.getElementById('theme-toggle-icon');

  // Initialize icon state on load based on class presence
  if (themeToggleIcon) {
    if (document.documentElement.classList.contains('dark-mode')) {
      themeToggleIcon.className = 'bx bx-sun';
    } else {
      themeToggleIcon.className = 'bx bx-moon';
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.documentElement.classList.add('theme-transition');
      
      // Use requestAnimationFrame to ensure the transition class is fully applied before toggling
      requestAnimationFrame(() => {
        document.documentElement.classList.toggle('dark-mode');
        const isDark = document.documentElement.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        
        if (themeToggleIcon) {
          if (isDark) {
            themeToggleIcon.className = 'bx bx-sun';
          } else {
            themeToggleIcon.className = 'bx bx-moon';
          }
        }

        setTimeout(() => {
          document.documentElement.classList.remove('theme-transition');
        }, 300);
      });
    });
  }

  // Helper to copy shortcut commands to clipboard
  window.copyShortcutText = function(elementId, btnElement) {
    const text = document.getElementById(elementId).textContent;
    navigator.clipboard.writeText(text).then(() => {
      const icon = btnElement.querySelector('i');
      if (icon) {
        icon.className = 'bx bx-check';
        btnElement.classList.add('copied');
        setTimeout(() => {
          icon.className = 'bx bx-copy';
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
