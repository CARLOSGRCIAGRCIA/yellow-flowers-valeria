import { LyricsPlayer } from './LyricsPlayer.js';

let lyricsPlayer = null;
let audioElement = null;
let isVisible = false;
let currentLyricCallback = null;

export function initLyrics() {
  lyricsPlayer = new LyricsPlayer();
  createLyricsUI();
}

export function initAudioWithLyrics(audioEl, lyricsUrl) {
  audioElement = audioEl;
  
  loadLyrics(lyricsUrl);
  
  audioEl.addEventListener('timeupdate', () => {
    if (lyricsPlayer) {
      lyricsPlayer.update(audioEl.currentTime);
    }
  });
  
  audioEl.addEventListener('play', () => {
    if (lyricsPlayer) {
      lyricsPlayer.update(audioEl.currentTime);
    }
  });
  
  audioEl.addEventListener('seeked', () => {
    if (lyricsPlayer) {
      lyricsPlayer.reset();
      lyricsPlayer.update(audioEl.currentTime);
    }
  });
}

export function loadLyrics(url) {
  fetch(url)
    .then(res => res.text())
    .then(text => {
      lyricsPlayer.load(text);
      const container = document.getElementById('lyrics-panel');
      if (container) {
        lyricsPlayer.render(container);
      }
    })
    .catch(err => console.log('Lyrics not found:', err));
}

function createLyricsUI() {
  const ui = document.createElement('div');
  ui.id = 'lyrics-ui';
  ui.innerHTML = `
    <div class="lyrics-bar" onclick="window.toggleLyrics()">
      <div class="lyrics-indicator">
        <span class="lyrics-icon">🎵</span>
        <span class="lyrics-current">♪</span>
      </div>
      <div class="lyrics-toggle">
        <span class="lyrics-hint">Ver letra</span>
        <span class="lyrics-arrow">▲</span>
      </div>
    </div>
    <div id="lyrics-panel" class="lyrics-panel"></div>
  `;
  document.body.appendChild(ui);
  
  window.toggleLyrics = toggleLyrics;
}

export function toggleLyrics() {
  isVisible = !isVisible;
  const panel = document.getElementById('lyrics-panel');
  const bar = document.querySelector('.lyrics-bar');
  const arrow = document.querySelector('.lyrics-arrow');
  const hint = document.querySelector('.lyrics-hint');
  
  if (panel) {
    panel.classList.toggle('visible', isVisible);
  }
  if (bar) {
    bar.classList.toggle('expanded', isVisible);
  }
  if (arrow) {
    arrow.textContent = isVisible ? '▼' : '▲';
  }
  if (hint) {
    hint.textContent = isVisible ? 'Ocultar' : 'Ver letra';
  }
}

export function setCurrentLyric(text) {
  const current = document.querySelector('.lyrics-current');
  if (current) {
    current.textContent = text || '♪';
  }
}

export function getLyricsPlayer() {
  return lyricsPlayer;
}
