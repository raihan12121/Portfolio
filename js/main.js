/**
 * Main Portfolio UI Controller
 * Muhammad Raihan Molla Portfolio
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    lucide.createIcons();
  }

  /* --- 1. Typewriter Effect --- */
  const typewriterElement = document.getElementById('typewriter-text');
  if (typewriterElement) {
    const roles = [
      'AI & Machine Learning Engineer',
      'Local LLM & Systems Architect (Rust)',
      'Temporal RAG & Graph Researcher',
      'Competitive Programmer (500+ Solved)',
      'Full-Stack Developer (Next.js & React)'
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 75;
    const deletingSpeed = 40;
    const pauseDelay = 1800;

    function type() {
      const currentRole = roles[roleIndex];
      if (isDeleting) {
        typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
      }

      let speed = isDeleting ? deletingSpeed : typingSpeed;

      if (!isDeleting && charIndex === currentRole.length) {
        speed = pauseDelay;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        speed = 400;
      }

      setTimeout(type, speed);
    }

    type();
  }

  /* --- 2. Navbar Scroll & ScrollSpy --- */
  const navbarWrapper = document.querySelector('.navbar-wrapper');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links .nav-link, .mobile-nav-drawer .nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbarWrapper?.classList.add('scrolled');
    } else {
      navbarWrapper?.classList.remove('scrolled');
    }

    // ScrollSpy
    let current = '';
    const scrollPosition = window.scrollY + 200;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  /* --- 3. Mobile Navigation Drawer --- */
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileDrawerLinks = document.querySelectorAll('.mobile-nav-drawer .nav-link');

  mobileToggle?.addEventListener('click', () => {
    mobileDrawer?.classList.toggle('open');
  });

  mobileDrawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileDrawer?.classList.remove('open');
    });
  });

  /* --- 4. Theme Palette Switcher --- */
  const themeMenuBtn = document.getElementById('theme-menu-btn');
  const paletteDropdown = document.getElementById('palette-dropdown');
  const paletteOptions = document.querySelectorAll('.palette-option');

  // Load stored accent or default
  const savedAccent = localStorage.getItem('portfolio-accent') || 'cyan';
  if (savedAccent !== 'cyan') {
    document.documentElement.setAttribute('data-accent', savedAccent);
  }

  themeMenuBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    paletteDropdown?.classList.toggle('show');
  });

  document.addEventListener('click', () => {
    paletteDropdown?.classList.remove('show');
  });

  paletteOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      const accent = opt.getAttribute('data-theme-value');
      if (accent) {
        if (accent === 'cyan') {
          document.documentElement.removeAttribute('data-accent');
        } else {
          document.documentElement.setAttribute('data-accent', accent);
        }
        localStorage.setItem('portfolio-accent', accent);
        showToast(`Theme switched to ${accent.toUpperCase()} ✨`);
      }
    });
  });

  /* --- 5. Project Category Filtering --- */
  const filterBtns = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter || category.includes(filter)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  /* --- 6. Skills Tab Switching --- */
  const skillTabBtns = document.querySelectorAll('.skill-tab-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  skillTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      skillTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const tabCategory = btn.getAttribute('data-skill-tab');

      skillCards.forEach(card => {
        const cat = card.getAttribute('data-skill-group');
        if (tabCategory === 'all' || cat === tabCategory) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* --- 7. Project Details Modal System --- */
  const PROJECT_DATA = {
    'self-route': {
      title: '⚡ Self-Route (SelfAPI)',
      badge: 'Systems & LLM Engine',
      description: 'High-performance local LLM inference engine and API gateway written in Rust. Run large language models directly on local GPU/CPU with zero subscriptions or third-party servers.',
      architecture: [
        'Custom Rust HTTP and WebSocket server for ultra-low latency inference handling.',
        'Direct hardware acceleration through quantized tensor computations.',
        'OpenAI-compatible /v1/chat/completions endpoint for seamless drop-in integration with LangChain, LlamaIndex, and Copilot tools.',
        'Built-in API key authentication, rate limiting, and local token usage telemetry.'
      ],
      stack: ['Rust', 'LLM Inference', 'Systems', 'REST Gateway', 'Quantization'],
      repo: 'https://github.com/raihan12121/Self-Route',
      demo: null
    },
    'terra-rag': {
      title: '🧠 TERRA: Temporal Evolution & Reasoning-Trace RAG',
      badge: 'Advanced AI Framework',
      description: 'Advanced Retrieval-Augmented Generation framework built for temporal graph analytics, multi-hop reasoning-trace indexation, and automated LLM evaluation.',
      architecture: [
        'Combines dense semantic vector retrieval via ChromaDB with topological Knowledge Graph reasoning.',
        'Temporal causality tracker allowing multi-hop queries across dynamic time-series knowledge nodes.',
        'Automated hallucinations mitigation and confidence calibration scoring.',
        'High-throughput vector indexing and evaluation benchmark pipelines.'
      ],
      stack: ['Python', 'ChromaDB', 'Knowledge Graphs', 'PyTorch', 'NLP'],
      repo: 'https://github.com/raihan12121/TERRA-Temporal-Evolution-and-Reasoning-Trace-RAG',
      demo: null
    },
    'cyberlearn': {
      title: '🛡️ CyberLearn: Cybersecurity Platform',
      badge: 'Web Application & EdTech',
      description: 'Interactive cybersecurity learning and vulnerability practicing platform designed to teach offensive security concepts and defensive mitigation techniques.',
      architecture: [
        'Built with Next.js 14 App Router, React, TypeScript, and Tailwind CSS.',
        'Interactive real-time vulnerability sandboxes demonstrating XSS, SQL Injection, CSRF, and Privilege Escalation.',
        'Progress tracking and interactive quizzing engine with instant vulnerability verification.',
        'Dark cyber aesthetic with accessible, high-performance UI components.'
      ],
      stack: ['TypeScript', 'Next.js', 'React', 'Tailwind CSS', 'Web Security'],
      repo: 'https://github.com/raihan12121/CyberLearn',
      demo: 'https://cyber-learn-three.vercel.app'
    },
    'lung-dx': {
      title: '🩻 LungDx: Lung Cancer Detection AI',
      badge: 'Medical AI & Computer Vision',
      description: 'Advanced cross-platform application assisting in the early detection and classification of lung cancer through AI-based analysis of chest X-ray images.',
      architecture: [
        'Deep Convolutional Neural Network (CNN) and Vision Transformer backbones trained with PyTorch.',
        'Class activation mapping (Grad-CAM) to provide transparent visual explanations to radiologists.',
        'Cross-platform client interface in TypeScript & modern UI framework.',
        'Robust data preprocessing pipeline handling contrast normalization and artifact reduction.'
      ],
      stack: ['Python', 'PyTorch', 'Computer Vision', 'TypeScript', 'Medical AI'],
      repo: 'https://github.com/raihan12121/Lung-Cancer-Detection',
      demo: null
    },
    'incursion': {
      title: '🌌 Incursion: Black Hole & Big Bang Simulation',
      badge: 'Astrophysics & Scientific Computing',
      description: 'Numerical physics simulation modeling relativistic Black Hole gravitational lensing effects and Big Bang cosmic inflation.',
      architecture: [
        'Geodesic light-ray integration around spinning Kerr black holes using NumPy numerical solvers.',
        'Simulated photon sphere, event horizon shadow, and Doppler relativistic beaming.',
        'Interactive camera controls and cosmological cosmic inflation particle physics.',
        'High-performance vectorized math routines for real-time rendering.'
      ],
      stack: ['Python', 'NumPy', 'Scientific Computing', 'Physics Simulation'],
      repo: 'https://github.com/raihan12121/Incursion-A-Blackhole-effect-and-BigBang-simulation',
      demo: null
    },
    'pc-cleaner': {
      title: '🧹 PC Cleaner Desktop App',
      badge: 'Desktop Utility',
      description: 'Lightweight, high-performance desktop application for Windows disk optimization, memory cache cleaning, and system file hygiene.',
      architecture: [
        'Built with TypeScript and Electron for safe, native Windows system operations.',
        'Scans temporary caches, browser logs, junk files, and system registry debris.',
        'Multi-threaded scanning engine with instant disk space reclamation reports.'
      ],
      stack: ['TypeScript', 'Electron', 'Node.js', 'Desktop App'],
      repo: 'https://github.com/raihan12121/PC-Cleaner-Desktop-App',
      demo: null
    },
    'messageme': {
      title: '💬 MessageMe Android App',
      badge: 'Mobile Application',
      description: 'Modern real-time messaging application for Android with intuitive chat interface, end-to-end communication, and secure offline storage.',
      architecture: [
        'Native Java Android application utilizing Android SDK and Material Design.',
        'Real-time message synchronization with background push notifications.',
        'Local SQLite caching for lightning-fast offline message access.'
      ],
      stack: ['Java', 'Android SDK', 'SQLite', 'Mobile UI'],
      repo: 'https://github.com/raihan12121/MessageMe--A-Messaging-Application-for-Android-Platform',
      demo: null
    },
    'air-pollution': {
      title: '📈 Air Pollution Prediction Model',
      badge: 'Machine Learning & Time-Series',
      description: 'Machine learning model predicting Air Quality Index (AQI) and PM2.5 concentrations based on historical environmental and meteorological sensor datasets.',
      architecture: [
        'Feature engineering on multivariate time-series data with Pandas and Scikit-Learn.',
        'Ensemble regression models (XGBoost, Random Forest) with hyperparameter optimization.',
        'Interactive Jupyter Notebook visualizations of pollutant correlations.'
      ],
      stack: ['Python', 'Jupyter', 'Scikit-Learn', 'Pandas', 'Data Science'],
      repo: 'https://github.com/raihan12121/Air-Polution-prediction',
      demo: null
    }
  };

  const projectModal = document.getElementById('project-modal');
  const projectModalContent = document.getElementById('project-modal-body');
  const projectModalClose = document.getElementById('project-modal-close');
  const detailButtons = document.querySelectorAll('.btn-details-modal');

  function openProjectModal(projectId) {
    const data = PROJECT_DATA[projectId];
    if (!data || !projectModal || !projectModalContent) return;

    projectModalContent.innerHTML = `
      <div style="margin-bottom: 1.5rem;">
        <span class="section-tag" style="margin-bottom: 0.5rem;">${data.badge}</span>
        <h2 style="font-size: 1.75rem; margin-bottom: 0.75rem;">${data.title}</h2>
        <p style="color: var(--text-secondary); line-height: 1.7;">${data.description}</p>
      </div>

      <div style="margin-bottom: 1.5rem;">
        <h4 style="font-size: 1.1rem; margin-bottom: 0.75rem; color: var(--primary-accent);">Key Engineering Highlights & Architecture</h4>
        <ul style="display: flex; flex-direction: column; gap: 0.6rem; color: #cbd5e1; font-size: 0.925rem;">
          ${data.architecture.map(item => `
            <li style="display: flex; gap: 0.6rem; align-items: flex-start;">
              <span style="color: var(--primary-accent); margin-top: 2px;">⚡</span>
              <span>${item}</span>
            </li>
          `).join('')}
        </ul>
      </div>

      <div style="margin-bottom: 2rem;">
        <h4 style="font-size: 1rem; margin-bottom: 0.6rem; color: var(--text-secondary);">Tech Stack</h4>
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
          ${data.stack.map(s => `<span class="tech-tag" style="padding: 0.3rem 0.7rem; font-size: 0.8rem;">${s}</span>`).join('')}
        </div>
      </div>

      <div style="display: flex; gap: 1rem; flex-wrap: wrap; padding-top: 1.25rem; border-top: 1px solid var(--border-subtle);">
        <a href="${data.repo}" target="_blank" class="btn btn-primary" style="padding: 0.65rem 1.3rem;">
          <svg style="width: 18px; height: 18px; fill: currentColor;" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
          View Source Repository
        </a>
        ${data.demo ? `
          <a href="${data.demo}" target="_blank" class="btn btn-secondary" style="padding: 0.65rem 1.3rem;">
            🌐 Open Live Application
          </a>
        ` : ''}
      </div>
    `;

    projectModal.classList.add('open');
  }

  detailButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = btn.getAttribute('data-project-id');
      if (id) openProjectModal(id);
    });
  });

  projectModalClose?.addEventListener('click', () => {
    projectModal?.classList.remove('open');
  });

  projectModal?.addEventListener('click', (e) => {
    if (e.target === projectModal) {
      projectModal.classList.remove('open');
    }
  });

  /* --- 8. Contact Form Handling --- */
  const contactForm = document.getElementById('contact-form');
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('contact-name')?.value;
    const email = document.getElementById('contact-email')?.value;
    const subject = document.getElementById('contact-subject')?.value;
    const message = document.getElementById('contact-message')?.value;

    if (!name || !email || !message) {
      showToast('⚠️ Please fill in all required fields.');
      return;
    }

    // Compose mailto
    const mailtoUrl = `mailto:mdraihan2328@gmail.com?subject=${encodeURIComponent(subject || 'Portfolio Inquiry from ' + name)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;

    window.location.href = mailtoUrl;

    showToast('🚀 Opening your email client to send message!');
    contactForm.reset();
  });

  /* --- 9. Copy Email Button --- */
  const copyEmailBtns = document.querySelectorAll('.copy-email-btn');
  copyEmailBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      navigator.clipboard.writeText('mdraihan2328@gmail.com').then(() => {
        showToast('📋 Copied email: mdraihan2328@gmail.com');
      }).catch(() => {
        showToast('Email: mdraihan2328@gmail.com');
      });
    });
  });

  /* --- 10. Live Dhaka Clock --- */
  const clockElement = document.getElementById('dhaka-clock');
  function updateClock() {
    if (!clockElement) return;
    const now = new Date();
    const options = {
      timeZone: 'Asia/Dhaka',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    clockElement.textContent = now.toLocaleTimeString('en-US', options) + ' (Dhaka, UTC+6)';
  }
  setInterval(updateClock, 1000);
  updateClock();

  /* --- 11. Toast Notification System --- */
  function showToast(message) {
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.className = 'toast-container';
      document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // Smooth Back to Top
  const backToTopBtn = document.getElementById('back-to-top');
  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});
