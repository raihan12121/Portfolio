/**
 * Advanced Research Labs & Achievement Tracker Module
 * 1. BiLSTM Multi-Step AQI Forecasting Simulator Canvas
 * 2. In-Game Achievement Unlocks Observer
 */

(function () {
  // ==========================================
  // 1. BiLSTM AQI Forecasting Canvas Visualizer
  // ==========================================
  const aqiCanvas = document.getElementById('aqi-forecast-canvas');
  if (aqiCanvas) {
    const ctx = aqiCanvas.getContext('2d');
    let width, height;
    let animOffset = 0;
    let selectedPollutant = 'pm25';

    function resizeAQI() {
      width = aqiCanvas.width = aqiCanvas.parentElement.clientWidth || 600;
      height = aqiCanvas.height = aqiCanvas.parentElement.clientHeight || 175;
    }

    function drawAQIChart() {
      ctx.clearRect(0, 0, width, height);
      animOffset += 0.02;

      const padding = 28;
      const plotWidth = width - padding * 2;
      const plotHeight = height - padding * 2;
      const centerY = padding + plotHeight * 0.5;

      // Draw Grid Lines (HUD Terminal Style)
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.08)';
      ctx.lineWidth = 1;
      for (let y = padding; y <= height - padding; y += plotHeight / 4) {
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
      }

      const points = 48;
      const step = plotWidth / (points - 1);

      let freq = selectedPollutant === 'pm25' ? 0.35 : selectedPollutant === 'pm10' ? 0.25 : 0.45;
      let amp = plotHeight * 0.36;

      // 1. Ground Truth True Data Curve (Muted Slate Line)
      ctx.beginPath();
      for (let i = 0; i < points; i++) {
        const x = padding + i * step;
        const noise = Math.sin(i * 0.8 + animOffset) * 6 + Math.cos(i * 1.6) * 4;
        const y = centerY + Math.sin(i * freq + animOffset) * amp + noise;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // 2. BiLSTM Predicted Curve (Cyber Emerald Glowing Line)
      ctx.beginPath();
      for (let i = 0; i < points; i++) {
        const x = padding + i * step;
        const noise = Math.sin(i * 0.8 + animOffset) * 5.2 + Math.cos(i * 1.6) * 3.8;
        const y = centerY + Math.sin(i * freq + animOffset) * (amp * 0.98) + noise;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = 'rgba(16, 185, 129, 0.6)';
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Forecast Boundary Marker (Past vs 24h Future Multi-Step)
      const splitX = padding + plotWidth * 0.65;
      ctx.beginPath();
      ctx.moveTo(splitX, padding);
      ctx.lineTo(splitX, height - padding);
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.4)';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Terminal Labels
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px JetBrains Mono, monospace';
      ctx.fillText('HISTORICAL (48h)', padding + 5, padding + 12);
      ctx.fillStyle = '#34d399';
      ctx.fillText('BiLSTM FORECAST (+24h Multi-Step)', splitX + 8, padding + 12);

      requestAnimationFrame(drawAQIChart);
    }

    // Pollutant Switcher
    const pollutantBtns = document.querySelectorAll('[data-pollutant]');
    pollutantBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        pollutantBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedPollutant = btn.getAttribute('data-pollutant');
      });
    });

    window.addEventListener('resize', resizeAQI);
    resizeAQI();
    requestAnimationFrame(drawAQIChart);
  }

  // ==========================================
  // 2. In-Game Achievement Unlocks Engine
  // ==========================================
  const unlockedAchievements = new Set();

  function triggerAchievement(title, desc) {
    if (unlockedAchievements.has(title)) return;
    unlockedAchievements.add(title);

    if (window.gameAudio && window.gameAudio.playAchievement) {
      window.gameAudio.playAchievement();
    }

    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.innerHTML = `
      <i data-lucide="award" style="width: 20px; height: 20px; color: var(--accent-gold);"></i>
      <div>
        <div style="font-weight: 700; color: var(--accent-gold); font-size: 0.82rem;">🏆 ACHIEVEMENT UNLOCKED!</div>
        <div style="color: #ffffff; font-size: 0.85rem;">${title}</div>
        <div style="font-size: 0.72rem; color: var(--text-muted);">${desc}</div>
      </div>
    `;

    document.body.appendChild(toast);
    if (window.lucide) window.lucide.createIcons();

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // Observers for triggering achievements on user discovery
  const incursionSlider = document.getElementById('slider-bh-spin');
  incursionSlider?.addEventListener('input', () => {
    triggerAchievement('Relativistic Physicist', 'Altered Kerr Black Hole Spin & Accretion Dynamics!');
  });

  // Scroll discovery triggers
  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + window.innerHeight;
    const questsSection = document.getElementById('quests');
    const armorySection = document.getElementById('armory');
    const skillSection = document.getElementById('skills');

    if (questsSection && scrollPos > questsSection.offsetTop + 200) {
      triggerAchievement('Mission Log Opened', 'Investigated Deepfake & AQI Research Theses!');
    }
    if (armorySection && scrollPos > armorySection.offsetTop + 200) {
      triggerAchievement('Armory Inspected', 'Discovered ARI Software Lab & Incursion Systems!');
    }
    if (skillSection && scrollPos > skillSection.offsetTop + 200) {
      triggerAchievement('Skill Tree Unlocked', 'Inspected AI/ML, Vision & MLOps Arsenal!');
    }
  }, { passive: true });
})();
