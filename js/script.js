const CONFIG = {
    dataUrl: 'https://raw.githubusercontent.com/superyogurt118/Amyoba/refs/heads/main/data.json', // ТВОЯ ССЫЛКА RAW JSON
    logoPath: 'logo.png' 
};

function showHint(text) {
    const bubble = document.getElementById('speech-bubble');
    bubble.innerText = text;
    bubble.style.display = 'block';
}

function hideHint() {
    document.getElementById('speech-bubble').style.display = 'none';
}

async function load() {
    document.getElementById('main-logo').src = CONFIG.logoPath;
    const loader = document.getElementById('loader');
    const content = document.getElementById('main-content');
    
    try {
        const r = await fetch(CONFIG.dataUrl);
        const d = await r.json();
        
        // Отрисовка алфавита: берем звук прямо из JSON (например, l.pronunciation)
        document.getElementById('alpha-grid').innerHTML = d.alphabet.map(l => `
            <div class="card" 
                 onmouseenter="showHint('Произносится как: [${l.pronunciation}]')" 
                 onmouseleave="hideHint()"
                 ontouchstart="showHint('Произносится как: [${l.pronunciation}]')" 
                 ontouchend="hideHint()">
                ${l.char}
            </div>
        `).join('');

        document.getElementById('vocab-list').innerHTML = d.dictionary.map((v, index) => `
            <div class="list-item" style="animation-delay: ${index * 0.1}s">
                <b>${v.word}</b> — ${v.translation}
            </div>
        `).join('');

        loader.classList.add('hidden');
        content.classList.remove('hidden');
    } catch (e) { 
        loader.innerHTML = "<p>Ошибка. Проверьте JSON.</p>"; 
    }
}

// ... функции смены темы и секций остаются прежними ...
window.onload = load;
