// Main application logic with E-book Store & Library System

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    initApp();
});

function checkAuth() {
    const user = localStorage.getItem('mystic_user');
    const modal = document.getElementById('login-modal');
    if (user) {
        const userData = JSON.parse(user);
        if (modal) modal.classList.add('hidden');
        updateUserUI(userData);
    } else {
        if (modal) modal.classList.remove('hidden');
    }
}

function handleLogin(event) {
    event.preventDefault();
    const name = document.getElementById('login-name').value.trim();
    const email = document.getElementById('login-email').value.trim();
    if (!name || !email) return;

    const userData = { name, email };
    localStorage.setItem('mystic_user', JSON.stringify(userData));
    document.getElementById('login-modal').classList.add('hidden');
    updateUserUI(userData);
}

function fillDefaultUser() {
    document.getElementById('login-name').value = 'Claudir Israel';
    document.getElementById('login-email').value = 'claudirisrael@gmail.com';
}

function logoutUser() {
    localStorage.removeItem('mystic_user');
    document.getElementById('login-modal').classList.remove('hidden');
}

function updateUserUI(user) {
    const displayName = document.getElementById('user-display-name');
    const avatarInitial = document.getElementById('user-avatar-initial');
    if (displayName) displayName.textContent = user.name.split(' ')[0];
    if (avatarInitial) avatarInitial.textContent = user.name.charAt(0).toUpperCase();
}

function initApp() {
    renderStoreGrid();
    renderLibraryGrid();
    populateSelects();
}

// Tab Switching
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.nav-btn').forEach(el => {
        el.classList.remove('text-orange-400', 'bg-white/5');
        el.classList.add('text-slate-300');
    });

    const targetTab = document.getElementById(`tab-${tabId}`);
    if (targetTab) targetTab.classList.remove('hidden');

    document.querySelectorAll('nav button').forEach(btn => {
        if (btn.getAttribute('onclick') && btn.getAttribute('onclick'].includes(tabId)) {
            btn.classList.add('text-orange-400', 'bg-white/5');
            btn.classList.remove('text-slate-300');
        }
    });

    if (tabId === 'library') renderLibraryGrid();
    if (tabId === 'store') renderStoreGrid();

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
}

// Get user purchases from localStorage
function getPurchases() {
    let purchases = JSON.parse(localStorage.getItem('mystic_purchases') || '[]');
    if (purchases.length === 0) {
        // Default unlocked for demo
        purchases = ['aries', 'escorpiao'];
        localStorage.setItem('mystic_purchases', JSON.stringify(purchases));
    }
    return purchases;
}

function addPurchase(signId) {
    let purchases = getPurchases();
    if (!purchases.includes(signId)) {
        purchases.push(signId);
        localStorage.setItem('mystic_purchases', JSON.stringify(purchases));
    }
}

// Render Storefront Grid (Vitrine)
function renderStoreGrid() {
    const container = document.getElementById('store-grid');
    if (!container || !window.SIGNS_DATA) return;

    const purchases = getPurchases();
    let html = '';

    Object.values(window.SIGNS_DATA).forEach(sign => {
        const isOwned = purchases.includes(sign.id);
        html += `
            <div class="glass-card rounded-3xl p-6 border border-white/10 flex flex-col justify-between group hover:border-orange-500/40 transition-all">
                <div>
                    <div class="flex items-center justify-between mb-4">
                        <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr ${sign.color} flex items-center justify-center text-white text-2xl font-bold shadow-lg font-heading">
                            ${sign.symbol}
                        </div>
                        <span class="px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-300 border border-orange-500/30">
                            ${sign.price || 'R$ 37,00'}
                        </span>
                    </div>
                    <h3 class="text-xl font-bold font-heading text-white">E-book ${sign.name}</h3>
                    <p class="text-xs text-orange-400 font-semibold mt-0.5">O ${sign.name} no Zodíaco</p>
                    <p class="text-slate-300 text-xs mt-3 line-clamp-3 leading-relaxed">${sign.summary}</p>
                </div>
                <div class="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                    ${isOwned
                        ? `<span class="text-xs font-bold text-emerald-400 flex items-center"><i class="fa-solid fa-circle-check mr-1.5"></i> Adquirido</span>
                           <button onclick="openSignModal('${sign.id}')" class="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors">Ler E-book</button>`
                        : `<span class="text-xs text-slate-400">Guia Digital Completo</span>
                           <button onclick="openCheckout('${sign.id}')" class="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-xs hover:brightness-110 transition-all shadow-md">Comprar E-book</button>`
                    }
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

// Render My Library Grid (Minha Biblioteca)
function renderLibraryGrid() {
    const container = document.getElementById('library-grid');
    if (!container || !window.SIGNS_DATA) return;

    const purchases = getPurchases();
    let html = '';

    Object.values(window.SIGNS_DATA).forEach(sign => {
        if (!purchases.includes(sign.id)) return;

        html += `
            <div class="glass-card rounded-3xl p-6 border border-emerald-500/30 flex flex-col justify-between group shadow-xl">
                <div>
                    <div class="flex items-center justify-between mb-4">
                        <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr ${sign.color} flex items-center justify-center text-white text-2xl font-bold shadow-lg font-heading">
                            ${sign.symbol}
                        </div>
                        <span class="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                            <i class="fa-solid fa-lock-open mr-1"></i> Liberado
                        </span>
                    </div>
                    <h3 class="text-xl font-bold font-heading text-white">E-book ${sign.name}</h3>
                    <p class="text-xs text-orange-400 font-semibold mt-0.5">Leitura & Experiência Interativa</p>
                    <p class="text-slate-300 text-xs mt-3 line-clamp-3 leading-relaxed">${sign.summary}</p>
                </div>
                <div class="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                    <span class="text-xs text-slate-400">Acesso Vitalício</span>
                    <button onclick="openSignModal('${sign.id}')" class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-xs hover:brightness-110 transition-all shadow-md flex items-center">
                        <i class="fa-solid fa-book-open-reader mr-1.5"></i> Abrir E-book Interativo
                    </button>
                </div>
            </div>
        `;
    });

    if (!html) {
        container.innerHTML = `
            <div class="col-span-full text-center py-16 space-y-4 glass-card rounded-3xl">
                <i class="fa-solid fa-book text-4xl text-slate-500"></i>
                <h3 class="text-xl font-bold font-heading text-white">Sua biblioteca está vazia</h3>
                <p class="text-slate-400 text-sm">Explore nossa vitrine e adquira seu primeiro e-book astrológico!</p>
                <button onclick="switchTab('store')" class="px-6 py-3 rounded-xl bg-orange-500 text-white font-bold text-xs">Ir para a Vitrine</button>
            </div>
        `;
    } else {
        container.innerHTML = html;
    }
}

// Checkout Modal Logic
let currentCheckoutSign = null;

function openCheckout(signId) {
    const sign = window.SIGNS_DATA[signId];
    if (!sign) return;
    currentCheckoutSign = sign;

    document.getElementById('checkout-ebook-icon').textContent = sign.symbol;
    document.getElementById('checkout-ebook-title').textContent = `E-book ${sign.name}: Guia Completo`;
    document.getElementById('checkout-ebook-price').textContent = sign.price || 'R$ 37,00';

    // WhatsApp Checkout Link
    const user = JSON.parse(localStorage.getItem('mystic_user') || '{}');
    const msg = encodeURIComponent(`Olá! Gostaria de comprar o E-book do signo de ${sign.name} por R$ 37,00. Meu e-mail é ${user.email || 'não informado'}.`);
    document.getElementById('whatsapp-checkout-btn').href = `https://wa.me/5511999999999?text=${msg}`;

    document.getElementById('checkout-modal').classList.remove('hidden');
}

function closeCheckoutModal() {
    document.getElementById('checkout-modal').classList.add('hidden');
}

function simulatePurchase(method) {
    if (!currentCheckoutSign) return;
    addPurchase(currentCheckoutSign.id);
    closeCheckoutModal();
    alert(`Pagamento via ${method.toUpperCase()} aprovado com sucesso! O E-book de ${currentCheckoutSign.name} já foi liberado em sua Minha Biblioteca.`);
    switchTab('library');
}

// Populate Select Dropdowns for Compatibility
function populateSelects() {
    if (!window.SIGNS_DATA) return;
    const signs = Object.values(window.SIGNS_DATA);

    const s1 = document.getElementById('compat-sign1');
    const s2 = document.getElementById('compat-sign2');

    let options = '';
    signs.forEach(s => {
        options += `<option value="${s.id}">${s.symbol} ${s.name} (${s.element})</option>`;
    });

    if (s1) s1.innerHTML = options;
    if (s2) {
        s2.innerHTML = options;
        if (signs.length > 1) s2.selectedIndex = 1;
    }
}

// Sign Modal Logic - Interactive E-book Reader
function openSignModal(signId) {
    const sign = window.SIGNS_DATA[signId];
    if (!sign) return;

    // Check if user owns it
    const purchases = getPurchases();
    if (!purchases.includes(sign.id)) {
        openCheckout(sign.id);
        return;
    }

    document.getElementById('modal-sign-symbol').textContent = sign.symbol;
    document.getElementById('modal-sign-name').textContent = sign.name;
    document.getElementById('modal-sign-meta').textContent = `${sign.dates} • ${sign.element} • ${sign.planet}`;

    document.getElementById('mpane-overview').innerHTML = `
        <div class="space-y-6">
            <div class="glass-card p-6 rounded-2xl border border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-transparent">
                <h4 class="font-bold font-heading text-orange-300 text-lg mb-2"><i class="fa-solid fa-compass mr-2"></i> Essência do Signo</h4>
                <p class="text-slate-200 leading-relaxed text-sm sm:text-base">${sign.summary}</p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="glass-card p-5 rounded-2xl border border-white/10 space-y-2">
                    <h5 class="font-bold font-heading text-orange-400 text-sm"><i class="fa-solid fa-bolt mr-1.5"></i> Superpoder</h5>
                    <p class="text-xs text-slate-300 leading-relaxed">Capacidade natural de canalizar a energia do elemento ${sign.element} para transformar ambientes e inspirar pessoas.</p>
                </div>
                <div class="glass-card p-5 rounded-2xl border border-white/10 space-y-2">
                    <h5 class="font-bold font-heading text-orange-400 text-sm"><i class="fa-solid fa-bullseye mr-1.5"></i> Missão de Vida</h5>
                    <p class="text-xs text-slate-300 leading-relaxed">Dominar os próprios impulsos através da autoconsciência proporcionada pela regência de ${sign.planet}.</p>
                </div>
            </div>

            <div class="text-center pt-2">
                <button onclick="triggerSignSecret('${sign.name}')" class="px-6 py-3 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 font-semibold text-xs border border-orange-500/40 transition-all">
                    <i class="fa-solid fa-wand-magic-sparkles mr-2"></i> Revelar Segredo Cósmico de ${sign.name}
                </button>
                <p id="secret-box" class="hidden mt-3 p-4 rounded-xl bg-mystic-900 border border-orange-500/30 text-xs text-orange-200 italic"></p>
            </div>
        </div>
    `;

    document.getElementById('mpane-love').innerHTML = `
        <div class="space-y-6">
            <div class="glass-card p-6 rounded-2xl border border-white/10 space-y-3">
                <h4 class="font-bold font-heading text-orange-300 text-lg"><i class="fa-solid fa-heart mr-2 text-rose-400"></i> Linguagem do Afeto</h4>
                <p class="text-slate-200 text-sm sm:text-base leading-relaxed">No amor, ${sign.name} busca conexões autênticas e profundas. O e-book revela que a chave para conquistar este signo é a sinceridade emocional e o respeito à sua individualidade.</p>
            </div>

            <div class="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
                <h4 class="font-bold font-heading text-white text-sm">Teste Rápido de Afinidade com ${sign.name}</h4>
                <p class="text-xs text-slate-400">Você entende bem este signo? Responda abaixo:</p>
                <div id="quiz-container" class="space-y-3">
                    <p class="text-xs font-semibold text-slate-200">Qual é a principal necessidade de ${sign.name} nos relacionamentos?</p>
                    <div class="space-y-2 text-xs">
                        <button onclick="answerQuiz(true)" class="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10">A) Liberdade, verdade e conexão genuína.</button>
                        <button onclick="answerQuiz(false)" class="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10">B) Isolamento total e silêncio constante.</button>
                    </div>
                    <p id="quiz-result" class="text-xs font-semibold mt-2 hidden"></p>
                </div>
            </div>
        </div>
    `;

    document.getElementById('mpane-career').innerHTML = `
        <div class="space-y-6">
            <div class="glass-card p-6 rounded-2xl border border-white/10 space-y-3">
                <h4 class="font-bold font-heading text-orange-300 text-lg"><i class="fa-solid fa-briefcase mr-2 text-cyan-400"></i> Carreira & Talento Nativo</h4>
                <p class="text-slate-200 text-sm sm:text-base leading-relaxed">Regido por ${sign.planet}, ${sign.name} brilha em atividades que exigem dedicação, criatividade e visão de futuro. Este e-book destaca que o sucesso profissional vem quando o trabalho está alinhado com o seu propósito essencial.</p>
            </div>

            <div class="p-5 rounded-2xl bg-orange-500/10 border border-orange-500/25 flex items-center justify-between">
                <div>
                    <h5 class="font-bold font-heading text-orange-300 text-xs uppercase tracking-wider">Desafio Profissional da Semana</h5>
                    <p class="text-xs text-slate-300 mt-1">Delegue uma tarefa que consome sua energia e foque na sua maior habilidade.</p>
                </div>
                <button onclick="alert('Desafio aceito! Que sua semana seja altamente produtiva.')" class="px-4 py-2 rounded-xl bg-orange-500 text-white font-semibold text-xs hover:brightness-110">Aceitar</button>
            </div>
        </div>
    `;

    document.getElementById('mpane-wellbeing').innerHTML = `
        <div class="space-y-6">
            <div class="glass-card p-6 rounded-2xl border border-white/10 space-y-3">
                <h4 class="font-bold font-heading text-orange-300 text-lg"><i class="fa-solid fa-leaf mr-2 text-emerald-400"></i> Ritual de Autocuidado</h4>
                <p class="text-slate-200 text-sm sm:text-base leading-relaxed">Para recarregar as energias do elemento ${sign.element}, ${sign.name} precisa de momentos de pausa consciente. Desfrute de um banho relaxante, meditação ou contato com a natureza.</p>
            </div>
        </div>
    `;

    switchModalTab('overview');
    document.getElementById('sign-modal').classList.remove('hidden');
}

function triggerSignSecret(signName) {
    const box = document.getElementById('secret-box');
    const secrets = {
        "Áries": "O segredo ariano: Por trás da couraça de coragem, bate um coração extremamente protetor e leal que odeia injustiças.",
        "Touro": "O segredo taurino: Touro não é teimoso por capricho; é um guardião feroz da sua paz emocional e estabilidade construída com suor.",
        "Gêmeos": "O segredo geminiano: Sob a superfície comunicativa, Gêmeos busca incessantemente compreender a si mesmo através dos outros.",
        "Câncer": "O segredo canceriano: A aparente sensibilidade esconde uma força de resiliência e coragem emocional capaz de mover montanhas.",
        "Leão": "O segredo leonino: Leão precisa brilhar não por ego, mas porque seu coração generoso deseja iluminar todos ao seu redor.",
        "Virgem": "O segredo virginiano: O perfeccionismo é, na verdade, um ato profundo de amor e cuidado com o mundo e com quem ama.",
        "Libra": "O segredo libriano: A busca eterna por harmonia esconde uma força diplomática e justa capaz de resolver os conflitos mais complexos.",
        "Escorpião": "O segredo escorpiano: Escorpião não quer o controle; ele busca a verdade absoluta e a fusão de almas sem máscaras.",
        "Sagitário": "O segredo sagitariano: O otimismo inabalável de Sagitário nasce da certeza de que o universo sempre conspira a favor da evolução.",
        "Capricórnio": "O segredo capricorniano: Sob a disciplina de ferro, vive um romântico incurável que sonha em construir um legado de amor.",
        "Aquário": "O segredo aquariano: A mente no futuro e nas causas coletivas guarda uma necessidade profunda de ser compreendido e aceito.",
        "Peixes": "O segredo pisciano: Peixes absorve o mundo ao redor como uma esponja mística, transformando dor alheia em pura compaixão."
    };
    box.textContent = secrets[signName] || "Este signo guarda um poder magnético e transformador único.";
    box.classList.remove('hidden');
}

function answerQuiz(isCorrect) {
    const res = document.getElementById('quiz-result');
    res.classList.remove('hidden');
    if (isCorrect) {
        res.innerHTML = '<span class="text-emerald-400 font-semibold"><i class="fa-solid fa-check mr-1"></i> Resposta correta! Você realmente compreende a essência deste signo.</span>';
    } else {
        res.innerHTML = '<span class="text-rose-400 font-semibold"><i class="fa-solid fa-xmark mr-1"></i> Ops! A resposta correta é a alternativa A. Cada signo valoriza sua verdade e liberdade essencial.</span>';
    }
}

function closeSignModal() {
    document.getElementById('sign-modal').classList.add('hidden');
}

function switchModalTab(tabName) {
    document.querySelectorAll('.modal-pane').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.modal-tab').forEach(el => {
        el.classList.remove('border-orange-400', 'text-orange-400', 'font-semibold');
        el.classList.add('border-transparent', 'text-slate-400');
    });

    const pane = document.getElementById(`mpane-${tabName}`);
    const tab = document.getElementById(`mtab-${tabName}`);
    if (pane) pane.classList.remove('hidden');
    if (tab) {
        tab.classList.add('border-orange-400', 'text-orange-400', 'font-semibold');
        tab.classList.remove('border-transparent', 'text-slate-400');
    }
}

// Compatibility Calculator Logic
function calculateCompatibility() {
    const s1Id = document.getElementById('compat-sign1').value;
    const s2Id = document.getElementById('compat-sign2').value;

    const s1 = window.SIGNS_DATA[s1Id];
    const s2 = window.SIGNS_DATA[s2Id];
    if (!s1 || !s2) return;

    let score = 78;
    let loveText = "";
    let commText = "";

    if (s1.element === s2.element) {
        score = 94;
        loveText = `Por compartilharem o elemento ${s1.element}, ${s1.name} e ${s2.name} possuem uma sintonia quase telepática. Há um entendimento intuitivo profundo sobre o ritmo e as necessidades um do outro.`;
        commText = `A comunicação flui de forma natural e acolhedora. O único cuidado é para que não fiquem presos nas mesmas visões ou teimosias.`;
    } else if (
        (s1.element === 'Fogo' && s2.element === 'Ar') || (s1.element === 'Ar' && s2.element === 'Fogo') ||
        (s1.element === 'Terra' && s2.element === 'Água') || (s1.element === 'Água' && s2.element === 'Terra')
    ) {
        score = 89;
        loveText = `Uma combinação magnética! O calor do ${s1.element} estimula e nutre a essência de ${s2.name}. Há uma troca vibrante de energias que cria um vínculo forte e duradouro.`;
        commText = `Vocês se complementam com perfeição: enquanto um traz iniciativa e visão, o outro oferece estabilidade e profundidade emocional.`;
    } else {
        score = 75;
        loveText = `Aqui temos o encontro de dois mundos distintos (${s1.element} e ${s2.element}). As diferenças são reais, mas quando há respeito e vontade de aprender, essa relação se torna uma verdadeira escola de evolução e crescimento mútuo.`;
        commText = `É fundamental exercitar a escuta atenta e valorizar as perspectivas do outro para que a sintonia seja plena.`;
    }

    document.getElementById('res-sign1-badge').textContent = s1.symbol;
    document.getElementById('res-name1').textContent = s1.name;
    document.getElementById('res-elem1').textContent = `Elemento ${s1.element}`;

    document.getElementById('res-sign2-badge').textContent = s2.symbol;
    document.getElementById('res-name2').textContent = s2.name;
    document.getElementById('res-elem2').textContent = `Elemento ${s2.element}`;

    document.getElementById('compat-score').textContent = `${score}%`;
    document.getElementById('compat-love-text').textContent = loveText;
    document.getElementById('compat-comm-text').textContent = commText;

    document.getElementById('compat-result').classList.remove('hidden');
}

// Oracle Card Logic
const oracleCards = [
    { category: "Mensagem do Cosmos", title: "A Intuição", message: "Pare de buscar respostas fora de você. O silêncio guarda a clareza que sua alma tanto procura neste momento." },
    { category: "Mensagem do Cosmos", title: "O Despertar", message: "Um ciclo de velhas repetições está se encerrando. Você está pronto(a) para habitar uma nova frequência de consciência." },
    { category: "Mensagem do Cosmos", title: "A Coragem", message: "O medo é apenas um sinal de que você está prestes a expandir seus limites. Avance com fé no seu próprio poder." },
    { category: "Mensagem do Cosmos", title: "Acolhimento", message: "Seja mais gentil consigo mesmo(a). A cura acontece na aceitação amorosa de quem você é hoje, em cada detalhe." },
    { category: "Mensagem do Cosmos", title: "A Semente", message: "Tudo o que você planta em pensamentos e palavras hoje florescerá amanhã. Escolha sementes de luz." }
];

function drawOracleCard() {
    const card = oracleCards[Math.floor(Math.random() * oracleCards.length)];

    document.getElementById('oracle-front').classList.add('hidden');
    const back = document.getElementById('oracle-back');
    back.classList.remove('hidden');

    document.getElementById('oracle-category').textContent = card.category;
    document.getElementById('oracle-title').textContent = card.title;
    document.getElementById('oracle-message').textContent = `"${card.message}"`;
}
