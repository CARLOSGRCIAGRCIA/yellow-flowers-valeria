export function LandingPage() {
  return `
    <div class="page active">
      <div class="landing-page">
        <div class="landing-heart">💛</div>
        <p class="landing-title">Para ti, Valeria</p>
        <button id="enter-btn" class="enter-btn">Entrar al cosmos</button>
      </div>
    </div>
  `;
}

export function initLanding() {
  const enterBtn = document.getElementById('enter-btn');
  if (enterBtn) {
    enterBtn.addEventListener('click', () => {
      document.body.classList.remove('not-loaded');
      window.initBackgroundMusic && window.initBackgroundMusic();
      setTimeout(() => {
        window.location.hash = 'home';
      }, 300);
    });
  }
}
