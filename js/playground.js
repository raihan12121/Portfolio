/**
 * Interactive AI & Knowledge Graph / RAG Playground Visualizer
 * Simulates Vector Embedding, Cosine Similarity, and Multi-Hop Knowledge Graph Reasoning
 */

(function () {
  const queryInput = document.getElementById('rag-query-input');
  const runBtn = document.getElementById('btn-run-rag');
  const resultsContainer = document.getElementById('rag-results-list');
  const canvas = document.getElementById('graph-visualizer-canvas');
  const samplePills = document.querySelectorAll('.sample-query-pill');

  if (!canvas || !resultsContainer) return;

  const ctx = canvas.getContext('2d');
  let width, height;

  // Knowledge base nodes and documents
  const KNOWLEDGE_BASE = [
    {
      id: 'doc-1',
      title: '⚡ Self-Route Local Engine (Rust)',
      content: 'Zero-latency local LLM inference via custom Rust bindings on CPU/GPU, eliminating cloud API costs and keeping weights local.',
      tags: ['rust', 'llm', 'inference', 'systems', 'local-ai'],
      category: 'systems'
    },
    {
      id: 'doc-2',
      title: '🧠 TERRA Temporal Graph RAG',
      content: 'Combines dense vector retrieval (ChromaDB) with topological temporal knowledge graph walks to resolve multi-hop queries.',
      tags: ['rag', 'chromadb', 'graph', 'temporal', 'reasoning', 'python'],
      category: 'ai'
    },
    {
      id: 'doc-3',
      title: '🛡️ CyberLearn Attack Vectors & Defense',
      content: 'Interactive vulnerability labs exploring XSS, SQLi, CSRF, and defensive secure coding patterns with Next.js & TypeScript.',
      tags: ['security', 'cybersecurity', 'typescript', 'react', 'web'],
      category: 'web'
    },
    {
      id: 'doc-4',
      title: '🩻 LungDx Diagnostic Vision Architecture',
      content: 'Convolutional neural networks and vision transformers trained on chest X-ray datasets for early-stage lung nodule detection.',
      tags: ['pytorch', 'vision', 'medical-ai', 'cnn', 'cancer', 'python'],
      category: 'ai'
    },
    {
      id: 'doc-5',
      title: '🌌 Incursion Relativistic Simulation',
      content: 'Ray-marching numerical physics solving gravitational lensing around Schwarzschild and Kerr black holes using NumPy.',
      tags: ['physics', 'numpy', 'simulation', 'astrophysics', 'python'],
      category: 'sim'
    }
  ];

  // Graph nodes for visualization
  let graphNodes = [
    { id: 'query', label: 'Query', x: 0.15, y: 0.5, type: 'query', active: false },
    { id: 'chroma', label: 'ChromaDB Vector', x: 0.45, y: 0.25, type: 'vector', active: false },
    { id: 'graph', label: 'Temporal Graph', x: 0.45, y: 0.75, type: 'graph', active: false },
    { id: 'reason', label: 'Multi-Hop Trace', x: 0.75, y: 0.35, type: 'reasoning', active: false },
    { id: 'synthesis', label: 'LLM Response', x: 0.88, y: 0.65, type: 'output', active: false }
  ];

  function resizeGraphCanvas() {
    width = canvas.width = canvas.parentElement.clientWidth;
    height = canvas.height = 240;
    drawGraph();
  }

  function drawGraph() {
    ctx.clearRect(0, 0, width, height);

    const themeAccent = getComputedStyle(document.documentElement).getPropertyValue('--primary-accent').trim() || '#00f0ff';

    // Draw Edges
    const edges = [
      ['query', 'chroma'],
      ['query', 'graph'],
      ['chroma', 'reason'],
      ['graph', 'reason'],
      ['reason', 'synthesis']
    ];

    edges.forEach(([fromId, toId]) => {
      const fromNode = graphNodes.find(n => n.id === fromId);
      const toNode = graphNodes.find(n => n.id === toId);

      const x1 = fromNode.x * width;
      const y1 = fromNode.y * height;
      const x2 = toNode.x * width;
      const y2 = toNode.y * height;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = (fromNode.active && toNode.active) ? themeAccent : 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = (fromNode.active && toNode.active) ? 2.5 : 1;
      ctx.stroke();
    });

    // Draw Nodes
    graphNodes.forEach(node => {
      const nx = node.x * width;
      const ny = node.y * height;
      const radius = node.active ? 16 : 12;

      ctx.beginPath();
      ctx.arc(nx, ny, radius, 0, Math.PI * 2);
      ctx.fillStyle = node.active ? themeAccent : 'rgba(26, 38, 68, 0.9)';
      ctx.fill();
      ctx.strokeStyle = node.active ? '#ffffff' : 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Node label
      ctx.fillStyle = node.active ? '#ffffff' : '#94a3b8';
      ctx.font = node.active ? 'bold 11px Inter, sans-serif' : '10px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(node.label, nx, ny + radius + 15);
    });
  }

  function calculateSimilarity(query, doc) {
    const qTokens = query.toLowerCase().split(/\W+/).filter(t => t.length > 2);
    let matchCount = 0;

    qTokens.forEach(t => {
      if (doc.tags.includes(t) || doc.title.toLowerCase().includes(t) || doc.content.toLowerCase().includes(t)) {
        matchCount += 1.8;
      }
    });

    const baseScore = 0.55 + (matchCount * 0.11) + (Math.random() * 0.05);
    return Math.min(0.99, Number(baseScore.toFixed(3)));
  }

  function executeRetrieval(query) {
    if (!query.trim()) return;

    // Trigger visual graph sequence
    graphNodes.forEach(n => n.active = false);
    drawGraph();

    // Step 1: Query activation
    graphNodes[0].active = true;
    drawGraph();

    setTimeout(() => {
      // Step 2: Vector & Graph
      graphNodes[1].active = true;
      graphNodes[2].active = true;
      drawGraph();
    }, 200);

    setTimeout(() => {
      // Step 3: Multi-hop reasoning
      graphNodes[3].active = true;
      drawGraph();
    }, 450);

    setTimeout(() => {
      // Step 4: Final synthesis
      graphNodes[4].active = true;
      drawGraph();
    }, 700);

    // Compute ranked matches
    const scoredDocs = KNOWLEDGE_BASE.map(doc => {
      return {
        ...doc,
        similarity: calculateSimilarity(query, doc)
      };
    }).sort((a, b) => b.similarity - a.similarity);

    // Render results
    resultsContainer.innerHTML = '';

    scoredDocs.slice(0, 3).forEach((item, idx) => {
      const card = document.createElement('div');
      card.className = 'retrieval-item';
      card.innerHTML = `
        <div class="retrieval-item-score">
          <span>Rank #${idx + 1}</span> • <span>Cosine Similarity: ${item.similarity}</span>
        </div>
        <div style="font-weight: 600; color: #f8fafc; margin-bottom: 3px;">${item.title}</div>
        <div style="color: #94a3b8; font-size: 0.8rem; line-height: 1.5;">${item.content}</div>
        <div style="display: flex; gap: 4px; margin-top: 6px;">
          ${item.tags.slice(0, 4).map(t => `<span class="tech-tag" style="font-size: 0.68rem;">#${t}</span>`).join('')}
        </div>
      `;
      resultsContainer.appendChild(card);
    });
  }

  // Events
  if (runBtn && queryInput) {
    runBtn.addEventListener('click', () => {
      executeRetrieval(queryInput.value);
    });

    queryInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        executeRetrieval(queryInput.value);
      }
    });
  }

  samplePills.forEach(pill => {
    pill.addEventListener('click', () => {
      const q = pill.getAttribute('data-query');
      if (q && queryInput) {
        queryInput.value = q;
        executeRetrieval(q);
      }
    });
  });

  window.addEventListener('resize', resizeGraphCanvas);

  // Initial setup
  setTimeout(() => {
    resizeGraphCanvas();
    if (queryInput) {
      executeRetrieval(queryInput.value || 'Local LLM inference in Rust and Knowledge Graphs');
    }
  }, 100);
})();
