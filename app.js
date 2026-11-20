// Main application logic with User Authentication

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
    const heroName = document.getElementById('hero-user-name');
    const mapOwner = document.getElementById('map-owner-name');

    if (displayName) displayName.textContent = user.name.split(' ')[0];
    if (avatarInitial) avatarInitial.textContent = user.name.charAt(0).toUpperCase();
    if (heroName) heroName.textContent = user.name.split(' ')[0];
    if (mapOwner) mapOwner.textContent = user.name;
}

function initApp() {
    renderHomeSigns();
    renderSignsGrid();
    populateSelects();
    loadSavedAffirmations();
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
        if (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(tabId)) {
            btn.classList.add('text-orange-400', 'bg-white/5');
            btn.classList.remove('text-slate-300');
        }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
}

// Render Home Signs
function renderHomeSigns() {
    const container = document.getElementById('home-signs-grid');
    if (!container || !window.SIGNS_DATA) return;

    let html = '';
    const signs = Object.values(window.SIGNS_DATA).slice(0, 6);
    signs.forEach(sign => {
        html += `
            <div onclick="openSignModal('${sign.id}')" class="glass-card rounded-2xl p-4 text-center cursor-pointer hover:scale-105 transition-all duration-300 group border border-white/10">
                <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr ${sign.color} flex items-center justify-center text-white text-xl font-bold mx-auto mb-3 shadow-md group-hover:scale-110 transition-transform font-heading">
                    ${sign.symbol}
                </div>
                <h4 class="font-bold font-heading text-white text-sm">${sign.name}</h4>
                <p class="text-[10px] text-slate-400 mt-0.5">${sign.element}</p>
            </div>
        `;
    });
    container.innerHTML = html;
}

// Render Signs Grid (All 12)
function renderSignsGrid(filter = '') {
    const container = document.getElementById('signs-grid');
    if (!container || !window.SIGNS_DATA) return;

    let html = '';
    Object.values(window.SIGNS_DATA).forEach(sign => {
        if (filter && !sign.name.toLowerCase().includes(filter.toLowerCase()) && !sign.element.toLowerCase().includes(filter.toLowerCase())) {
            return;
        }
        html += `
            <div onclick="openSignModal('${sign.id}')" class="glass-card rounded-3xl p-6 cursor-pointer hover:scale-[1.02] transition-all duration-300 group border border-white/10 flex flex-col justify-between">
                <div>
                    <div class="flex items-center justify-between mb-4">
                        <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr ${sign.color} flex items-center justify-center text-white text-2xl font-bold shadow-lg font-heading">
                            ${sign.symbol}
                        </div>
                        <span class="px-3 py-1 rounded-full text-xs font-semibold bg-white/5 text-orange-300 border border-white/10">
                            ${sign.element}
                        </span>
                    </div>
                    <h3 class="text-xl font-bold font-heading text-white group-hover:text-orange-300 transition-colors">${sign.name}</h3>
                    <p class="text-xs text-orange-400/90 font-semibold mt-0.5">${sign.dates}</p>
                    <p class="text-slate-300 text-xs mt-3 line-clamp-3 leading-relaxed">${sign.summary}</p>
                </div>
                <div class="mt-6 pt-4 border-t border-white/10 flex justify-between items-center text-xs text-slate-400">
                    <span>Regente: <strong class="text-slate-200">${sign.planet}</strong></span>
                    <span class="text-orange-400 font-semibold group-hover:translate-x-1 transition-transform flex items-center">Abrir E-book Interativo <i class="fa-solid fa-bolt ml-1.5"></i></span>
                </div>
            </div>
        `;
    });
    container.innerHTML = html || '<p class="col-span-full text-center text-slate-400 py-8">Nenhum signo encontrado.</p>';
}

function filterSigns() {
    const query = document.getElementById('sign-search').value;
    renderSignsGrid(query);
}

// Populate Select Dropdowns
function populateSelects() {
    if (!window.SIGNS_DATA) return;
    const signs = Object.values(window.SIGNS_DATA);

    const s1 = document.getElementById('compat-sign1');
    const s2 = document.getElementById('compat-sign2');
    const sAffirm = document.getElementById('affirm-sign');

    let options = '';
    signs.forEach(s => {
        options += `<option value="${s.id}">${s.symbol} ${s.name} (${s.element})</option>`;
    });

    if (s1) s1.innerHTML = options;
    if (s2) {
        s2.innerHTML = options;
        if (signs.length > 1) s2.selectedIndex = 1;
    }
    if (sAffirm) sAffirm.innerHTML = options;
}

// Sign Modal Logic - Interactive E-book Experience
let currentActiveSign = null;

function openSignModal(signId) {
    const sign = window.SIGNS_DATA[signId];
    if (!sign) return;
    currentActiveSign = sign;

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

            <div class="glass-card p-6 rounded-2xl border border-white/10 text-center space-y-4">
                <h5 class="font-bold font-heading text-white text-sm">Gerar Afirmação Instantânea para ${sign.name}</h5>
                <blockquote id="modal-affirmation" class="text-sm font-semibold italic text-orange-300">"Minha energia é sagrada e transborda paz, força e clareza em cada passo."</blockquote>
                <button onclick="refreshModalAffirmation('${sign.name}')" class="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold">Nova Afirmação</button>
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

function refreshModalAffirmation(signName) {
    const affs = [
        `"Minha luz própria ilumina meu caminho e atrai bênçãos diárias para minha vida."`,
        `"Sou dono(a) do meu destino, conduzindo minha energia com sabedoria e poder pessoal."`,
        `"O universo apoia meus passos e sinto profunda paz em meu coração."`
    ];
    document.getElementById('modal-affirmation').textContent = affs[Math.floor(Math.random() * affs.length)];
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

// Affirmation Generator Logic
const affirmationsDB = {
    amor: [
        "Meu coração é um espaço seguro de amor genuíno, atraindo relações que vibram na mesma frequência de paz e respeito.",
        "Eu me permito amar e ser amado(a) em minha totalidade, sem medo de mostrar minha essência.",
        "Cultivo a harmonia em meus afetos ao estabelecer limites claros e transbordar carinho."
    ],
    prosperidade: [
        "A abundância do universo flui livremente em minha vida através dos meus talentos e da minha dedicação.",
        "Minhas escolhas diárias abrem caminhos para a prosperidade e para o sucesso em todas as áreas.",
        "Sou merecedor(a) de realizar meus maiores sonhos e construir uma realidade próspera."
    ],
    confiança: [
        "Minha força interior é inabalável e me guia com coragem por qualquer caminho que eu escolha trilhar.",
        "Confio plenamente na minha intuição e na sabedoria que habita em meu interior.",
        "Cada desafio superado expande minha autoconfiança e revela meu verdadeiro potencial."
    ],
    paz: [
        "Minha mente é um lago sereno; respiro tranquilidade e exalo serenidade.",
        "Liberto o controle excessivo e confio no fluxo natural da vida e do tempo divino.",
        "Encontro refúgio e paz em meu próprio centro a qualquer momento do dia."
    ],
    transformacao: [
        "Acolho as mudanças como portais sagrados para a minha evolução e renovação.",
        "Deixo ir com gratidão tudo o que já cumpriu seu ciclo em minha jornada.",
        "Renasci todos os dias mais forte, sábio(a) e alinhado(a) com meu propósito."
    ]
};

let currentAffirmationText = "";

function generateAffirmation() {
    const signId = document.getElementById('affirm-sign').value;
    const focus = document.getElementById('affirm-focus').value;
    const sign = window.SIGNS_DATA[signId] || { name: 'Áries', element: 'Fogo', symbol: '♈' };

    const list = affirmationsDB[focus] || affirmationsDB.amor;
    const randomAffirm = list[Math.floor(Math.random() * list.length)];

    currentAffirmationText = `"${randomAffirm}" — ${sign.name} (${sign.element})`;
    document.getElementById('affirmation-display').textContent = `"${randomAffirm}"`;
    document.getElementById('card-sign-tag').textContent = `${sign.name} • ${sign.element}`;

    const icon = document.getElementById('save-icon');
    icon.classList.remove('fa-solid', 'text-orange-400');
    icon.classList.add('fa-regular');
}

function saveCurrentAffirmation() {
    if (!currentAffirmationText) return;
    let saved = JSON.parse(localStorage.getItem('saved_affirmations') || '[]');
    if (!saved.includes(currentAffirmationText)) {
        saved.push(currentAffirmationText);
        localStorage.setItem('saved_affirmations', JSON.stringify(saved));
        loadSavedAffirmations();

        const icon = document.getElementById('save-icon');
        icon.classList.remove('fa-regular');
        icon.classList.add('fa-solid', 'text-orange-400');
    }
}

function loadSavedAffirmations() {
    const container = document.getElementById('saved-affirmations-list');
    if (!container) return;

    const saved = JSON.parse(localStorage.getItem('saved_affirmations') || '[]');
    if (saved.length === 0) {
        container.innerHTML = '<p class="text-slate-500 italic">Nenhuma afirmação salva no seu mapa ainda.</p>';
        return;
    }

    let html = '';
    saved.forEach((item, index) => {
        html += `
            <div class="flex items-center justify-between bg-mystic-900 p-2.5 rounded-xl border border-white/5 gap-2">
                <p class="text-slate-300 italic truncate">${item}</p>
                <button onclick="removeAffirmation(${index})" class="text-slate-500 hover:text-rose-400"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
    });
    container.innerHTML = html;
}

function removeAffirmation(index) {
    let saved = JSON.parse(localStorage.getItem('saved_affirmations') || '[]');
    saved.splice(index, 1);
    localStorage.setItem('saved_affirmations', JSON.stringify(saved));
    loadSavedAffirmations();
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
