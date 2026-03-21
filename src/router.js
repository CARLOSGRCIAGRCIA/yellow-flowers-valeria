import { HomePage } from './pages/Home.js';
import { AboutPage } from './pages/About.js';
import { MusicPage } from './pages/Music.js';

const routes = {
  home: HomePage,
  about: AboutPage,
  music: MusicPage,
};

let currentPage = null;

export function initRouter() {
  const app = document.getElementById('app');
  
  function navigate(route) {
    if (!routes[route]) route = 'home';
    
    if (currentPage) {
      app.innerHTML = '';
    }
    
    const Page = routes[route];
    app.innerHTML = Page();
    currentPage = route;
    
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.route === route);
    });
    
    window.location.hash = route;
  }

  window.addEventListener('hashchange', () => {
    const route = window.location.hash.replace('#', '') || 'home';
    navigate(route);
  });

  window.addEventListener('load', () => {
    const route = window.location.hash.replace('#', '') || 'home';
    navigate(route);
  });

  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('nav-btn')) {
      navigate(e.target.dataset.route);
    }
  });
}

export function navigateTo(route) {
  window.location.hash = route;
}
