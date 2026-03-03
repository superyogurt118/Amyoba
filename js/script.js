// 1. ВСТАВЬ СВОЮ ССЫЛКУ RAW JSON В КАВЫЧКИ
const DATA_URL = 'https://raw.githubusercontent.com/superyogurt118/Amyoba/refs/heads/main/data.json'; 

// 2. Правила чтения
const PHONETICS = {
    'Ӵ': 'ч', 'Ӝ': 'жь', 'Ӟ': 'зь', 'Ч': 'тш', 'ӥ': 'йи', 'ӧ': 'оу', 'Ѣ': 'ых'
};

// 3. Функция озвучки
function speak(text) {
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = 'ru-RU';
    msg.rate = 0.8; 
    window.speechSynthesis.speak(msg);
}

// 4. Темы
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

// 5. Загрузка данных
async function load() {
    applyTheme('auto');
    if (!DATA_URL) return;
    try {
        const r = await fetch(DATA_URL);
        const d = await r.json();
        
        // Буквы
        document.getElementById('alpha-grid').innerHTML = d.alphabet.map(l => {
            let c = l.split(' ')[0];
            let s = PHONETICS[c] || PHONETICS[c.toUpperCase()] || c;
            return `<div class="card"><span>${l}</span><button class="speak-btn" onclick="speak('${s}')">🔊</button></div>`;
        }).join('');

        // Слова
        document.getElementById('vocab-list').innerHTML = d.dictionary.map(v => `
            <div class="list-item">
                <span><b>${v.word}</b> — ${v.translation}</span>
                <button class="speak-btn" onclick="speak('${v.word}')">🔊</button>
            </div>`).join('');
    } catch (e) { console.error("Ошибка загрузки:", e); }
}

function showSection(id) {
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    window.scrollTo(0,0);
}

window.onload = load;
