export function setTheme(themeName) {
  localStorage.setItem('theme', themeName);
  document.documentElement.className = themeName;
}

export function keepTheme() {
  if (localStorage.getItem('theme')) {
    if (localStorage.getItem('theme') === 'theme-dark') {
      setTheme('theme-dark');
    } else if (localStorage.getItem('theme') === 'theme-light') {
      setTheme('theme-light');
    }
  } else {
    // Default to light theme
    setTheme('theme-light');
  }
}

export function getTheme() {
  return localStorage.getItem('theme') || 'theme-light';
}
