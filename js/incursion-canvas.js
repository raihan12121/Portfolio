/**
 * Interactive Lab Showcase Controller
 * 1. Incursion Astrophysics Accretion Physics Canvas
 * 2. FFT Frequency Domain & Deepfake Forensics Spectrum
 * 3. ARI Software Lab Mobile Ecosystem Metrics
 */

(function () {
  const canvas = document.getElementById('hero-incursion-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let currentTab = 'incursion';
  const PARTICLE_COUNT = 450;

  function resize() {
    width = canvas.width = canvas.parentElement.clientWidth || 400;
    height = canvas.height = canvas.parentElement.clientHeight || 250;
  }

  // --- Incursion Particles ---
  class AccretionParticle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.radius = initial ? Math.random() * 110 + 28 : 138;
      this.angle = Math.random() * Math.PI * 2;
      this.speed = (0.75 / Math.sqrt(this.radius)) * (0.85 + Math.random() * 0.3);
      this.size = Math.random() * 1.4 + 0.6;
      this.verticalOffset = (Math.random() - 0.5) * 8;
      this.hue = 195 + Math.random() * 25; // Sapphire
    }

    update() {
      this.angle += this.speed;
      this.radius -= 0.12;
      if (this.radius < 26) {
        this.reset(false);
      }
    }

    draw(centerX, centerY) {
      const inclination = 0.35;
      const cosA = Math.cos(this.angle);
      const sinA = Math.sin(this.angle);

      // Relativistic Doppler Beaming
      const dopplerFactor = 1.0 - sinA * 0.45;

      const x = centerX + cosA * this.radius;
      const y = centerY + sinA * (this.radius * inclination) + this.verticalOffset;

      const alpha = Math.min(1, Math.max(0.15, (this.radius / 110) * dopplerFactor * 0.85));

      ctx.beginPath();
      ctx.arc(x, y, this.size * dopplerFactor, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 90%, 65%, ${alpha})`;
      ctx.fill();
    }
  }

  function initIncursion() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new AccretionParticle());
    }
  }

  // --- Render Loops ---
  function drawIncursion() {
    ctx.clearRect(0, 0, width, height);

    const centerX = width * 0.5;
    const centerY = height * 0.5;

    // Draw Event Horizon
    const horizonRadius = 24;
    ctx.beginPath();
    ctx.arc(centerX, centerY, horizonRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#030407';
    ctx.fill();
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Photon Ring
    ctx.beginPath();
    ctx.arc(centerX, centerY, horizonRadius + 4, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Accretion Disk Particles
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw(centerX, centerY);
    }
  }

  // FFT Frequency Spectrum Visualizer (Tab 2)
  let fftPhase = 0;
  function drawFFTSpectrum() {
    ctx.clearRect(0, 0, width, height);
    fftPhase += 0.03;

    const centerX = width * 0.5;
    const centerY = height * 0.5;

    // 2D Frequency Magnitude Grid
    const rings = 6;
    for (let r = 1; r <= rings; r++) {
      const radius = r * 16;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(56, 189, 248, ${0.35 - r * 0.04})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // High frequency energy spikes (Deepfake artifacts)
    const points = 32;
    ctx.beginPath();
    for (let i = 0; i < points; i++) {
      const angle = (i / points) * Math.PI * 2;
      const noise = Math.sin(angle * 4 + fftPhase) * 12 + Math.cos(angle * 8 - fftPhase) * 6;
      const rad = 65 + noise;
      const x = centerX + Math.cos(angle) * rad;
      const y = centerY + Math.sin(angle) * rad;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = 'rgba(56, 189, 248, 0.08)';
    ctx.fill();

    // Center DC Component
    ctx.beginPath();
    ctx.arc(centerX, centerY, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#f8fafc';
    ctx.fill();
  }

  // Mobile App Architecture Pulse (Tab 3)
  let pulseAngle = 0;
  function drawAppEcosystem() {
    ctx.clearRect(0, 0, width, height);
    pulseAngle += 0.025;

    const centerX = width * 0.5;
    const centerY = height * 0.5;

    const nodes = [
      { label: 'Money Manager', angle: 0 },
      { label: 'PDF Scanner', angle: (Math.PI * 2) / 3 },
      { label: 'AnimalCam AR', angle: (Math.PI * 4) / 3 }
    ];

    // Center Core (Flutter / Firebase Engine)
    ctx.beginPath();
    ctx.arc(centerX, centerY, 22, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
    ctx.fill();
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = '10px JetBrains Mono, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('ARI LAB', centerX, centerY + 3);

    // Orbiting App Nodes
    nodes.forEach(node => {
      const a = node.angle + pulseAngle;
      const orbitRad = 72;
      const nx = centerX + Math.cos(a) * orbitRad;
      const ny = centerY + Math.sin(a) * orbitRad;

      // Connecting line
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(nx, ny);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Node
      ctx.beginPath();
      ctx.arc(nx, ny, 12, 0, Math.PI * 2);
      ctx.fillStyle = '#161b2c';
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Label
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '9px Inter, sans-serif';
      ctx.fillText(node.label, nx, ny + 20);
    });
  }

  function renderLoop() {
    if (currentTab === 'incursion') {
      drawIncursion();
    } else if (currentTab === 'fft') {
      drawFFTSpectrum();
    } else if (currentTab === 'mobile') {
      drawAppEcosystem();
    }
    requestAnimationFrame(renderLoop);
  }

  // Tab Switching
  const tabBtns = document.querySelectorAll('.lab-tab-btn');
  const metaTitle = document.getElementById('lab-meta-title');
  const metaTag = document.getElementById('lab-meta-tag');
  const metaDesc = document.getElementById('lab-meta-desc');

  const TAB_METADATA = {
    incursion: {
      title: 'Incursion: Black Hole Geodesics',
      tag: '27 GLSL Shaders · 30k Particles',
      desc: 'Relativistic Doppler beaming & Kerr black hole accretion physics presented at BUBT.'
    },
    fft: {
      title: 'Dual-Stream FFT Forensics',
      tag: 'EfficientNet-B4 + 2D FFT',
      desc: 'Spatial and frequency domain magnitude analysis exposing deepfake manipulation artifacts.'
    },
    mobile: {
      title: 'ARI Software Lab Ecosystem',
      tag: 'Flutter · Dart · Firebase',
      desc: '3 production apps published to Google Play with 1,000+ total active downloads.'
    }
  };

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const tab = btn.getAttribute('data-lab-tab');
      currentTab = tab;

      if (TAB_METADATA[tab]) {
        if (metaTitle) metaTitle.textContent = TAB_METADATA[tab].title;
        if (metaTag) metaTag.textContent = TAB_METADATA[tab].tag;
        if (metaDesc) metaDesc.textContent = TAB_METADATA[tab].desc;
      }
    });
  });

  window.addEventListener('resize', () => {
    resize();
  });

  resize();
  initIncursion();
  renderLoop();
})();
