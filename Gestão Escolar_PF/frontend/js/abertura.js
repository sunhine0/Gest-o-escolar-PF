// Array com ícones profissionais relacionados aos cursos oferecidos pela instituição
const iconesCursosProfissionaisEnsino = [
    // Área de Recursos Humanos e Gestão de Pessoas
    'fas fa-users',
    'fas fa-handshake',
    'fas fa-user-tie',
    'fas fa-clipboard-list',
    'fas fa-user-graduate',
    
    // Área de Tecnologia da Informação e Sistemas
    'fas fa-laptop-code',
    'fas fa-server',
    'fas fa-database',
    'fas fa-network-wired',
    'fas fa-code',
    'fas fa-desktop',
    'fas fa-mobile-alt',
    'fas fa-wifi',
    'fas fa-microchip',
    
    // Área de Construção Civil e Arquitetura
    'fas fa-hard-hat',
    'fas fa-hammer',
    'fas fa-building',
    'fas fa-home',
    'fas fa-drafting-compass',
    'fas fa-ruler-combined',
    'fas fa-blueprint',
    
    // Área de Mecânica e Engenharia
    'fas fa-cogs',
    'fas fa-wrench',
    'fas fa-car',
    'fas fa-tools',
    'fas fa-engine',
    'fas fa-screwdriver',
    'fas fa-gear',
    
    // Área de Finanças, Contabilidade e Economia
    'fas fa-calculator',
    'fas fa-chart-line',
    'fas fa-coins',
    'fas fa-credit-card',
    'fas fa-file-invoice-dollar',
    'fas fa-piggy-bank',
    'fas fa-balance-scale',
    'fas fa-money-bill-wave',
    
    // Área de Gestão Empresarial e Administração
    'fas fa-chart-bar',
    'fas fa-briefcase',
    'fas fa-tasks',
    'fas fa-project-diagram',
    'fas fa-clipboard-check',
    'fas fa-bullseye',
    'fas fa-trophy',
    'fas fa-target',
    
    // Ícones educacionais gerais
    'fas fa-graduation-cap',
    'fas fa-book',
    'fas fa-bookmark',
    'fas fa-pencil-alt',
    'fas fa-chalkboard-teacher',
    'fas fa-award'
    
];

// Função para criar e animar ícones flutuantes no fundo da tela
function criarIconeFlutuanteFundo() {
    const elementoIcone = document.createElement('div');
    elementoIcone.className = 'icone-flutuante-fundo';
    
    // Criar elemento de ícone Font Awesome
    const iconeElemento = document.createElement('i');
    const classeIconeAleatoria = iconesCursosProfissionaisEnsino[Math.floor(Math.random() * iconesCursosProfissionaisEnsino.length)];
    iconeElemento.className = classeIconeAleatoria;
    elementoIcone.appendChild(iconeElemento);
    
    // Definir posição horizontal aleatória
    elementoIcone.style.left = Math.random() * 100 + '%';
    
    // Definir duração de animação variável para maior dinamismo
    elementoIcone.style.animationDuration = (Math.random() * 10 + 15) + 's';
    
    // Definir atraso inicial aleatório
    elementoIcone.style.animationDelay = Math.random() * 4 + 's';
    
    // Definir tamanho variável dos ícones
    const tamanhoAleatorio = Math.random() * 2.5 + 3;
    elementoIcone.style.fontSize = tamanhoAleatorio + 'rem';
    
    // Adicionar movimento lateral sutil durante a animação
    const movimentoLateralAleatorio = (Math.random() - 0.5) * 120;
    elementoIcone.style.setProperty('--movimento-lateral', movimentoLateralAleatorio + 'px');
    
    document.querySelector('.container-icones-fundo').appendChild(elementoIcone);
    
    // Remover o ícone após completar a animação
    setTimeout(() => {
        if (elementoIcone.parentNode) {
            elementoIcone.parentNode.removeChild(elementoIcone);
        }
    }, 25000);
}

// Criar ícones flutuantes em intervalos regulares
setInterval(criarIconeFlutuanteFundo, 900);

// Simular processo de carregamento do sistema
function simularCarregamentoSistema() {
    const textosCarregamento = [
        'Inicializando sistema...',
        'Carregando módulos...',
        'Conectando ao banco de dados...',
        'Verificando permissões...',
        'Preparando interface...',
        'Finalizando carregamento...',
        'Sistema pronto!'
    ];
    
    let indiceTextoAtual = 0;
    const elementoTextoCarregamento = document.querySelector('.texto-carregamento');
    
    const intervaloCicloTextos = setInterval(() => {
        if (indiceTextoAtual < textosCarregamento.length) {
            elementoTextoCarregamento.textContent = textosCarregamento[indiceTextoAtual];
            indiceTextoAtual++;
        } else {
            clearInterval(intervaloCicloTextos);
            // Aqui seria o redirecionamento para a tela principal
            setTimeout(() => {
                elementoTextoCarregamento.textContent = 'Redirecionando...';
                console.log('Redirecionando para a tela de login...');
                window.location.href = 'Login_do_Sistema.html'; // Descomente para usar em produção
            }, 1000);
        }
    }, 800);
}

// Função para aplicar efeitos visuais adicionais
function aplicarEfeitosVisuaisExtras() {
    // Adicionar efeito de partículas sutis
    const containerPrincipal = document.querySelector('.container-tela-abertura');
    
    // Criar efeito de brilho pulsante no container
    setInterval(() => {
        containerPrincipal.style.boxShadow = `
            0 30px 90px rgba(0, 0, 0, 0.2),
            0 0 ${50 + Math.random() * 30}px rgba(255, 215, 0, ${0.3 + Math.random() * 0.2})
        `;
    }, 2000);
}

// Inicializar todos os efeitos quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    // Criar ícones iniciais para preenchimento imediato
    for (let contador = 0; contador < 8; contador++) {
        setTimeout(criarIconeFlutuanteFundo, contador * 900);
    }
    
    // Iniciar simulação de carregamento após um breve atraso
    setTimeout(simularCarregamentoSistema, 1500);
    
    // Aplicar efeitos visuais extras
    setTimeout(aplicarEfeitosVisuaisExtras, 2000);
});

// Adicionar interatividade extra para demonstração
document.querySelector('.container-tela-abertura').addEventListener('click', function() {
    console.log('Tela de abertura clicada - Acelerando carregamento...');
    // Aqui poderia acelerar o processo de carregamento se necessário
});