export class LyricsPlayer {
  constructor() {
    this.lyrics = [];
    this.currentIndex = -1;
    this.container = null;
    this.onLyricChange = null;
  }

  load(lrcText) {
    this.lyrics = this.parseLRC(lrcText);
    this.currentIndex = -1;
  }

  parseLRC(lrcText) {
    const lines = lrcText.split('\n');
    const lyrics = [];

    for (const line of lines) {
      const match = line.match(/\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/);
      if (match) {
        const minutes = parseInt(match[1]);
        const seconds = parseInt(match[2]);
        const ms = match[3].length === 3 
          ? parseInt(match[3]) 
          : parseInt(match[3]) * 10;
        const time = minutes * 60 + seconds + ms / 1000;
        const text = match[4].trim();
        
        if (text) {
          lyrics.push({ time, text });
        }
      }
    }

    lyrics.sort((a, b) => a.time - b.time);
    return lyrics;
  }

  update(currentTime) {
    for (let i = this.lyrics.length - 1; i >= 0; i--) {
      if (currentTime >= this.lyrics[i].time) {
        if (i !== this.currentIndex) {
          this.currentIndex = i;
          this.updateDisplay();
          if (this.onLyricChange) {
            this.onLyricChange(this.lyrics[i], i);
          }
        }
        break;
      }
    }
  }

  updateDisplay() {
    if (!this.container) return;

    const allLines = this.container.querySelectorAll('.lyric-line');
    allLines.forEach((line, idx) => {
      line.classList.toggle('active', idx === this.currentIndex);
      line.classList.toggle('past', idx < this.currentIndex);
    });

    const activeLine = this.container.querySelector('.lyric-line.active');
    if (activeLine) {
      activeLine.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  render(container) {
    this.container = container;
    container.innerHTML = '';
    
    const wrapper = document.createElement('div');
    wrapper.className = 'lyrics-wrapper';
    
    const scrollArea = document.createElement('div');
    scrollArea.className = 'lyrics-scroll';

    for (const lyric of this.lyrics) {
      const line = document.createElement('div');
      line.className = 'lyric-line';
      line.textContent = lyric.text;
      line.dataset.time = lyric.time;
      scrollArea.appendChild(line);
    }

    wrapper.appendChild(scrollArea);
    container.appendChild(wrapper);
  }

  reset() {
    this.currentIndex = -1;
    this.updateDisplay();
  }
}
