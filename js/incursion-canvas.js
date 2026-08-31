/**
 * Incursion: Relativistic Kerr Black Hole Accretion Engine & Controls
 * Interactive astrophysics physics simulation in Cyber Emerald palette
 */

(function () {
  const canvas = document.getElementById('hero-incursion-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const BASE_PARTICLES = 420;

  // Physics simulation parameters (User-controllable)
  let physics = {
    spin: 0.88,         // Kerr spin parameter a/M (0.0 to 0.998)
    inclination: 0.35,  // Accretion disk tilt angle (0.1 to 0.7)
    velocityMult: 1.0,  // Particle orbital velocity multiplier
    baseRadius: 110,
    horizonBase: 24
  };

  // FPS calculation
  let lastFrameTime = performance.now();
  let frameCount = 0;
  let fps = 60;
  const fpsDisplay = document.getElementById('telemetry-fps');
  const particleCountDisplay = document.getElementById('telemetry-particles');

  function resize() {
    width = canvas.width = canvas.parentElement.clientWidth || 400;
    height = canvas.height = canvas.parentElement.clientHeight || 230;
  }

  class AccretionParticle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      // Inner radius contracts as spin approaches extremal limit (a/M -> 1)
      const isco = physics.horizonBase * (1.2 - physics.spin * 0.45);
      this.radius = initial ? Math.random() * (physics.baseRadius - isco) + isco : physics.baseRadius + Math.random() * 25;
      this.angle = Math.random() * Math.PI * 2;
      
      // Relativistic Keplerian orbital velocity
      this.baseSpeed = (0.78 / Math.sqrt(Math.max(12, this.radius))) * (0.9 + physics.spin * 0.4);
      this.size = Math.random() * 1.5 + 0.6;
      this.verticalOffset = (Math.random() - 0.5) * 8;
      // Cyber Emerald / Mint Hue (150 to 165)
      this.hue = 150 + Math.random() * 18;
    }

    update() {
      this.angle += this.baseSpeed * physics.velocityMult;
      // Inward accretion spiral
      this.radius -= 0.12 * (1 + physics.spin * 0.5);
      
      const isco = physics.horizonBase * (1.1 - physics.spin * 0.4);
      if (this.radius < isco) {
        this.reset(false);
      }
    }

    draw(centerX, centerY) {
      const cosA = Math.cos(this.angle);
      const sinA = Math.sin(this.angle);

      // Relativistic Doppler Beaming (approaching side shines brighter)
      const dopplerFactor = 1.0 - sinA * (0.35 + physics.spin * 0.25);

      const x = centerX + cosA * this.radius;
      const y = centerY + sinA * (this.radius * physics.inclination) + this.verticalOffset;

      const alpha = Math.min(1, Math.max(0.12, (this.radius / physics.baseRadius) * dopplerFactor * 0.85));

      ctx.beginPath();
      ctx.arc(x, y, this.size * dopplerFactor, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 92%, 55%, ${alpha})`;
      ctx.fill();
    }
  }

  function init() {
    resize();
    particles = [];
    for (let i = 0; i < BASE_PARTICLES; i++) {
      particles.push(new AccretionParticle());
    }
  }

  function render(now) {
    // Measure FPS
    frameCount++;
    if (now - lastFrameTime >= 1000) {
      fps = Math.round((frameCount * 1000) / (now - lastFrameTime));
      frameCount = 0;
      lastFrameTime = now;
      if (fpsDisplay) fpsDisplay.textContent = `${fps} FPS`;
    }

    ctx.clearRect(0, 0, width, height);

    const centerX = width * 0.5;
    const centerY = height * 0.5;

    // Kerr Black Hole Event Horizon Shadow (contracts with spin)
    const horizonRadius = physics.horizonBase * (1.0 - physics.spin * 0.22);
    
    // Gravitational Lensing Glow Ring
    ctx.beginPath();
    ctx.arc(centerX, centerY, horizonRadius + 8, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.2)';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Central Event Horizon Shadow
    ctx.beginPath();
    ctx.arc(centerX, centerY, horizonRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#06080d';
    ctx.fill();
    ctx.strokeStyle = 'rgba(52, 211, 153, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Accretion Disk Particles
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw(centerX, centerY);
    }

    requestAnimationFrame(render);
  }

  // --- Slider Controls Setup ---
  const spinSlider = document.getElementById('slider-bh-spin');
  const spinVal = document.getElementById('val-bh-spin');
  const incSlider = document.getElementById('slider-bh-inc');
  const incVal = document.getElementById('val-bh-inc');
  const velSlider = document.getElementById('slider-bh-vel');
  const velVal = document.getElementById('val-bh-vel');

  spinSlider?.addEventListener('input', (e) => {
    physics.spin = parseFloat(e.target.value);
    if (spinVal) spinVal.textContent = physics.spin.toFixed(2);
  });

  incSlider?.addEventListener('input', (e) => {
    const deg = parseFloat(e.target.value);
    physics.inclination = (deg / 90) * 0.7;
    if (incVal) incVal.textContent = `${deg}°`;
  });

  velSlider?.addEventListener('input', (e) => {
    physics.velocityMult = parseFloat(e.target.value);
    if (velVal) velVal.textContent = `${physics.velocityMult.toFixed(1)}x`;
  });

  window.addEventListener('resize', () => {
    resize();
  });

  init();
  if (particleCountDisplay) particleCountDisplay.textContent = `${BASE_PARTICLES} particles`;
  requestAnimationFrame(render);
})();
