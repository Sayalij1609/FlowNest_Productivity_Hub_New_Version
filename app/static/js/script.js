/* ========================================================================
   FlowNest — Interactive Scripts
   Flash dismiss, nav scroll, mobile toggle, password toggle
   ======================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ─── 3. AUTO-DISMISS FLASH ALERTS ────────────────────────────────
  const alerts = document.querySelectorAll('.alert');
  alerts.forEach(alert => {
    setTimeout(() => {
      dismissAlert(alert);
    }, 5000);
  });

  document.querySelectorAll('.alert-dismiss').forEach(btn => {
    btn.addEventListener('click', () => {
      dismissAlert(btn.closest('.alert'));
    });
  });

  function dismissAlert(el) {
    if (!el || el.classList.contains('fade-out')) return;
    el.classList.add('fade-out');
    el.addEventListener('animationend', () => el.remove());
  }


  // ─── 4. NAVBAR SCROLL SHADOW ──────────────────────────────────────
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });
  }


  // ─── 5. MOBILE NAV TOGGLE ────────────────────────────────────────
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }


  // ─── 6. PASSWORD VISIBILITY TOGGLE ───────────────────────────────
  document.querySelectorAll('.password-wrapper').forEach(wrapper => {
    const input = wrapper.querySelector('input');
    const toggle = wrapper.querySelector('.password-toggle');

    if (input && toggle) {
      toggle.addEventListener('click', () => {
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';

        // Swap SVG icon
        const eyeOpen = toggle.querySelector('.eye-open');
        const eyeClosed = toggle.querySelector('.eye-closed');
        if (eyeOpen && eyeClosed) {
          eyeOpen.style.display = isPassword ? 'none' : 'block';
          eyeClosed.style.display = isPassword ? 'block' : 'none';
        }
      });
    }
  });


  // ─── 7. THEME TOGGLE (Dark ↔ Light) ──────────────────────────────
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const html = document.documentElement;
      const currentTheme = html.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';

      html.setAttribute('data-theme', newTheme);
      localStorage.setItem('flownest-theme', newTheme);
    });
  }

});
