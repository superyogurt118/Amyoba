// --- ТВОИ НАСТРОЙКИ ---
const CONFIG = {
    dataUrl: 'https://raw.githubusercontent.com/superyogurt118/Amyoba/refs/heads/main/data.json',        // <--- ВСТАВЬ ССЫЛКУ НА RAW JSON СЮДА
    logoPath: 'logo.png' 
};

const PHONETICS = {
    'Ӵ': 'ч', 'Ӝ': 'жь', 'Ӟ': 'зь', 'Ч': 'тш', 'ӥ': 'йи', 'ӧ': 'оу', 'Ѣ': 'ых'
};

function speak(text) {
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = 'ru-RU';
    msg.rate = 0.8; 
    window.speechSynthesis.speak(msg);
}

let themeIdx = 0;
const themes = ['auto', 'light', 'dark'];
function cycleTheme() {
    themeIdx = (themeIdx + 1) % 3;
    applyTheme(themes[themeIdx]);
}

function applyTheme(t) {
    const btn = document.getElementById('theme-btn');
    const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    let active = t === 'auto' ? (dark ? 'dark' : 'light') : t;
    document.body.setAttribute('data-theme', active);
    btn.innerText = t === 'auto' ? "Тема: Авто" : (t === 'dark' ? "Тема: Тёмная" : "Тема: Светлая");
}

async function load() {
    // Автоматически подставляем логотип из настроек
    const img = document.getElementById('main-logo');
    if (img) img.src = CONFIG.logoPath;

    applyTheme('auto');
    const loader = document.getElementById('loader');
    const content = document.getElementById('main-content');

    if (!CONFIG.dataUrl) {
        loader.innerHTML = "<p>Нужна ссылка на JSON в CONFIG.dataUrl</p>";
        return;
    }

    try {
        const r = await fetch(CONFIG.dataUrl);
        const d = await r.json();
        
        document.getElementById('alpha-grid').innerHTML = d.alphabet.map(l => {
            let c = l.split(' ')[0];
            let s = PHONETICS[c] || PHONETICS[c.toUpperCase()] || c;
            return `<div class="card"><span>${l}</span><button class="speak-btn" onclick="speak('${s}')">🔊</button></div>`;
        }).join('');

        document.getElementById('vocab-list').innerHTML = d.dictionary.map(v => `
            <div class="list-item">
                <span><b>${v.word}</b> — ${v.translation}</span>
                <button class="speak-btn" onclick="speak('${v.word}')">🔊</button>
            </div>`).join('');

        loader.classList.add('hidden');
        content.classList.remove('hidden');
    } catch (e) { 
        loader.innerHTML = "<p>Ошибка загрузки данных.</p>";
    }
}

function showSection(id) {
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    window.scrollTo(0,0);
}

window.onload = load;
