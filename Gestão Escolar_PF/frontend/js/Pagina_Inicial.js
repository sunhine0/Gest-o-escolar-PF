 // Função para alternar entre modo claro e escuro
 function toggleTheme() {
    const body = document.body;
    const themeIcon = document.getElementById('theme-icon');
    const themeText = document.getElementById('theme-text');
    
    // Verifica o tema atual
    const currentTheme = body.getAttribute('data-theme');
    
    if (currentTheme === 'dark') {
        // Muda para modo claro
        body.setAttribute('data-theme', 'light');
        themeIcon.className = 'fas fa-moon';
        themeText.textContent = 'Modo Escuro';
        localStorage.setItem('theme', 'light');
    } else {
        // Muda para modo escuro
        body.setAttribute('data-theme', 'dark');
        themeIcon.className = 'fas fa-sun';
        themeText.textContent = 'Modo Claro';
        localStorage.setItem('theme', 'dark');
    }
}

// Variáveis globais para controle de estado
const sidebar = document.getElementById('sidebar');
const menuToggle = document.getElementById('menuToggle');
const menuDropdown = document.getElementById('menuDropdown');
const themeToggle = document.getElementById('themeToggle');
const overlay = document.getElementById('overlay');
const navLinks = document.querySelectorAll('.nav-link');

// Controle do menu hambúrguer e dropdown
menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    
    // Alterna o dropdown
    menuDropdown.classList.toggle('active');
    
    // Em dispositivos móveis, também controla a sidebar
    if (window.innerWidth <= 768) {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    }
});

// Fecha o dropdown ao clicar fora dele
document.addEventListener('click', (e) => {
    if (!menuToggle.contains(e.target) && !menuDropdown.contains(e.target)) {
        menuDropdown.classList.remove('active');
    }
});

// Controle do overlay para dispositivos móveis
overlay.addEventListener('click', () => {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
    menuDropdown.classList.remove('active');
});

// Controle de alternância de tema claro/escuro
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Aplica o novo tema
    document.documentElement.setAttribute('data-theme', newTheme);
    
    // Atualiza o ícone do botão
    const icon = themeToggle.querySelector('i');
    if (newTheme === 'dark') {
        icon.className = 'fas fa-sun';
        themeToggle.setAttribute('title', 'Modo claro');
    } else {
        icon.className = 'fas fa-moon';
        themeToggle.setAttribute('title', 'Modo escuro');
    }
    
    // Salva a preferência no localStorage
    localStorage.setItem('theme', newTheme);
});

// Carrega o tema salvo na inicialização
function loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    const icon = themeToggle.querySelector('i');
    if (savedTheme === 'dark') {
        icon.className = 'fas fa-sun';
        themeToggle.setAttribute('title', 'Modo claro');
    } else {
        icon.className = 'fas fa-moon';
        themeToggle.setAttribute('title', 'Modo escuro');
    }
}

// Controle de navegação entre páginas
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove classe active de todos os links
        navLinks.forEach(l => l.classList.remove('active'));
        
        // Adiciona classe active ao link clicado
        link.classList.add('active');
        
        // Atualiza o título da página
        const pageTitle = document.querySelector('.page-title');
        const navText = link.querySelector('.nav-text').textContent;
        pageTitle.textContent = navText;
        
        // Fecha sidebar em dispositivos móveis
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        }
        
        // Aqui você pode adicionar lógica para carregar diferentes conteúdos
        // baseado na página selecionada
        loadPageContent(link.getAttribute('data-page'));
    });
});

// Função para carregar conteúdo das páginas
function loadPageContent(page) {
    const content = document.querySelector('.content');
    
    // Exemplo de conteúdo para diferentes páginas
    switch(page) {
        case 'dashboard':
            // Já é o conteúdo padrão
            break;
        case 'pessoas':
            content.innerHTML = `
                <div class="alert">
                    <i class="fas fa-users"></i>
                    <div>Gerenciamento de Pessoas - Alunos, Professores e Funcionários</div>
                </div>
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-header">
                            <div class="stat-title">Total de Alunos</div>
                            <div class="stat-icon students">
                                <i class="fas fa-user-graduate"></i>
                            </div>
                        </div>
                        <div class="stat-value">245</div>
                        <div class="stat-subtitle">Ativos no sistema</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-header">
                            <div class="stat-title">Professores</div>
                            <div class="stat-icon revenue">
                                <i class="fas fa-chalkboard-teacher"></i>
                            </div>
                        </div>
                        <div class="stat-value">18</div>
                        <div class="stat-subtitle">Corpo docente ativo</div>
                    </div>
                </div>
            `;
            break;
        case 'financeiro':
            content.innerHTML = `
                <div class="alert">
                    <i class="fas fa-chart-line"></i>
                    <div>Controle Financeiro - Receitas, Despesas e Fluxo de Caixa</div>
                </div>
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-header">
                            <div class="stat-title">Receita Total</div>
                            <div class="stat-icon revenue">
                                <i class="fas fa-arrow-up"></i>
                            </div>
                        </div>
                        <div class="stat-value">1.250.000,00 Kz</div>
                        <div class="stat-subtitle">Este mês</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-header">
                            <div class="stat-title">Despesas Total</div>
                            <div class="stat-icon expenses">
                                <i class="fas fa-arrow-down"></i>
                            </div>
                        </div>
                        <div class="stat-value">680.000,00 Kz</div>
                        <div class="stat-subtitle">Este mês</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-header">
                            <div class="stat-title">Lucro Líquido</div>
                            <div class="stat-icon balance">
                                <i class="fas fa-chart-line"></i>
                            </div>
                        </div>
                        <div class="stat-value">570.000,00 Kz</div>
                        <div class="stat-subtitle">Este mês</div>
                    </div>
                </div>
            `;
            break;
        case 'turmas':
            content.innerHTML = `
                <div class="alert">
                    <i class="fas fa-chalkboard-teacher"></i>
                    <div>Gestão de Turmas e Disciplinas - Organize suas aulas e horários</div>
                </div>
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-header">
                            <div class="stat-title">Turmas Ativas</div>
                            <div class="stat-icon classes">
                                <i class="fas fa-chalkboard"></i>
                            </div>
                        </div>
                        <div class="stat-value">12</div>
                        <div class="stat-subtitle">Em funcionamento</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-header">
                            <div class="stat-title">Disciplinas</div>
                            <div class="stat-icon enrollments">
                                <i class="fas fa-book"></i>
                            </div>
                        </div>
                        <div class="stat-value">28</div>
                        <div class="stat-subtitle">Cadastradas</div>
                    </div>
                </div>
            `;
            break;
        default:
            content.innerHTML = `
                <div class="alert">
                    <i class="fas fa-construction"></i>
                    <div>Página em Desenvolvimento - Esta funcionalidade estará disponível em breve!</div>
                </div>
                <div class="video-section">
                    <div class="video-content">
                        <div class="video-logo">
                            <i class="fas fa-tools"></i>
                        </div>
                        <div class="video-text">
                            <h3 class="video-title">Funcionalidade em Desenvolvimento</h3>
                            <p class="video-description">
                                Esta seção está sendo desenvolvida e estará disponível na próxima atualização do sistema.
                            </p>
                        </div>
                    </div>
                </div>
            `;
    }
}

// Controle responsivo da sidebar
function handleResize() {
    if (window.innerWidth > 768) {
        // Em telas grandes, remove classes de mobile
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    }
}

// Animação de entrada dos cards
function animateCards() {
    const cards = document.querySelectorAll('.stat-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Função para formatar números em moeda angolana
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-AO', {
        style: 'currency',
        currency: 'AOA'
    }).format(value).replace('AOA', 'Kz');
}

// Função para atualizar dados em tempo real (simulação)
function updateRealTimeData() {
    // Simula atualização de dados a cada 30 segundos
    setInterval(() => {
        const randomCard = document.querySelectorAll('.stat-value')[Math.floor(Math.random() * 8)];
        if (randomCard) {
            randomCard.style.color = 'var(--amarelo-primario)';
            setTimeout(() => {
                randomCard.style.color = 'var(--text-primary)';
            }, 1000);
        }
    }, 30000);
}

// Função de inicialização
function init() {
    // Carrega tema salvo
    loadSavedTheme();
    
    // Adiciona listener para redimensionamento
    window.addEventListener('resize', handleResize);
    
    // Anima cards na inicialização
    setTimeout(animateCards, 500);
    
    // Inicia atualizações em tempo real
    updateRealTimeData();
    
    // Adiciona efeito de digitação no título
    typeWriterEffect();
}

// Efeito de digitação no título principal
function typeWriterEffect() {
    const title = document.querySelector('.empresa-nome');
    const text = title.textContent;
    title.textContent = '';
    
    let i = 0;
    const timer = setInterval(() => {
        if (i < text.length) {
            title.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(timer);
        }
    }, 100);
}

// Adiciona tooltips aos ícones
function addTooltips() {
    const icons = document.querySelectorAll('.stat-icon');
    icons.forEach(icon => {
        icon.addEventListener('mouseenter', (e) => {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = 'Clique para mais detalhes';
            tooltip.style.cssText = `
                position: absolute;
                background: var(--fundo-formulario);
                color: var(--branco);
                padding: 5px 10px;
                border-radius: 4px;
                font-size: 12px;
                z-index: 1000;
                top: -30px;
                left: 50%;
                transform: translateX(-50%);
                white-space: nowrap;
            `;
            icon.style.position = 'relative';
            icon.appendChild(tooltip);
        });
        
        icon.addEventListener('mouseleave', () => {
            const tooltip = icon.querySelector('.tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        });
    });
}

// Inicializa a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    init();
    addTooltips();
});

// Adiciona funcionalidade de busca rápida
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        // Aqui você pode implementar uma funcionalidade de busca
        alert('Funcionalidade de busca será implementada em breve!');
    }
});

// Console log para debug
console.log('Sistema de Gestão Escolar - Pensador do Futuro v1.0');
console.log('Desenvolvido com HTML5, CSS3 e JavaScript Vanilla');
console.log('Pressione Ctrl+K para busca rápida (em desenvolvimento)');