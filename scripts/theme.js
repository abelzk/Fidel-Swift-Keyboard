// const toggle = document.getElementById('toggle-theme');
//   const body = document.body;
//   if (localStorage.getItem('theme') === 'dark'){
//     body.classList.add('dark');

//   }
//   toggle.addEventListener('click', () =>{
//     body.classList.toggle('dark');
//     localStorage.setItem('theme', body.classList.contains('dark')? 'dark' : 'light');
//   });
  
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('toggle-theme');
  const body = document.body;

  if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark');
  }

  toggle.addEventListener('click', () => {
    body.classList.toggle('dark');
    localStorage.setItem('theme', body.classList.contains('dark') ? 'dark' : 'light');
  });
});
