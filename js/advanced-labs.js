/**
 * Advanced Research Labs Interactive Module
 * 1. Dual-Stream FFT Frequency Domain Visualizer
 * 2. BiLSTM Multi-Step AQI Forecasting Simulator Canvas
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
      height = aqiCanvas.height = aqiCanvas.parentElement.clientHeight || 180;
    }

    // Generate Synthetic Multivariate Time Series Curves
    function drawAQIChart() {
      ctx.clearRect(0, 0, width, height);
      animOffset += 0.02;

      const padding = 30;
      const plotWidth = width - padding * 2;
      const plotHeight = height - padding * 2;
      const centerY = padding + plotHeight * 0.5;

      // Draw Grid Lines (Neomorphic Inset Style)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      for (let y = padding; y <= height - padding; y += plotHeight / 4) {
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
      }

      const points = 48;
      const step = plotWidth / (points - 1);

      // Baseline parameters depending on pollutant
      let freq = selectedPollutant === 'pm25' ? 0.35 : selectedPollutant === 'pm10' ? 0.25 : 0.45;
      let amp = plotHeight * 0.38;

      // 1. Ground Truth True Data Curve (Muted Slate Line)
      ctx.beginPath();
      for (let i = 0; i < points; i++) {
        const x = padding + i * step;
        const noise = Math.sin(i * 0.8 + animOffset) * 6 + Math.cos(i * 1.6) * 4;
        const y = centerY + Math.sin(i * freq + animOffset) * amp + noise;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // 2. BiLSTM Predicted Curve (Cyber Emerald Glowing Line)
      ctx.beginPath();
      for (let i = 0; i < points; i++) {
        const x = padding + i * step;
        // BiLSTM tightly predicts forward and backward sequences with slight smoothing
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
      ctx.shadowBlur = 0; // reset

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

      // Text Labels
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px JetBrains Mono, monospace';
      ctx.fillText('HISTORICAL (48h)', padding + 5, padding + 12);
      ctx.fillStyle = '#34d399';
      ctx.fillText('BiLSTM FORECAST (+24h Multi-Step)', splitX + 8, padding + 12);

      requestAnimationFrame(drawAQIChart);
    }

    // Pollutant Switcher Buttons
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
})();
