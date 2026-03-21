import { loadAudio, playAudio, pauseAudio, toggleAudio, setVolume, getIsPlaying } from '../components/AudioPlayer.js';

export function MusicPage() {
  return `
    <div class="page active">
      <div class="page-music">
        <h1>🎵 Música</h1>
        <div class="music-card">
          <div class="music-info">
            <h2>Canción de Fondo</h2>
            <p>Añade tu propia música para acompañar el jardín galáctico</p>
          </div>
          
          <div class="audio-player">
            <button class="play-btn" onclick="window.musicPlayer.toggle()">▶</button>
            <input type="range" class="volume-slider" min="0" max="1" step="0.1" value="0.5" 
                   onchange="window.musicPlayer.setVolume(this.value)">
            <audio id="bg-audio" loop></audio>
          </div>
          
          <div class="music-upload" onclick="document.getElementById('file-input').click()">
            <input type="file" id="file-input" accept="audio/*" 
                   onchange="window.musicPlayer.loadFile(this.files[0])">
            <p>📁 Haz clic o arrastra un archivo de audio aquí</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

window.musicPlayer = {
  toggle() {
    if (getIsPlaying()) {
      pauseAudio();
    } else {
      const audio = document.getElementById('bg-audio');
      if (audio.src) {
        playAudio();
      } else {
        alert('Primero carga un archivo de audio');
      }
    }
    this.updateButton();
  },
  
  setVolume(vol) {
    setVolume(parseFloat(vol));
  },
  
  loadFile(file) {
    if (!file) return;
    const audio = document.getElementById('bg-audio');
    const url = URL.createObjectURL(file);
    audio.src = url;
    loadAudio(url);
    playAudio();
    this.updateButton();
  },
  
  updateButton() {
    const btn = document.querySelector('.play-btn');
    if (btn) {
      btn.textContent = getIsPlaying() ? '⏸' : '▶';
    }
  }
};
