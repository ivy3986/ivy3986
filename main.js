class LottoGenerator extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.numbers = [];
    this.isDrawing = false;
  }

  connectedCallback() {
    this.initialRender();
  }

  generateNumbers() {
    if (this.isDrawing) return;
    this.isDrawing = true;
    
    this.numbers = [];
    this.updateUI();

    const result = new Set();
    while (result.size < 6) {
      result.add(Math.floor(Math.random() * 45) + 1);
    }
    
    const sortedNumbers = Array.from(result).sort((a, b) => a - b);
    
    sortedNumbers.forEach((num, index) => {
      setTimeout(() => {
        this.numbers.push(num);
        this.updateUI();
        if (this.numbers.length === 6) {
          this.isDrawing = false;
          this.updateUI(); // One final update to enable button
        }
      }, (index + 1) * 300);
    });
  }

  getBallColor(num) {
    if (num <= 10) return 'oklch(75% 0.15 80)';   // Yellow-ish
    if (num <= 20) return 'oklch(65% 0.2 240)';  // Blue-ish
    if (num <= 30) return 'oklch(60% 0.2 20)';   // Red-ish
    if (num <= 40) return 'oklch(55% 0.05 0)';   // Gray-ish
    return 'oklch(70% 0.2 140)';                // Green-ish
  }

  updateUI() {
    const container = this.shadowRoot.querySelector('.balls-container');
    const button = this.shadowRoot.querySelector('#drawBtn');
    
    if (!container || !button) return;

    const ballHtml = this.numbers.map(num => `
      <div class="ball" style="--ball-color: ${this.getBallColor(num)}">
        ${num}
      </div>
    `).join('');

    const placeholders = Array(6 - this.numbers.length).fill(0).map(() => `
      <div class="ball placeholder">?</div>
    `).join('');

    container.innerHTML = ballHtml + placeholders;
    
    button.disabled = this.isDrawing;
    button.textContent = this.isDrawing ? '추첨 중...' : '행운의 번호 추첨';
  }

  initialRender() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          perspective: 1000px;
        }

        .card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 3rem 2rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2.5rem;
          transition: transform 0.3s ease;
        }

        .card:hover {
          transform: translateY(-5px);
        }

        .balls-container {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 1rem;
          min-height: 80px;
        }

        .ball {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 1.5rem;
          color: white;
          background: var(--ball-color, #333);
          box-shadow: 
            inset -4px -4px 8px rgba(0,0,0,0.3),
            inset 4px 4px 8px rgba(255,255,255,0.2),
            0 10px 20px -5px var(--ball-color);
          animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        .ball.placeholder {
          background: rgba(255, 255, 255, 0.05);
          color: rgba(255, 255, 255, 0.2);
          box-shadow: none;
          border: 2px dashed rgba(255, 255, 255, 0.1);
          animation: none;
        }

        @keyframes popIn {
          from { transform: scale(0) rotate(-180deg); opacity: 0; }
          to { transform: scale(1) rotate(0); opacity: 1; }
        }

        button {
          padding: 1rem 3rem;
          font-size: 1.25rem;
          font-weight: 700;
          border-radius: 100px;
          border: none;
          background: linear-gradient(135deg, oklch(70% 0.2 180), oklch(60% 0.2 280));
          color: white;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 0 20px rgba(100, 200, 255, 0.3);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        button:hover:not(:disabled) {
          transform: scale(1.05);
          box-shadow: 0 0 30px rgba(100, 200, 255, 0.5);
          filter: brightness(1.1);
        }

        button:active:not(:disabled) {
          transform: scale(0.95);
        }

        button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          filter: grayscale(0.5);
        }

        @media (max-width: 480px) {
          .ball {
            width: 50px;
            height: 50px;
            font-size: 1.2rem;
          }
          .card {
            padding: 2rem 1rem;
          }
        }
      </style>
      
      <div class="card">
        <div class="balls-container">
          <div class="ball placeholder">?</div>
          <div class="ball placeholder">?</div>
          <div class="ball placeholder">?</div>
          <div class="ball placeholder">?</div>
          <div class="ball placeholder">?</div>
          <div class="ball placeholder">?</div>
        </div>
        <button id="drawBtn">행운의 번호 추첨</button>
      </div>
    `;

    this.shadowRoot.querySelector('#drawBtn').addEventListener('click', () => this.generateNumbers());
  }
}

customElements.define('lotto-generator', LottoGenerator);
