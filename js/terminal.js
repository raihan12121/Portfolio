/**
 * Developer Command-Line Terminal & Command Palette Emulator
 * Accessible via Header Button or Keyboard Shortcut: Ctrl + K / Cmd + K
 */

(function () {
  const terminalOverlay = document.getElementById('terminal-modal');
  const terminalInput = document.getElementById('terminal-cmd-input');
  const terminalOutput = document.getElementById('terminal-output');
  const terminalCloseBtn = document.getElementById('terminal-close-btn');
  const terminalOpenBtns = document.querySelectorAll('.open-terminal-btn');

  if (!terminalOverlay || !terminalInput || !terminalOutput) return;

  let commandHistory = [];
  let historyIndex = -1;

  const COMMANDS = {
    help: `Available Commands:
  <span class="syntax-keyword">about</span>        - Learn about Muhammad Raihan Molla
  <span class="syntax-keyword">skills</span>       - List AI/ML, Systems, and Web tech stack
  <span class="syntax-keyword">projects</span>     - Browse featured repositories and research works
  <span class="syntax-keyword">contact</span>      - Get email, location, and contact options
  <span class="syntax-keyword">socials</span>      - Links to GitHub, LinkedIn, LeetCode, Codeforces
  <span class="syntax-keyword">theme</span> [name] - Switch palette (<span class="syntax-string">cyan</span>, <span class="syntax-string">emerald</span>, <span class="syntax-string">purple</span>, <span class="syntax-string">amber</span>)
  <span class="syntax-keyword">resume</span>       - View quick resume summary & details
  <span class="syntax-keyword">whoami</span>       - Display visitor session details
  <span class="syntax-keyword">matrix</span>       - Toggle ASCII matrix effect
  <span class="syntax-keyword">clear</span>        - Clear the terminal screen
  <span class="syntax-keyword">exit</span>         - Close the terminal window`,

    about: `<span class="syntax-type">Name:</span> Muhammad Raihan Molla
<span class="syntax-type">Role:</span> AI & Machine Learning Engineer | Systems Developer (Rust/C++)
<span class="syntax-type">Education:</span> B.Sc. in Computer Science & Engineering @ BUBT (Dhaka, Bangladesh)
<span class="syntax-type">Specialization:</span> Deep Learning, Computer Vision, Local LLM Inference, Temporal RAG
<span class="syntax-type">Philosophy:</span> "Code. Train. Build Impact."`,

    skills: `<span class="syntax-fn">AI & Machine Learning:</span>
  PyTorch, TensorFlow, Scikit-Learn, OpenCV, ChromaDB, Hugging Face, Knowledge Graphs
<span class="syntax-fn">Languages & Systems:</span>
  Rust (LLM Engines), Python (DL/CV), C++ (Problem Solving & OOP), C, Java (Android), TypeScript, SQL
<span class="syntax-fn">Web & Full-Stack:</span>
  Next.js, React, Node.js, Express, Tailwind CSS, REST APIs, WebSockets
<span class="syntax-fn">Tools & Platforms:</span>
  Git, GitHub, Linux/WSL, Docker, Android Studio, Vercel, VS Code`,

    projects: `<span class="syntax-string">1. Self-Route (SelfAPI)</span> [Rust]
   High-performance local LLM inference engine & secure API gateway on local GPU/CPU.
<span class="syntax-string">2. TERRA RAG</span> [Python, ChromaDB]
   Temporal Graph Evolution & Multi-Hop Reasoning-Trace Indexation framework.
<span class="syntax-string">3. CyberLearn</span> [TypeScript, Next.js]
   Interactive Cybersecurity Learning & Vulnerability Playground.
<span class="syntax-string">4. LungDx AI</span> [PyTorch, CV]
   Cross-platform diagnostic tool detecting lung cancer from chest X-rays.
<span class="syntax-string">5. Incursion Simulation</span> [Python, NumPy]
   Relativistic Black Hole Gravitational Lensing & Big Bang Inflation simulator.
<span class="syntax-string">6. PC Cleaner Desktop</span> [TypeScript, Electron]
   Windows disk cache cleaner & optimization app.`,

    contact: `<span class="syntax-type">Email:</span> <a href="mailto:mdraihan2328@gmail.com" class="syntax-string">mdraihan2328@gmail.com</a>
<span class="syntax-type">Location:</span> Mirpur, Dhaka, Bangladesh
<span class="syntax-type">University:</span> Bangladesh University of Business & Technology (BUBT)
<span class="syntax-type">Status:</span> Open for AI/ML Engineering & Systems Architecture roles.`,

    socials: `<span class="syntax-type">GitHub:</span>     <a href="https://github.com/raihan12121" target="_blank" class="syntax-fn">github.com/raihan12121</a>
<span class="syntax-type">LinkedIn:</span>   <a href="https://linkedin.com/in/raihanx009" target="_blank" class="syntax-fn">linkedin.com/in/raihanx009</a>
<span class="syntax-type">LeetCode:</span>   <a href="https://leetcode.com/raihan009" target="_blank" class="syntax-fn">leetcode.com/raihan009</a>
<span class="syntax-type">Codeforces:</span> <a href="https://codeforces.com/profile/raihan12121" target="_blank" class="syntax-fn">codeforces.com/profile/raihan12121</a>
<span class="syntax-type">YouTube:</span>    <a href="https://youtube.com/@raihan-the-panda" target="_blank" class="syntax-fn">youtube.com/@raihan-the-panda</a>`,

    resume: `<span class="syntax-type">=== Muhammad Raihan Molla | Resume Summary ===</span>
<span class="syntax-fn">Education:</span> B.Sc in CSE, BUBT (Undergraduate)
<span class="syntax-fn">Experience:</span> AI/ML Systems Builder, Open Source Contributor
<span class="syntax-fn">Key Projects:</span> Self-Route (Rust), TERRA RAG (Python), CyberLearn (Next.js)
<span class="syntax-fn">Achievements:</span> 500+ Solved Algorithm Problems, 16+ GitHub Repositories
<span class="syntax-comment">Tip: Click "Get Resume" in the navigation bar to download full PDF.</span>`,

    whoami: `<span class="syntax-string">guest@raihan-portfolio:~$</span> You are an explorer visiting Muhammad Raihan's portfolio. Enjoy testing the terminal!`,

    sudo: `<span class="syntax-keyword">Permission denied:</span> Nice try! Only Muhammad Raihan has root access to this system 🚀`,

    matrix: `<span class="syntax-string">Wake up, Neo... Follow the white rabbit. 🐇</span>`
  };

  function printLine(htmlContent, isCommand = false, cmdText = '') {
    const line = document.createElement('div');
    line.className = 'terminal-line';
    if (isCommand) {
      line.innerHTML = `<span class="terminal-prompt">raihan@dev:~$</span> <span class="syntax-fn">${escapeHtml(cmdText)}</span>`;
    } else {
      line.innerHTML = htmlContent;
    }
    terminalOutput.appendChild(line);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function handleCommand(rawInput) {
    const input = rawInput.trim();
    if (!input) return;

    commandHistory.push(input);
    historyIndex = commandHistory.length;

    printLine('', true, input);

    const parts = input.split(' ');
    const cmd = parts[0].toLowerCase();
    const arg = parts[1] ? parts[1].toLowerCase() : '';

    if (cmd === 'clear') {
      terminalOutput.innerHTML = '';
      return;
    }

    if (cmd === 'exit') {
      closeTerminal();
      return;
    }

    if (cmd === 'theme') {
      const validThemes = ['cyan', 'emerald', 'purple', 'amber'];
      if (!arg || !validThemes.includes(arg)) {
        printLine(`<span class="syntax-keyword">Usage:</span> theme &lt;cyan | emerald | purple | amber&gt;`);
      } else {
        document.documentElement.setAttribute('data-accent', arg);
        localStorage.setItem('portfolio-accent', arg);
        printLine(`<span class="syntax-string">Theme updated to ${arg.toUpperCase()} successfully!</span>`);
      }
      return;
    }

    if (COMMANDS[cmd]) {
      printLine(COMMANDS[cmd]);
    } else {
      printLine(`<span class="syntax-keyword">command not found:</span> ${escapeHtml(cmd)}. Type <span class="syntax-fn">'help'</span> for a list of commands.`);
    }
  }

  function openTerminal() {
    terminalOverlay.classList.add('open');
    setTimeout(() => terminalInput.focus(), 100);
  }

  function closeTerminal() {
    terminalOverlay.classList.remove('open');
  }

  // Event Listeners
  terminalOpenBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openTerminal();
    });
  });

  if (terminalCloseBtn) {
    terminalCloseBtn.addEventListener('click', closeTerminal);
  }

  terminalOverlay.addEventListener('click', (e) => {
    if (e.target === terminalOverlay) {
      closeTerminal();
    }
  });

  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = terminalInput.value;
      terminalInput.value = '';
      handleCommand(val);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        terminalInput.value = commandHistory[historyIndex] || '';
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        terminalInput.value = commandHistory[historyIndex] || '';
      } else {
        historyIndex = commandHistory.length;
        terminalInput.value = '';
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const current = terminalInput.value.trim().toLowerCase();
      if (current) {
        const matches = Object.keys(COMMANDS).concat(['theme', 'clear', 'exit']).filter(c => c.startsWith(current));
        if (matches.length === 1) {
          terminalInput.value = matches[0];
        }
      }
    }
  });

  // Global Keyboard Shortcut: Ctrl+K / Cmd+K
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (terminalOverlay.classList.contains('open')) {
        closeTerminal();
      } else {
        openTerminal();
      }
    } else if (e.key === 'Escape' && terminalOverlay.classList.contains('open')) {
      closeTerminal();
    }
  });
})();
