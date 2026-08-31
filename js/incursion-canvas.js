/**
 * Incursion Canvas: Relativistic Black Hole Accretion Disk Simulation
 * Inspired by Muhammad Raihan's Incursion astrophysics project (27 GLSL shaders & 30k particles)
 */

(function () {
  const canvas = document.getElementById('incursion-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const PARTICLE_COUNT = window.innerWidth < 768 ? 400 : 850;
  let mouse = { x: null, y: null, targetX: 0, targetY: 0 };

  function resize() {
    width = canvas.width = canvas.parentElement.clientWidth;
    height = canvas.height = canvas.parentElement.clientHeight;
  }

  class DiskParticle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      // Orbital radius distribution (power law concentrated near photon sphere)
      this.radius = initial ? Math.random() * 280 + 70 : 340;
      this.angle = Math.random() * Math.PI * 2;
      // Keplerian angular velocity (closer particles orbit faster)
      this.baseSpeed = 0.85 / Math.sqrt(this.radius);
      this.speed = this.baseSpeed * (0.9 + Math.random() * 0.2);
      this.size = Math.random() * 1.5 + 0.6;
      this.verticalOffset = (Math.random() - 0.5) * 16;
      this.hue = 195 + Math.random() * 30; // Sapphire / Cyan
    }

    update() {
      this.angle += this.speed;
      // Slowly spiral inwards towards the horizon
      this.radius -= 0.15;
      if (this.radius < 65) {
        this.reset(false);
      }
    }

    draw(centerX, centerY) {
      // 3D perspective projection (tilted accretion disk)
      const inclination = 0.38; // Tilt angle
      const cosA = Math.cos(this.angle);
      const sinA = Math.sin(this.angle);

      // Relativistic Doppler beaming (particles approaching left side are brighter)
      const dopplerFactor = 1.0 - sinA * 0.45;
      
      const x = centerX + cosA * this.radius;
      const y = centerY + sinA * (this.radius * inclination) + this.verticalOffset;

      // Alpha based on distance and Doppler beaming
      const alpha = Math.min(1, Math.max(0.1, (this.radius / 250) * dopplerFactor * 0.7));

      ctx.beginPath();
      ctx.arc(x, y, this.size * dopplerFactor, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 90%, 65%, ${alpha})`;
      ctx.fill();
    }
  }

  function init() {
    resize();
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new DiskParticle());
    }
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Dynamic center relative to canvas right side
    const centerX = width > 900 ? width * 0.75 : width * 0.5;
    const centerY = height * 0.5;

    // Draw Event Horizon (Central Black Hole Shadow)
    const horizonRadius = 55;
    ctx.beginPath();
    ctx.arc(centerX, centerY, horizonRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#06070a';
    ctx.fill();
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Draw Photon Sphere Ring
    ctx.beginPath();
    ctx.arc(centerX, centerY, horizonRadius + 8, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Update & Draw Particles
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw(centerX, centerY);
    }

    requestAnimationFrame(render);
  }

  window.addEventListener('resize', () => {
    resize();
  });

  init();
  render();
})();
