let audioElement = null;
let isPlaying = false;

export function initAudio() {
  audioElement = new Audio();
  audioElement.loop = true;
  audioElement.volume = 0.5;
}

export function loadAudio(src) {
  if (audioElement) {
    audioElement.src = src;
    audioElement.load();
  }
}

export function playAudio() {
  if (audioElement) {
    audioElement.play().then(() => {
      isPlaying = true;
      updatePlayButton();
    }).catch(err => {
      console.log('Audio autoplay blocked:', err);
    });
  }
}

export function pauseAudio() {
  if (audioElement) {
    audioElement.pause();
    isPlaying = false;
    updatePlayButton();
  }
}

export function toggleAudio() {
  if (isPlaying) {
    pauseAudio();
  } else {
    playAudio();
  }
}

export function setVolume(volume) {
  if (audioElement) {
    audioElement.volume = Math.max(0, Math.min(1, volume));
  }
}

export function getIsPlaying() {
  return isPlaying;
}

function updatePlayButton() {
  const btn = document.querySelector('.play-btn');
  if (btn) {
    btn.textContent = isPlaying ? '⏸' : '▶';
  }
}
