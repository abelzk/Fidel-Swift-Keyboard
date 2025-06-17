// const toggle = document.getElementById('toggle-theme');
//   const body = document.body;
//   if (localStorage.getItem('theme') === 'dark'){
//     body.classList.add('dark');

//   }
//   toggle.addEventListener('click', () =>{
//     body.classList.toggle('dark');
//     localStorage.setItem('theme', body.classList.contains('dark')? 'dark' : 'light');
//   });


  
// document.addEventListener('DOMContentLoaded', () => {
//   const icon = document.getElementById('theme-icon');
//   const toggle = document.getElementById('toggle-theme');
//   const body = document.body;

//   if (localStorage.getItem('theme') === 'dark') {
//     body.classList.add('dark');
//     icon.src = 'images/toggle-dark.svg'
//   }

//   toggle.addEventListener('click', () => {
//     // document.documentElement.classList.toggle('dark');
//     state = body.classList.toggle('dark');
//   const newTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
//   localStorage.setItem('theme', newTheme);
//     icon.src = newTheme === 'dark' ? 'images/toggle-dark.svg' : 'images/toggle.svg';
//   });
// });

document.addEventListener('DOMContentLoaded', () => {
  const icon = document.getElementById('theme-icon');
  const toggle = document.getElementById('toggle-theme');
  const root = document.documentElement;

  // Apply theme from saved preference
  if (localStorage.getItem('theme') === 'dark') {
    root.classList.add('dark');
    if (icon) icon.src = 'images/toggle-dark.svg';
  }

  toggle?.addEventListener('click', () => {
    const isDark = root.classList.toggle('dark');
    const newTheme = isDark ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);

    if (icon) {
      icon.src = isDark ? 'images/toggle-dark.svg' : 'images/toggle.svg';
    }
  });
});
