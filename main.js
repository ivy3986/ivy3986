class ContentGenerator extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.videoSrc = null;
    this.isProcessing = false;
    this.progress = 0;
    this.result = null;
    this.showSettings = false;
    
    // Load API Keys
    this.apiKeys = JSON.parse(localStorage.getItem('coupang_api_keys') || '{"accessKey": "", "secretKey": "", "afId": ""}');
  }

  connectedCallback() {
    this.render();
  }

  toggleSettings() {
    this.showSettings = !this.showSettings;
    this.render();
  }

  saveKeys(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    this.apiKeys = {
      accessKey: formData.get('accessKey'),
      secretKey: formData.get('secretKey'),
      afId: formData.get('afId')
    };
    localStorage.setItem('coupang_api_keys', JSON.stringify(this.apiKeys));
    this.showSettings = false;
    this.render();
    alert('설정이 저장되었습니다!');
  }

  handleFileUpload(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('video/')) {
      this.videoSrc = URL.createObjectURL(file);
      this.fileName = file.name; // Use file name as a hint for product identification
      this.isProcessing = true;
      this.progress = 0;
      this.result = null;
      this.render();
      this.startAnalysis();
    }
  }

  async startAnalysis() {
    const steps = ['비디오 데이터 분석 중...', '프레임 상품 추출 중...', '쿠팡 API 실시간 조회 중...', '수익 링크 생성 중...'];
    
    for (let i = 0; i <= 100; i += 2) {
      this.progress = i;
      const stepIndex = Math.min(Math.floor(i / 25), steps.length - 1);
      this.currentStep = steps[stepIndex];
      this.updateProgressUI();
      await new Promise(r => setTimeout(r, 40));
    }

    this.isProcessing = false;
    this.generateResult();
    this.render();
  }

  generateResult() {
    // 상품명 추출 (파일명에서 확장자 제거 및 특수문자 정리)
    let inferredProduct = this.fileName.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
    if (inferredProduct.length < 2) inferredProduct = "영상 속 꿀템";

    // MZ 말투 템플릿
    const templates = [
      {
        desc: [
          `🔥 이거 진짜 영상 보자마자 반함... ${inferredProduct} 실화냐? 🤯`,
          `품절 대란이라 구하기 힘든 건데 여기서 찾음 ㅋㅋ 진짜 대박임 ✨`,
          `삶의 질 수직 상승하고 싶으면 고민 말고 바로 고고하세요 🚀`
        ]
      },
      {
        desc: [
          `👀 영상 속 그 제품 궁금했던 사람? 바로 ${inferredProduct} 이거임!`,
          `디자인부터 성능까지 미쳤음... 안 사면 무조건 손해 각 ㅠㅠ 🤣`,
          `지금 세일 중이라 가격도 혜자임! 여행 갈 때 필수템 등극 ✨`
        ]
      }
    ];

    const selected = templates[Math.floor(Math.random() * templates.length)];

    // 실제 API 연동 시에는 여기서 fetch를 보냄
    // 현재는 AF ID가 포함된 시뮬레이션 링크 생성
    const affiliateLink = `https://link.coupang.com/a/${this.apiKeys.afId || 'default-link'}?subId=threads`;

    this.result = {
      productName: inferredProduct,
      description: selected.desc,
      link: affiliateLink
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
        :host { display: block; width: 100%; font-family: 'Pretendard', sans-serif; }
        .container {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 32px;
          padding: 2.5rem;
          box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.6);
          position: relative;
        }
        .settings-btn {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          opacity: 0.5;
          transition: opacity 0.3s;
        }
        .settings-btn:hover { opacity: 1; }
        
        .upload-zone {
          border: 2px dashed rgba(255, 255, 255, 0.2);
          border-radius: 24px;
          padding: 4rem 2rem;
          cursor: pointer;
          transition: 0.3s;
          text-align: center;
        }
        .upload-zone:hover { border-color: oklch(75% 0.15 190); background: rgba(255,255,255,0.03); }
        
        video { width: 100%; border-radius: 16px; margin-bottom: 2rem; }
        
        .result-card {
          background: rgba(0,0,0,0.2);
          padding: 2rem;
          border-radius: 24px;
          text-align: left;
          border: 1px solid rgba(255,255,255,0.05);
        }
        .product-name { color: oklch(85% 0.15 190); font-weight: 800; font-size: 1.2rem; margin-bottom: 1rem; }
        .desc-line { margin-bottom: 0.5rem; color: #fff; line-height: 1.6; }
        
        .link-box {
          background: rgba(255,255,255,0.05);
          padding: 1rem;
          border-radius: 12px;
          font-size: 0.9rem;
          color: oklch(80% 0.1 150);
          margin: 1.5rem 0;
          word-break: break-all;
        }

        .btn {
          width: 100%;
          padding: 1.25rem;
          border-radius: 16px;
          border: none;
          background: linear-gradient(135deg, oklch(75% 0.15 190), oklch(65% 0.2 330));
          color: white;
          font-weight: 800;
          cursor: pointer;
          transition: 0.3s;
        }
        .btn:hover { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(0,0,0,0.3); }

        .settings-panel {
          position: absolute;
          inset: 0;
          background: rgba(15, 15, 25, 0.95);
          z-index: 10;
          border-radius: 32px;
          padding: 2.5rem;
          display: flex;
          flex-direction: column;
        }
        input {
          width: 100%;
          padding: 1rem;
          margin-bottom: 1rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          color: white;
        }
        label { display: block; margin-bottom: 0.5rem; font-size: 0.9rem; color: #aaa; }

        .progress-bar { height: 8px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden; margin-bottom: 1rem; }
        .progress-bar-fill { height: 100%; background: oklch(75% 0.15 190); transition: 0.1s; }
      </style>

      <div class="container">
        <button class="settings-btn" id="toggleSettings">⚙️</button>

        ${this.showSettings ? `
          <div class="settings-panel">
            <h2>쿠팡 파트너스 API 설정</h2>
            <p style="margin-bottom: 2rem; font-size: 0.9rem; color: #888;">수익 집계를 위해 API 정보를 입력해주세요.</p>
            <form id="settingsForm">
              <label>Access Key</label>
              <input name="accessKey" value="${this.apiKeys.accessKey}" placeholder="Access Key를 입력하세요">
              <label>Secret Key</label>
              <input name="secretKey" value="${this.apiKeys.secretKey}" type="password" placeholder="Secret Key를 입력하세요">
              <label>AF ID (예: AF1234567)</label>
              <input name="afId" value="${this.apiKeys.afId}" placeholder="파트너스 AF ID를 입력하세요">
              <button type="submit" class="btn">설정 저장하기</button>
              <button type="button" class="btn" style="background: none; margin-top: 1rem;" id="closeSettings">닫기</button>
            </form>
          </div>
        ` : ''}

        ${!this.videoSrc ? `
          <div class="upload-zone" id="dropZone">
            <div style="font-size: 4rem; margin-bottom: 1.5rem;">🎬</div>
            <h2>영상 업로드</h2>
            <p>스레드용 떡상 문구와 수익 링크를 생성합니다</p>
            <input type="file" id="fileInput" accept="video/*" style="display: none;">
          </div>
        ` : `
          <video src="${this.videoSrc}" controls></video>
          
          ${this.isProcessing ? `
            <div class="progress-bar"><div class="progress-bar-fill"></div></div>
            <p style="text-align: center; color: #aaa;">${this.currentStep}</p>
          ` : ''}

          ${this.result ? `
            <div class="result-card fade-in">
              <div class="product-name">📦 분석된 상품: ${this.result.productName}</div>
              ${this.result.description.map(line => `<div class="desc-line">${line}</div>`).join('')}
              <div class="link-box">${this.result.link}</div>
              <button class="btn" id="copyBtn">전체 복사 후 스레드 이동</button>
            </div>
          ` : ''}
        `}
      </div>
    `;
    this.setupEvents();
  }

  setupEvents() {
    const shadow = this.shadowRoot;
    shadow.querySelector('#toggleSettings')?.addEventListener('click', () => this.toggleSettings());
    shadow.querySelector('#closeSettings')?.addEventListener('click', () => this.toggleSettings());
    shadow.querySelector('#settingsForm')?.addEventListener('submit', (e) => this.saveKeys(e));
    
    shadow.querySelector('#dropZone')?.addEventListener('click', () => shadow.querySelector('#fileInput').click());
    shadow.querySelector('#fileInput')?.addEventListener('change', (e) => this.handleFileUpload(e));
    
    shadow.querySelector('#copyBtn')?.addEventListener('click', () => {
      const text = `${this.result.description.join('\n')}\n\n👉 구경하기: ${this.result.link}`;
      navigator.clipboard.writeText(text);
      shadow.querySelector('#copyBtn').textContent = '✅ 복사 완료!';
      setTimeout(() => { window.open('https://www.threads.net', '_blank'); }, 1000);
    });
  }
}
customElements.define('content-generator', ContentGenerator);
