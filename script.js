// Toggle dark mode and persist preference
function toggleDarkMode() {
  const isDark = document.body.classList.toggle('dark-mode');

  try {
    localStorage.setItem('prefers-dark', isDark ? '1' : '0');
  } catch (e) {
    // localStorage may be unavailable in some browser privacy modes.
  }
}

// Filter projects by category.
// Works with buttons that use data-filter="automation", "analog", "quality", "cad", or "all".
function filterProjects(category) {
  const cards = document.querySelectorAll('.project-card');
  let visibleCount = 0;

  cards.forEach(card => {
    const show = category === 'all' || card.classList.contains(category);

    card.style.display = show ? '' : 'none';
    card.setAttribute('aria-hidden', show ? 'false' : 'true');

    if (show) {
      visibleCount += 1;
    }
  });

  const noResults = document.querySelector('.no-results');

  if (noResults) {
    noResults.hidden = visibleCount !== 0;
  }

  const buttons = document.querySelectorAll('[data-filter]');

  buttons.forEach(button => {
    button.classList.toggle('active', button.getAttribute('data-filter') === category);
  });
}

// Restore dark mode preference and activate project filter buttons.
document.addEventListener('DOMContentLoaded', () => {
  try {
    const pref = localStorage.getItem('prefers-dark');

    if (pref === '1') {
      document.body.classList.add('dark-mode');
    }
  } catch (e) {
    // Ignore localStorage errors.
  }

  const filters = document.querySelectorAll('[data-filter]');

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-filter') || 'all';

      filterProjects(category);

      const projectsSection = document.querySelector('#projects');

      if (projectsSection) {
        projectsSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });

    // Keyboard accessibility for Enter and Space.
    btn.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        btn.click();
      }
    });
  });
});

// Optional helper for future resume-download analytics or accessibility actions.
document.addEventListener('click', event => {
  const target = event.target;

  if (target && target.matches && target.matches('.resume-button')) {
    // Placeholder for future actions.
  }
});

// Play and loop project video demos while hovered or focused
document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.project-card');

  cards.forEach(card => {
    const videos = Array.from(card.querySelectorAll('video'));

    if (videos.length === 0) return;

    videos.forEach(video => {
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
    });

    const start = () => {
      videos.forEach(video => {
        try {
          video.currentTime = 0;
          void video.play();
        } catch (e) {
          // ignore play errors
        }
      });
    };

    const stop = () => {
      videos.forEach(video => {
        try {
          video.pause();
          video.currentTime = 0;
        } catch (e) {
          // ignore pause errors
        }
      });
    };

    card.addEventListener('mouseenter', start);
    card.addEventListener('mouseleave', stop);
    card.addEventListener('focusin', start);
    card.addEventListener('focusout', stop);
  });
});

