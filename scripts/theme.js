document.addEventListener('DOMContentLoaded', () => {
  const icon = document.getElementById('theme-icon');
  const toggle = document.getElementById('toggle-theme');
  const root = document.documentElement;

  // Load saved theme
  if (localStorage.getItem('theme') === 'dark') {
    root.classList.add('dark');
    if (icon) icon.src = 'images/toggle-dark.svg';
  }

  toggle?.addEventListener('click', () => {
    const isDark = root.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');

    if (icon) {
      icon.src = isDark ? 'images/toggle-dark.svg' : 'images/toggle.svg';
    }
  });
});
