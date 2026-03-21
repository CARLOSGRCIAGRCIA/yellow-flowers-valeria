import { initRouter } from './router.js';
import { initGalaxy } from './components/Galaxy.js';
import { initLyrics, initAudioWithLyrics } from './components/LyricsDisplay.js';
import './style.css';

let backgroundAudio = null;

document.addEventListener('DOMContentLoaded', () => {
  initRouter();
  initGalaxy();
  initLyrics();
  
  const overlay = document.getElementById('entry-overlay');
  const enterBtn = document.getElementById('enter-btn');
  
  if (overlay && enterBtn) {
    enterBtn.addEventListener('click', () => {
      overlay.classList.add('hidden');
      initBackgroundMusic();
      setTimeout(() => {
        overlay.style.display = 'none';
      }, 500);
    });
  }
  
  setTimeout(() => {
    document.body.classList.remove('not-loaded');
  }, 100);
  
  function createShootingStar() {
    const star = document.createElement('div');
    star.className = 'shooting-star';
    star.style.top = Math.random() * 60 + '%';
    star.style.animationDelay = '0s';
    star.style.animationDuration = (Math.random() * 1.5 + 2) + 's';
    document.querySelector('.shooting-stars').appendChild(star);
    setTimeout(() => { if (star.parentNode) star.remove(); }, 4000);
  }
  
  setInterval(() => {
    if (Math.random() > 0.3) createShootingStar();
  }, Math.random() * 5000 + 3000);
});

function initBackgroundMusic() {
  if (backgroundAudio) {
    backgroundAudio.pause();
    backgroundAudio.src = '';
    backgroundAudio = null;
  }
  
  backgroundAudio = new Audio('/music/Flowers.mp3');
  backgroundAudio.volume = 0.4;
  backgroundAudio.loop = true;
  
  initAudioWithLyrics(backgroundAudio, '/music/lyrics.lrc');
  
  backgroundAudio.currentTime = 0;
  backgroundAudio.play().catch(err => console.log('Audio ready:', err));
  
  setInterval(() => {
    if (backgroundAudio && backgroundAudio.paused) {
      backgroundAudio.play().catch(() => {});
    }
  }, 1000);
}

window.getBackgroundAudio = () => backgroundAudio;
