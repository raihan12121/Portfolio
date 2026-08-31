/**
 * Cyber-RPG Game Web Audio API Sound Synthesizer
 * Generates retro 8-bit & sci-fi audio micro-interactions with zero external audio assets
 */

(function () {
  let audioCtx = null;
  let soundEnabled = true;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Play a retro sci-fi click sound
  function playClickSound() {
    if (!soundEnabled || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(580, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.05);
    } catch (e) {}
  }

  // Play a soft hover blip
  function playHoverSound() {
    if (!soundEnabled || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(420, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.03);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.03);
    } catch (e) {}
  }

  // Play Quest / Achievement Fanfare
  function playAchievementSound() {
    if (!soundEnabled || !audioCtx) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.07);

        gain.gain.setValueAtTime(0.05, audioCtx.currentTime + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.07 + 0.12);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(audioCtx.currentTime + idx * 0.07);
        osc.stop(audioCtx.currentTime + idx * 0.07 + 0.12);
      });
    } catch (e) {}
  }

  // Bind interactive elements
  document.addEventListener('DOMContentLoaded', () => {
    const soundToggle = document.getElementById('sound-toggle-btn');
    if (soundToggle) {
      soundToggle.addEventListener('click', () => {
        initAudio();
        soundEnabled = !soundEnabled;
        soundToggle.innerHTML = soundEnabled 
          ? '<i data-lucide="volume-2" style="width: 14px; height: 14px;"></i> <span>SFX: ON</span>' 
          : '<i data-lucide="volume-x" style="width: 14px; height: 14px;"></i> <span>SFX: OFF</span>';
        soundToggle.classList.toggle('active', soundEnabled);
        if (window.lucide) window.lucide.createIcons();
        if (soundEnabled) playClickSound();
      });
    }

    // Attach click and hover sound to buttons and links
    const interactiveEls = document.querySelectorAll('button, a, input[type="range"], .quest-card, .skill-node');
    interactiveEls.forEach(el => {
      el.addEventListener('mouseenter', () => {
        initAudio();
        playHoverSound();
      });
      el.addEventListener('click', () => {
        initAudio();
        playClickSound();
      });
    });

    window.gameAudio = {
      playClick: playClickSound,
      playHover: playHoverSound,
      playAchievement: playAchievementSound
    };
  });
})();
