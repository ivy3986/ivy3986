class ContentGenerator extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.videoSrc = null;
    this.isProcessing = false;
    this.progress = 0;
    this.result = null;
  }

  connectedCallback() {
    this.render();
  }

  handleFileUpload(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('video/')) {
      this.videoSrc = URL.createObjectURL(file);
      this.isProcessing = true;
      this.progress = 0;
      this.result = null;
      this.render();
      this.startAnalysis();
    } else {
      alert('올바른 동영상 파일을 선택해주세요.');
    }
  }

  async startAnalysis() {
    const steps = ['비디오 데이터 분석 중...', '제품 특징 추출 중...', '쿠팡 데이터베이스 조회 중...', '최적의 설명글 생성 중...'];
    
    for (let i = 0; i <= 100; i += 2) {
      this.progress = i;
      const stepIndex = Math.min(Math.floor(i / 25), steps.length - 1);
      this.currentStep = steps[stepIndex];
      this.updateProgressUI();
      await new Promise(r => setTimeout(r, 60)); // Simulate work
    }

    this.isProcessing = false;
    this.generateMockResult();
    this.render();
  }

  generateMockResult() {
    this.result = {
      productName: '프리미엄 무선 소음 제거 헤드폰',
      description: [
        '🎧 이거 진짜 써본 사람만 앎... 노캔 성능 실화냐? 🤯',
        '슥- 끼는 순간 세상이랑 단절됨 ㅋㅋ 나만의 힐링 공간 완성! ✨',
        '삶의 질 수직 상승템이라 이건 안 사면 무조건 손해임 ㅠㅠ 🚀'
      ],
      link: 'https://link.coupang.com/a/random-affiliate-link'
    };
  }

  updateProgressUI() {
    const bar = this.shadowRoot.querySelector('.progress-bar-fill');
    const text = this.shadowRoot.querySelector('.status-text');
    if (bar) bar.style.width = `${this.progress}%`;
    if (text) text.textContent = this.currentStep;
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          animation: slideIn 0.8s cubic-bezier(0.1, 0.9, 0.2, 1);
        }

        .container {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 32px;
          padding: 3rem;
          box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.6);
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }

        .upload-zone {
          border: 2px dashed rgba(255, 255, 255, 0.15);
          border-radius: 24px;
          padding: 3rem;
          cursor: pointer;
          transition: all 0.3s ease;
          background: rgba(255, 255, 255, 0.02);
        }

        .upload-zone:hover {
          border-color: oklch(75% 0.15 190);
          background: rgba(255, 255, 255, 0.05);
          transform: translateY(-2px);
        }

        .upload-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          display: block;
        }

        input[type="file"] {
          display: none;
        }

        video {
          width: 100%;
          max-height: 400px;
          border-radius: 16px;
          background: black;
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }

        .progress-container {
          width: 100%;
          background: rgba(255, 255, 255, 0.05);
          height: 12px;
          border-radius: 6px;
          overflow: hidden;
          margin: 2rem 0;
        }

        .progress-bar-fill {
          height: 100%;
          width: 0%;
          background: linear-gradient(90deg, oklch(75% 0.15 190), oklch(65% 0.2 330));
          transition: width 0.1s ease;
        }

        .status-text {
          color: oklch(80% 0.05 260);
          font-size: 1rem;
          font-weight: 500;
        }

        .result-card {
          text-align: left;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 2.5rem;
          animation: popIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .product-title {
          font-size: 1.5rem;
          font-weight: 800;
          margin-bottom: 1.5rem;
          color: oklch(90% 0.1 190);
        }

        .description-line {
          font-size: 1.1rem;
          margin-bottom: 0.75rem;
          line-height: 1.6;
          color: oklch(95% 0.01 260);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .link-container {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .link-badge {
          display: inline-flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.08);
          padding: 0.75rem 1.25rem;
          border-radius: 12px;
          font-family: monospace;
          color: oklch(85% 0.15 150);
          word-break: break-all;
          margin-bottom: 1rem;
          width: 100%;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .copy-btn {
          width: 100%;
          padding: 1.25rem;
          border-radius: 16px;
          border: none;
          background: linear-gradient(135deg, oklch(75% 0.15 190), oklch(65% 0.2 330));
          color: white;
          font-weight: 800;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .copy-btn:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
          filter: brightness(1.1);
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes popIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      </style>
      
      <div class="container">
        ${!this.videoSrc ? `
          <div class="upload-zone" id="dropZone">
            <span class="upload-icon">📹</span>
            <h2>동영상을 업로드하세요</h2>
            <p>AI가 제품을 분석하여 최적의 홍보글을 만들어드립니다</p>
            <input type="file" id="fileInput" accept="video/*">
          </div>
        ` : `
          <video src="${this.videoSrc}" controls></video>
          
          ${this.isProcessing ? `
            <div class="processing-area">
              <div class="progress-container">
                <div class="progress-bar-fill"></div>
              </div>
              <p class="status-text">${this.currentStep || '분석 준비 중...'}</p>
            </div>
          ` : ''}

          ${this.result ? `
            <div class="result-card">
              <div class="product-title">📦 분석된 제품: ${this.result.productName}</div>
              <div class="description-group">
                ${this.result.description.map(line => `<div class="description-line">${line}</div>`).join('')}
              </div>
              
              <div class="link-container">
                <p style="margin-bottom: 0.5rem; font-size: 0.9rem; opacity: 0.7;">파트너스 단축 링크:</p>
                <div class="link-badge">${this.result.link}</div>
                <button class="copy-btn" id="copyBtn">스레드에 바로 붙여넣기</button>
              </div>
            </div>
          ` : ''}
          
          ${!this.isProcessing ? `
            <button class="copy-btn" style="background: rgba(255,255,255,0.05); margin-top: 1rem;" onclick="location.reload()">새 동영상 업로드</button>
          ` : ''}
        `}
      </div>
    `;

    this.setupEventListeners();
  }

  setupEventListeners() {
    const dropZone = this.shadowRoot.querySelector('#dropZone');
    const fileInput = this.shadowRoot.querySelector('#fileInput');
    const copyBtn = this.shadowRoot.querySelector('#copyBtn');

    if (dropZone) {
      dropZone.onclick = () => fileInput.click();
    }

    if (fileInput) {
      fileInput.onchange = (e) => this.handleFileUpload(e);
    }

    if (copyBtn) {
      copyBtn.onclick = () => {
        const textToCopy = `${this.result.description.join('\n')}\n\n👉 구매 링크: ${this.result.link}`;
        navigator.clipboard.writeText(textToCopy);
        copyBtn.textContent = '✅ 복사 완료!';
        setTimeout(() => {
          copyBtn.textContent = '스레드에 바로 붙여넣기';
        }, 2000);
      };
    }
  }
}

customElements.define('content-generator', ContentGenerator);
