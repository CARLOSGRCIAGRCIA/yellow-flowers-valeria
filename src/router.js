import { LandingPage, initLanding } from './pages/Landing.js';
import { HomePage } from './pages/Home.js';
import { AboutPage } from './pages/About.js';
import { MusicPage } from './pages/Music.js';

const routes = {
  landing: { page: LandingPage, init: initLanding },
  home: { page: HomePage, init: null },
  about: { page: AboutPage, init: null },
  music: { page: MusicPage, init: null },
};

let currentPage = null;

export function initRouter() {
  const app = document.getElementById('app');
  
  function navigate(route) {
    if (!routes[route]) route = 'landing';
    
    if (currentPage) {
      app.innerHTML = '';
    }
    
    const routeConfig = routes[route];
    app.innerHTML = routeConfig.page();
    currentPage = route;
    
    if (routeConfig.init) {
      routeConfig.init();
    }
    
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.route === route);
    });
    
    window.location.hash = route;
  }

  window.addEventListener('hashchange', () => {
    const route = window.location.hash.replace('#', '') || 'landing';
    navigate(route);
  });

  window.addEventListener('load', () => {
    const route = window.location.hash.replace('#', '') || 'landing';
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
