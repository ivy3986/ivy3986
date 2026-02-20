class ContentGenerator extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.videoSrc = null;
    this.isProcessing = false;
    this.progress = 0;
    this.result = null;
    this.showSettings = false;
    this.isApiValid = null; // null: unknown, true: success, false: failed
    this.useProxy = true; // Default to true for browser environments
    
    // Load API Keys
    this.apiKeys = JSON.parse(localStorage.getItem('coupang_api_keys') || '{"accessKey": "", "secretKey": "", "afId": ""}');
  }

  connectedCallback() { this.render(); }

  toggleSettings() { this.showSettings = !this.showSettings; this.render(); }

  saveKeys(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    this.apiKeys = {
      accessKey: formData.get('accessKey'),
      secretKey: formData.get('secretKey'),
      afId: formData.get('afId')
    };
    this.useProxy = formData.get('useProxy') === 'on';
    localStorage.setItem('coupang_api_keys', JSON.stringify(this.apiKeys));
    this.isApiValid = null;
    this.render();
    alert('설정이 저장되었습니다!');
  }

  async testConnection() {
    this.isApiValid = 'testing';
    this.render();
    
    const product = await this.fetchCoupangProduct('애플');
    this.isApiValid = !!product;
    this.render();
    
    if (this.isApiValid) {
      alert('✅ API 연결에 성공했습니다!');
    } else {
      alert('❌ API 연결에 여전히 실패했습니다. 키 정보 혹은 프록시 상태를 확인해주세요.');
    }
  }

  async generateCoupangSignature(method, path, secretKey, accessKey) {
    const timestamp = new Date().toISOString().replace(/[:\-]|\.\d{3}/g, '').substring(0, 15) + 'Z';
    const message = timestamp + method + path;
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secretKey);
    const messageData = encoder.encode(message);
    const cryptoKey = await crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
    const signatureArray = Array.from(new Uint8Array(signatureBuffer));
    const signatureHex = signatureArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return `CEA algorithm=HmacSHA256, access-key=${accessKey}, timestamp=${timestamp}, signature=${signatureHex}`;
  }

  async fetchCoupangProduct(keyword) {
    if (!this.apiKeys.accessKey || !this.apiKeys.secretKey) return null;
    const path = `/v2/providers/affiliate_open_api/apis/openapi/v1/products/search?keyword=${encodeURIComponent(keyword)}&limit=1`;
    let url = `https://api-gateway.coupang.com${path}`;
    
    // CORS 프록시 적용
    if (this.useProxy) {
      url = `https://corsproxy.io/?${encodeURIComponent(url)}`;
    }

    try {
      const authHeader = await this.generateCoupangSignature('GET', path, this.apiKeys.secretKey, this.apiKeys.accessKey);
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Authorization': authHeader, 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        const errText = await response.text();
        console.error('API Response Error:', errText);
        return null;
      }

      const data = await response.json();
      return data.data?.productData?.[0] || null;
    } catch (error) {
      console.error('Coupang API Network Error:', error);
      return null;
    }
  }

  handleFileUpload(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('video/')) {
      this.videoSrc = URL.createObjectURL(file);
      this.fileName = file.name;
      this.isProcessing = true;
      this.progress = 0;
      this.render();
      this.startAnalysis();
    }
  }

  async startAnalysis() {
    const steps = ['비디오 분석 중...', '상품 정보 추출 중...', '쿠팡 실시간 연동 중...', '수익 링크 생성 중...'];
    for (let i = 0; i <= 80; i += 5) {
      this.progress = i;
      this.currentStep = steps[Math.floor(i / 25)];
      this.updateProgressUI();
      await new Promise(r => setTimeout(r, 40));
    }
    const keyword = this.fileName.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
    const productData = await this.fetchCoupangProduct(keyword);
    this.progress = 100;
    this.isProcessing = false;
    this.generateResult(keyword, productData);
    this.render();
  }

  generateResult(keyword, apiData) {
    const productName = apiData?.productName || keyword;
    const trackingUrl = apiData?.productUrl || `https://link.coupang.com/a/custom-link?keyword=${encodeURIComponent(productName)}&afId=${this.apiKeys.afId}`;
    const templates = [
      {
        desc: [
          `🔥 이거 진짜 영상 보자마자 반함... ${productName} 실화냐? 🤯`,
          `품절 대란이라 구하기 힘든 건데 여기서 찾음 ㅋㅋ 진짜 대박임 ✨`,
          `삶의 질 수직 상승하고 싶으면 고민 말고 바로 고고하세요 🚀`
        ]
      },
      {
        desc: [
          `👀 영상 속 그 제품 궁금했던 사람? 바로 ${productName} 이거임!`,
          `디자인부터 성능까지 미쳤음... 안 사면 무조건 손해 각 ㅠㅠ 🤣`,
          `지금 세일 중이라 가격도 혜자임! 여행 갈 때 필수템 등극 ✨`
        ]
      }
    ];
    const selected = templates[Math.floor(Math.random() * templates.length)];
    const disclosure = "이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.";
    this.result = {
      productName: productName,
      postContent: selected.desc.join('\n'),
      commentContent: `👉 구경하기: ${trackingUrl}\n\n${disclosure}`,
      image: apiData?.productImage || null
    };
  }

  updateProgressUI() {
    const bar = this.shadowRoot.querySelector('.progress-bar-fill');
    if (bar) bar.style.width = `${this.progress}%`;
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; width: 100%; font-family: 'Pretendard', sans-serif; }
        .container { background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(25px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 32px; padding: 2.5rem; box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.6); position: relative; }
        .settings-btn { position: absolute; top: 1.5rem; right: 1.5rem; background: none; border: none; font-size: 1.5rem; cursor: pointer; opacity: 0.5; transition: 0.3s; }
        .settings-btn:hover { opacity: 1; }
        .upload-zone { border: 2px dashed rgba(255, 255, 255, 0.2); border-radius: 24px; padding: 4rem 2rem; cursor: pointer; transition: 0.3s; text-align: center; }
        .upload-zone:hover { border-color: oklch(75% 0.15 190); background: rgba(255,255,255,0.03); }
        video { width: 100%; border-radius: 16px; margin-bottom: 2rem; max-height: 350px; background: #000; }
        .result-card { background: rgba(0,0,0,0.25); padding: 2rem; border-radius: 24px; text-align: left; border: 1px solid rgba(255,255,255,0.05); }
        .product-name { color: oklch(85% 0.15 190); font-weight: 800; font-size: 1.2rem; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 1rem; }
        .section-box { background: rgba(255,255,255,0.03); border-radius: 16px; padding: 1.5rem; margin-bottom: 1.5rem; border: 1px solid rgba(255,255,255,0.05); }
        .section-label { font-size: 0.8rem; color: #888; margin-bottom: 0.75rem; font-weight: 700; display: flex; justify-content: space-between; align-items: center; }
        .content-text { color: #fff; font-size: 1rem; line-height: 1.6; white-space: pre-wrap; margin-bottom: 1rem; }
        .copy-btn { padding: 0.6rem 1.2rem; border-radius: 10px; border: none; background: rgba(255,255,255,0.1); color: #fff; font-size: 0.85rem; font-weight: 700; cursor: pointer; transition: 0.2s; }
        .copy-btn:hover { background: rgba(255,255,255,0.2); transform: translateY(-2px); }
        .copy-btn.active { background: oklch(75% 0.15 150); color: #000; }
        .btn { width: 100%; padding: 1.25rem; border-radius: 16px; border: none; background: linear-gradient(135deg, oklch(75% 0.15 190), oklch(65% 0.2 330)); color: white; font-weight: 800; cursor: pointer; transition: 0.3s; }
        .btn:hover { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
        .settings-panel { position: absolute; inset: 0; background: rgba(15, 15, 25, 0.98); z-index: 10; border-radius: 32px; padding: 2.5rem; overflow-y: auto; text-align: left; }
        input[type="text"], input[type="password"] { width: 100%; padding: 1rem; margin-bottom: 1.2rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; color: white; box-sizing: border-box; }
        label { display: block; margin-bottom: 0.5rem; font-size: 0.9rem; color: #aaa; }
        .api-status { padding: 1rem; border-radius: 12px; font-size: 0.9rem; margin-bottom: 1.5rem; background: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: space-between; }
        .status-badge { padding: 0.3rem 0.8rem; border-radius: 20px; font-weight: 800; font-size: 0.75rem; }
        .status-none { background: #444; color: #aaa; }
        .status-ok { background: oklch(75% 0.15 150); color: #000; }
        .status-err { background: oklch(65% 0.2 20); color: #fff; }
        .progress-bar { height: 8px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden; margin-bottom: 1rem; }
        .progress-bar-fill { height: 100%; background: oklch(75% 0.15 190); transition: 0.1s; }
        .product-img { width: 80px; height: 80px; border-radius: 12px; object-fit: cover; border: 1px solid rgba(255,255,255,0.1); }
        .proxy-toggle { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem; color: #ccc; font-size: 0.9rem; }
      </style>

      <div class="container">
        <button class="settings-btn" id="toggleSettings">⚙️</button>

        ${this.showSettings ? `
          <div class="settings-panel">
            <h2>⚙️ 쿠팡 파트너스 API 설정</h2>
            <p style="margin-bottom: 2rem; font-size: 0.85rem; color: #888; line-height: 1.5;">API 정보를 입력하고 연결 상태를 확인해주세요.</p>
            
            <div class="api-status">
              <span>연결 상태</span>
              <span class="status-badge ${this.isApiValid === true ? 'status-ok' : this.isApiValid === false ? 'status-err' : 'status-none'}">
                ${this.isApiValid === true ? '연결됨' : this.isApiValid === false ? '실패/미연결' : this.isApiValid === 'testing' ? '연결 중...' : '상태 미확인'}
              </span>
            </div>

            <form id="settingsForm">
              <label>Access Key</label>
              <input type="text" name="accessKey" value="${this.apiKeys.accessKey}" required>
              <label>Secret Key</label>
              <input type="password" name="secretKey" value="${this.apiKeys.secretKey}" required>
              <label>AF ID</label>
              <input type="text" name="afId" value="${this.apiKeys.afId}" placeholder="AF1234567" required>
              
              <label class="proxy-toggle">
                <input type="checkbox" name="useProxy" ${this.useProxy ? 'checked' : ''}>
                CORS 프록시 사용 (브라우저 필수)
              </label>

              <div style="display: flex; gap: 1rem; margin-top: 1rem;">
                <button type="submit" class="btn" style="background: rgba(255,255,255,0.1); flex: 1;">설정 저장</button>
                <button type="button" class="btn" style="flex: 2;" id="testApiBtn">연결 테스트</button>
              </div>
              <button type="button" class="btn" style="background: none; margin-top: 1rem;" id="closeSettings">닫기</button>
            </form>
          </div>
        ` : ''}

        ${!this.videoSrc ? `
          <div class="upload-zone" id="dropZone">
            <div style="font-size: 4rem; margin-bottom: 1.5rem;">🎬</div>
            <h2>영상 업로드</h2>
            <p>쿠팡 API 실시간 연동 (CORS 우회 적용)</p>
            <input type="file" id="fileInput" accept="video/*" style="display: none;">
          </div>
        ` : `
          <video src="${this.videoSrc}" controls></video>
          ${this.isProcessing ? `
            <div class="progress-bar"><div class="progress-bar-fill"></div></div>
            <p style="text-align: center; color: #aaa;">${this.currentStep}</p>
          ` : ''}
          ${this.result ? `
            <div class="result-card">
              <div class="product-name">
                ${this.result.image ? `<img src="${this.result.image}" class="product-img">` : ''}
                <span>📦 상품: ${this.result.productName}</span>
              </div>
              <div class="section-box">
                <div class="section-label">본문 (Post) <button class="copy-btn" id="copyPostBtn">복사</button></div>
                <div class="content-text">${this.result.postContent}</div>
              </div>
              <div class="section-box">
                <div class="section-label">댓글 (Comment) <button class="copy-btn" id="copyCommentBtn">복사</button></div>
                <div class="content-text">${this.result.commentContent}</div>
              </div>
              <button class="btn" id="goToThreadsBtn">스레드 이동</button>
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
    shadow.querySelector('#testApiBtn')?.addEventListener('click', () => this.testConnection());
    shadow.querySelector('#dropZone')?.addEventListener('click', () => shadow.querySelector('#fileInput').click());
    shadow.querySelector('#fileInput')?.addEventListener('change', (e) => this.handleFileUpload(e));
    shadow.querySelector('#copyPostBtn')?.addEventListener('click', (e) => {
      navigator.clipboard.writeText(this.result.postContent);
      e.target.textContent = '✅';
      setTimeout(() => e.target.textContent = '복사', 1000);
    });
    shadow.querySelector('#copyCommentBtn')?.addEventListener('click', (e) => {
      navigator.clipboard.writeText(this.result.commentContent);
      e.target.textContent = '✅';
      setTimeout(() => e.target.textContent = '복사', 1000);
    });
    shadow.querySelector('#goToThreadsBtn')?.addEventListener('click', () => window.open('https://www.threads.net', '_blank'));
  }
}
customElements.define('content-generator', ContentGenerator);
