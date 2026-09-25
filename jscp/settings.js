let pages = [];

function initializeDefaultSettings() {
    window.settings = {
        music: 'assets/music.m4a',
        countdown: 3,
        matrixText: 'HAPPYBIRTHDAY',
        matrixColor1: '#ff69b4',
        matrixColor2: '#ff1493',

        sequence: 'HAPPY|BIRTHDAY|CUTIE|LITTLE|GURL|❤',
        sequenceColor: '#ff69b4',

        gift: './image/happy3.gif',

        enableBook: true,
        enableHeart: false,
        colorTheme: 'pink',

                pages: [
            { image: 'assets/main.jpg' },
            { image: 'assets/image7.jpg',
              content: 'سکونِ قلب رب کے قریب ہے ✨' },
            { image: 'assets/image8.jpg',
              content: 'Some people just get you ❤️' },
            { image: 'assets/image9.jpg',
              content: 'میری ہر خوبصورت دعا کا جواب تم ہو 🌹' },
            { image: 'card',
              content: 'Forever & Always 💕' },
            { image: 'backcover' }
        ],
    };

    pages = window.settings.pages;
}

function applyLoadedSettings() {
    const s = window.settings;
    const audio = document.getElementById('birthdayAudio');
    if (audio && s.music) {
        const curSrc = audio.currentSrc || audio.src;
        if (!curSrc || (!curSrc.includes('assets/music.mp3') && !curSrc.includes('assets/music.m4a') && !curSrc.includes(s.music))) {
            audio.src = s.music;
        }
    }

    const giftImg = document.getElementById('gift-image');
    if (giftImg && s.gift) giftImg.src = s.gift;

    if (typeof matrixChars !== 'undefined') {
        matrixChars = s.matrixText.split('');
    }

    createPages();
}

function resetWebsiteState() {
    const bookContainer = document.querySelector('.book-container');
    const mainCanvas = document.querySelector('.canvas');
    const matrixCanvas = document.getElementById('matrix-rain');
    const giftImageEl = document.getElementById('gift-image');
    const contentDisplay = document.getElementById('contentDisplay');
    const fireworksEl = document.getElementById('fireworkContainer');
    const bgVideo = document.getElementById('book-bg-video');

    if (bgVideo) {
        bgVideo.pause();
        bgVideo.currentTime = 0;
        bgVideo.style.opacity = '0';
        bgVideo.style.display = 'none';
    }

    if (typeof S !== 'undefined') S.initialized = false;
    if (typeof hideStars === 'function') hideStars();

    if (bookContainer) { bookContainer.classList.remove('show'); bookContainer.style.display = 'none'; }
    const bookEl = document.getElementById('book');
    if (bookEl) bookEl.classList.remove('show', 'opened', 'finished');
    if (contentDisplay) { contentDisplay.classList.remove('show'); contentDisplay.style.display = 'none'; }
    if (giftImageEl) giftImageEl.style.display = 'none';
    if (fireworksEl) fireworksEl.innerHTML = '';
    if (mainCanvas) mainCanvas.style.display = 'block';
    if (matrixCanvas) matrixCanvas.style.display = 'block';

    if (matrixCanvas) {
        const ctx = matrixCanvas.getContext('2d');
        ctx.clearRect(0, 0, matrixCanvas.width, matrixCanvas.height);
    }
    if (typeof matrixInterval !== 'undefined' && matrixInterval) {
        clearInterval(matrixInterval); matrixInterval = null;
    }
    if (typeof initMatrixRain === 'function') initMatrixRain();

    if (window.settings) {
        if (typeof matrixChars !== 'undefined') matrixChars = window.settings.matrixText.split('');
        if (giftImageEl && window.settings.gift) giftImageEl.src = window.settings.gift;
        if (window.settings.pages) { pages = window.settings.pages; createPages(); }
    }

    if (typeof S !== 'undefined' && S.UI && window.settings) {
        S.UI.reset(true);
        const seq = `|#countdown ${window.settings.countdown}|${window.settings.sequence}|#gift|`;
        S.UI.simulate(seq);
    }
}

function _applyPageFaceContent(face, pageData, logicalIndex, isFront) {
    if (pageData && pageData.image === 'card') {
        face.innerHTML = `
            <div class="birthday-card-face">
                <div class="card-stars">✨ 🌟 ✨</div>
                <h2 class="card-title">Happy Birthday</h2>
                <div class="card-divider"></div>
                <p class="card-message">
                    To the one who fills every day with love, laughter, and pure happiness.<br><br>
                    May all your wishes come true today and always.
                </p>
                <div class="card-sign">Forever & Always ❤️</div>
            </div>
        `;
        return;
    }
    if (pageData && pageData.image === 'backcover') {
        face.innerHTML = `
            <div class="book-backcover-face">
                <div class="backcover-ornament">✦ ✧ ✦</div>
                <div class="backcover-title">The End</div>
                <div class="backcover-sub">With Infinite Love ❤️</div>
            </div>
        `;
        return;
    }
    if (pageData && pageData.image) {
        if (pageData.image.startsWith('gradient:')) {
            face.style.background = pageData.image.replace('gradient:', '');
            face.style.display = 'flex';
            face.style.alignItems = 'center';
            face.style.justifyContent = 'center';
            const icon = document.createElement('span');
            icon.style.cssText = 'font-size:72px;opacity:0.25;user-select:none;pointer-events:none;';
            icon.textContent = isFront ? '📖' : '💕';
            face.appendChild(icon);
        } else {
            const img = document.createElement('img');
            img.src = pageData.image;
            img.onerror = function () {
                this.remove();
                const label = isFront && logicalIndex === 0 ? 'Bìa Sách' : `Trang ${logicalIndex + 1}`;
                if (typeof createPlaceholderImage === 'function') {
                    const ph = document.createElement('img');
                    ph.src = createPlaceholderImage(label);
                    face.appendChild(ph);
                } else {
                    face.style.background = 'linear-gradient(135deg,#ff9a9e,#fad0c4)';
                    face.style.display = 'flex';
                    face.style.alignItems = 'center';
                    face.style.justifyContent = 'center';
                    const lbl = document.createElement('span');
                    lbl.style.cssText = 'font-size:48px;opacity:0.4;';
                    lbl.textContent = '🖼️';
                    face.appendChild(lbl);
                }
            };
            face.appendChild(img);
        }
    } else {
        face.classList.add('empty-page');
        if (isFront) {
            face.textContent = 'Trang trống';
        } else {
            const endImg = document.createElement('img');
            endImg.src = './image/theend.jpg';
            endImg.onerror = function () {
                this.remove();
                face.style.background = 'linear-gradient(135deg,#2c3e50,#4a0000)';
                face.style.display = 'flex';
                face.style.alignItems = 'center';
                face.style.justifyContent = 'center';
                const sp = document.createElement('span');
                sp.style.cssText = 'color:#fff;font-size:26px;text-align:center;line-height:1.6;';
                sp.innerHTML = '❤️<br>The End';
                face.appendChild(sp);
            };
            face.appendChild(endImg);
        }
    }
}

function createPages() {
    const book = document.getElementById('book');
    if (!book) return;

    book.innerHTML = '';

    const baseEl = document.createElement('div');
    baseEl.className = 'book-base';
    book.appendChild(baseEl);

    if (typeof currentPage !== 'undefined') currentPage = 0;
    if (typeof isFlipping !== 'undefined') isFlipping = false;
    if (typeof isBookFinished !== 'undefined') isBookFinished = false;

    if (!pages || pages.length === 0) return;

    const totalLogicalPages = pages.length;
    const totalPhysicalPages = Math.ceil(totalLogicalPages / 2);

    for (let physIdx = 0; physIdx < totalPhysicalPages; physIdx++) {
        const frontLogIdx = physIdx * 2;
        const backLogIdx = frontLogIdx + 1;

        const page = document.createElement('div');
        page.classList.add('page');
        page.dataset.page = physIdx;

        const front = document.createElement('div');
        front.classList.add('page-front');
        _applyPageFaceContent(front, pages[frontLogIdx], frontLogIdx, true);

        const back = document.createElement('div');
        back.classList.add('page-back');
        if (backLogIdx < pages.length && pages[backLogIdx]) {
            _applyPageFaceContent(back, pages[backLogIdx], backLogIdx, false);
        } else {
            _applyPageFaceContent(back, null, backLogIdx, false);
        }

        page.appendChild(front);
        page.appendChild(back);
        book.appendChild(page);

        page.addEventListener('click', function (e) {
            if (isFlipping) return;
            const rect = this.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            if (clickX < rect.width / 2 && this.classList.contains('flipped')) {
                if (typeof prevPage === 'function') prevPage();
            } else if (clickX >= rect.width / 2 && !this.classList.contains('flipped')) {
                if (typeof nextPage === 'function') nextPage();
            }
        });
    }

    if (typeof photoUrls !== 'undefined') {
        photoUrls = pages
            .filter(p => p.image && !p.image.startsWith('gradient:') && !p.image.includes('main.jpg') && p.image !== 'card' && p.image !== 'backcover')
            .map(p => p.image);

        if (photoUrls.length === 0) {
            const cols = ['#ff9a9e', '#a18cd1', '#ffecd2', '#a1c4fd', '#fd7f6f', '#43e97b', '#fbc2eb', '#c2e9fb'];
            photoUrls = cols.map(c => `data:image/svg+xml;base64,${btoa(
                `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80">` +
                `<circle cx="40" cy="40" r="38" fill="${c}"/>` +
                `<text x="40" y="46" font-size="28" text-anchor="middle" fill="rgba(0,0,0,0.2)">❤</text></svg>`)}`);
        }
    }

    if (typeof calculatePageZIndexes === 'function') {
        calculatePageZIndexes();
    }
}

function updateFullscreenBtnVisibility() {
    const btn = document.getElementById('fullscreenBtn');
    if (!btn) return;
    btn.style.display = /Android/i.test(navigator.userAgent) ? 'block' : 'none';
}

document.addEventListener('DOMContentLoaded', function () {
    const fsBtn = document.getElementById('fullscreenBtn');
    if (fsBtn) {
        fsBtn.addEventListener('click', function () {
            const el = document.documentElement;
            if (el.requestFullscreen) el.requestFullscreen();
            else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
            else if (el.mozRequestFullScreen) el.mozRequestFullScreen();
        });
    }
    updateFullscreenBtnVisibility();

    initializeDefaultSettings();
    applyLoadedSettings();

    window.isWebsiteReady = true;
});