/**
 * Sistema de Boletim Escolar
 * Este código implementa um sistema de boletim escolar com cálculo de notas,
 * exibição de resultados e geração de boletins em PDF.
 */

// Dados dos cursos e suas disciplinas
const cursos = {
    "Informática de Gestão": [
        "Matemática Aplicada", "Programação", "Redes de Computadores", "Sistemas de Informação", 
        "Gestão de Projetos", "Base de Dados", "Estatística Aplicada", "Empreendedorismo", "Inglês Técnico"
    ],
    "Gestão Empresarial": [
        "Matemática Financeira", "Economia", "Contabilidade", "Marketing", "Direito Empresarial", 
        "Gestão de Recursos Humanos", "Estatística", "Informática Aplicada", "Planejamento Estratégico"
    ],
    "Gestão de Recursos Humanos": [
        "Comportamento Organizacional", "Direito Trabalhista", "Administração de Pessoal", "Psicologia Organizacional", 
        "Técnicas de Recrutamento e Seleção", "Gestão de Desempenho", "Liderança e Motivação", "Estatística Aplicada", 
        "Comunicação Empresarial"
    ],
    "Contabilidade": [
        "Princípios de Contabilidade", "Contabilidade Financeira", "Contabilidade de Custos", "Análise de Balanços", 
        "Legislação Tributária", "Auditoria", "Sistemas Contábeis", "Planejamento Financeiro"
    ]
};

// Mapeamento de navegação para cursos
const navMapCursos = {
    "informatica": "Informática de Gestão",
    "gestao": "Gestão Empresarial",
    "rh": "Gestão de Recursos Humanos",
    "contabilidade": "Contabilidade"
};

// Elementos do DOM
const cursoSelect = document.getElementById('curso');
const trimestreSelect = document.getElementById('trimestre');
const classeSelect = document.getElementById('classeAluno');
const gerarBoletimBtn = document.getElementById('gerarBoletim');
const calcularNotasBtn = document.getElementById('calcularNotas');
const salvarPDFBtn = document.getElementById('salvarPDF');
const imprimirBtn = document.getElementById('imprimir');
const limparAssinaturaBtn = document.getElementById('limparAssinatura');
const boletimNotas = document.getElementById('boletimNotas');
const tabelaNotas = document.getElementById('tabelaNotas');
const boletimFinal = document.getElementById('boletimFinal');
const cursoLinks = document.querySelectorAll('.curso-link');
const assinaturaCanvas = document.getElementById('assinaturaCanvas');
const dataBoletim = document.getElementById('dataBoletim');
const resultadoMensagem = document.getElementById('resultadoMensagem');

// Inicialização do canvas de assinatura
let ctx = assinaturaCanvas.getContext('2d');
let desenhando = false;
let ultimaPosicao = { x: 0, y: 0 };

/**
 * Configura a data atual no boletim
 */
function configurarDataAtual() {
    const dataAtual = new Date();
    const dataFormatada = dataAtual.toLocaleDateString('pt-BR');
    dataBoletim.textContent = dataFormatada;
}

/**
 * Inicializa o canvas para assinatura
 */
function inicializarCanvasAssinatura() {
    // Limpar o canvas
    ctx.clearRect(0, 0, assinaturaCanvas.width, assinaturaCanvas.height);
    
    // Configurar estilo de linha
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';
    
    // Eventos de mouse para desenho
    assinaturaCanvas.addEventListener('mousedown', iniciarDesenho);
    assinaturaCanvas.addEventListener('mousemove', desenhar);
    assinaturaCanvas.addEventListener('mouseup', pararDesenho);
    assinaturaCanvas.addEventListener('mouseout', pararDesenho);
    
    // Suporte a touch para dispositivos móveis
    assinaturaCanvas.addEventListener('touchstart', iniciarDesenhoTouch);
    assinaturaCanvas.addEventListener('touchmove', desenharTouch);
    assinaturaCanvas.addEventListener('touchend', pararDesenho);
}

/**
 * Inicia o desenho da assinatura com mouse
 */
function iniciarDesenho(e) {
    desenhando = true;
    ultimaPosicao = obterPosicao(e);
}

/**
 * Continua o desenho da assinatura com mouse
 */
function desenhar(e) {
    if (!desenhando) return;
    
    const posicaoAtual = obterPosicao(e);
    
    ctx.beginPath();
    ctx.moveTo(ultimaPosicao.x, ultimaPosicao.y);
    ctx.lineTo(posicaoAtual.x, posicaoAtual.y);
    ctx.stroke();
    
    ultimaPosicao = posicaoAtual;
}

/**
 * Para o desenho da assinatura
 */
function pararDesenho() {
    desenhando = false;
}

/**
 * Obtém a posição do mouse no canvas
 */
function obterPosicao(e) {
    const rect = assinaturaCanvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}

/**
 * Inicia o desenho da assinatura com toque
 */
function iniciarDesenhoTouch(e) {
    e.preventDefault();
    desenhando = true;
    ultimaPosicao = obterPosicaoTouch(e);
}

/**
 * Continua o desenho da assinatura com toque
 */
function desenharTouch(e) {
    e.preventDefault();
    if (!desenhando) return;
    
    const posicaoAtual = obterPosicaoTouch(e);
    
    ctx.beginPath();
    ctx.moveTo(ultimaPosicao.x, ultimaPosicao.y);
    ctx.lineTo(posicaoAtual.x, posicaoAtual.y);
    ctx.stroke();
    
    ultimaPosicao = posicaoAtual;
}

/**
 * Obtém a posição do toque no canvas
 */
function obterPosicaoTouch(e) {
    const rect = assinaturaCanvas.getBoundingClientRect();
    return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
    };
}

/**
 * Gera a tabela de notas baseada no curso e trimestre selecionados
 */
function gerarTabelaNotas(curso, trimestre) {
    const disciplinas = cursos[curso];
    let tabela = `
        <table>
            <thead>
                <tr>
                    <th>Disciplina</th>
    `;
    
    // Cabeçalhos diferentes para cada trimestre
    if (trimestre === "1" || trimestre === "2") {
        tabela += `
                    <th>MAC</th>
                    <th>NPP</th>
                    <th>NPT</th>
                    <th>MT${trimestre}</th>
                </tr>
            </thead>
            <tbody>
        `;
        
        // Linhas para cada disciplina
        disciplinas.forEach((disciplina, index) => {
            tabela += `
                <tr>
                    <td>${disciplina}</td>
                    <td><input type="number" min="0" max="20" class="input-number" id="mac-${index}" placeholder="0-20"></td>
                    <td><input type="number" min="0" max="20" class="input-number" id="npp-${index}" placeholder="0-20"></td>
                    <td><input type="number" min="0" max="20" class="input-number" id="npt-${index}" placeholder="0-20"></td>
                    <td id="mt-${index}">--</td>
                </tr>
            `;
        });
    } else {
        // Para o 3º trimestre, mostrar todos os trimestres
        tabela += `
                    <th>1º Trimestre</th>
                    <th>2º Trimestre</th>
                    <th>3º Trimestre</th>
                    <th>Média Final</th>
                </tr>
            </thead>
            <tbody>
        `;
        
        // Linhas para cada disciplina
        disciplinas.forEach((disciplina, index) => {
            tabela += `
                <tr>
                    <td>${disciplina}</td>
                    <td><input type="number" min="0" max="20" class="input-number" id="t1-${index}" placeholder="0-20"></td>
                    <td><input type="number" min="0" max="20" class="input-number" id="t2-${index}" placeholder="0-20"></td>
                    <td><input type="number" min="0" max="20" class="input-number" id="t3-${index}" placeholder="0-20"></td>
                    <td id="mf-${index}">--</td>
                </tr>
            `;
        });
    }
    
    tabela += `
            </tbody>
        </table>
    `;
    
    tabelaNotas.innerHTML = tabela;
}

/**
 * Exibe a mensagem de resultado com base na média e situação do aluno
 */
function exibirMensagemResultado(mediaGeral, aproveitamento, situacao) {
    const mensagem = document.createElement('div');
    mensagem.classList.add('resultado-mensagem');
    
    // Estilo da mensagem baseado na situação (aprovado/reprovado)
    const corFundo = situacao === 'APROVADO' ? '#dff0d8' : '#f2dede';
    const corTexto = situacao === 'APROVADO' ? '#3c763d' : '#a94442';
    
    mensagem.style.padding = '15px';
    mensagem.style.marginTop = '20px';
    mensagem.style.marginBottom = '20px';
    mensagem.style.borderRadius = '5px';
    mensagem.style.backgroundColor = corFundo;
    mensagem.style.color = corTexto;
    mensagem.style.textAlign = 'center';
    mensagem.style.fontWeight = 'bold';
    
    // Conteúdo da mensagem
    mensagem.innerHTML = `
        <p>Resultado: ${situacao}</p>
        <p>Média Final: ${mediaGeral.toFixed(1)}</p>
        <p>Aproveitamento: ${aproveitamento.toFixed(1)}%</p>
    `;
    
    // Adicionar a mensagem ao DOM
    if (resultadoMensagem) {
        resultadoMensagem.innerHTML = '';
        resultadoMensagem.appendChild(mensagem);
    } else {
        // Caso o elemento não exista, criar um novo
        const novoResultado = document.createElement('div');
        novoResultado.id = 'resultadoMensagem';
        novoResultado.appendChild(mensagem);
        boletimFinal.appendChild(novoResultado);
    }
}

// Configurar eventos

// Limpar assinatura
limparAssinaturaBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, assinaturaCanvas.width, assinaturaCanvas.height);
});

// Atualizar curso selecionado ao clicar nos links da navegação
cursoLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remover classe active de todos os links
        cursoLinks.forEach(l => l.classList.remove('active'));
        
        // Adicionar classe active ao link clicado
        link.classList.add('active');
        
        // Atualizar o select do curso
        const cursoDado = navMapCursos[link.getAttribute('data-curso')];
        cursoSelect.value = cursoDado;
    });
});

// Gerar Boletim (Mostrar o formulário de notas)
gerarBoletimBtn.addEventListener('click', () => {
    const curso = cursoSelect.value;
    const trimestre = trimestreSelect.value;
    
    if (!curso || !document.getElementById('nomeAluno').value) {
        alert('Por favor, preencha os dados do aluno e selecione um curso');
        return;
    }
    
    gerarTabelaNotas(curso, trimestre);
    boletimNotas.classList.remove('hidden');
    boletimNotas.classList.add('visible');
    boletimFinal.style.display = 'none';
});

// Calcular notas e exibir resultados
calcularNotasBtn.addEventListener('click', () => {
    const curso = cursoSelect.value;
    const trimestre = trimestreSelect.value;
    const disciplinas = cursos[curso];
    
    let resultadosHtml = '';
    let somaMedias = 0;
    
    if (trimestre === "1" || trimestre === "2") {
        resultadosHtml = `
            <table>
                <thead>
                    <tr>
                        <th>Disciplina</th>
                        <th>MAC</th>
                        <th>NPP</th>
                        <th>NPT</th>
                        <th>MT${trimestre}</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        disciplinas.forEach((disciplina, index) => {
            const mac = parseFloat(document.getElementById(`mac-${index}`).value) || 0;
            const npp = parseFloat(document.getElementById(`npp-${index}`).value) || 0;
            const npt = parseFloat(document.getElementById(`npt-${index}`).value) || 0;
            
            // Cálculo da média do trimestre: (MAC + NPP + NPT) / 3
            const media = (mac + npp + npt) / 3;
            somaMedias += media;
            
            // Atualizar o campo MT na tabela de entrada
            document.getElementById(`mt-${index}`).textContent = media.toFixed(1);
            
            resultadosHtml += `
                <tr>
                    <td>${disciplina}</td>
                    <td>${mac.toFixed(1)}</td>
                    <td>${npp.toFixed(1)}</td>
                    <td>${npt.toFixed(1)}</td>
                    <td>${media.toFixed(1)}</td>
                </tr>
            `;
        });
    } else {
        // Para o 3º trimestre
        resultadosHtml = `
            <table>
                <thead>
                    <tr>
                        <th>Disciplina</th>
                        <th>1º Trimestre</th>
                        <th>2º Trimestre</th>
                        <th>3º Trimestre</th>
                        <th>Média Final</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        disciplinas.forEach((disciplina, index) => {
            const t1 = parseFloat(document.getElementById(`t1-${index}`).value) || 0;
            const t2 = parseFloat(document.getElementById(`t2-${index}`).value) || 0;
            const t3 = parseFloat(document.getElementById(`t3-${index}`).value) || 0;
            
            // Cálculo da média final: (T1 + T2 + T3) / 3
            const mediaFinal = (t1 + t2 + t3) / 3;
            somaMedias += mediaFinal;
            
            // Atualizar o campo MF na tabela de entrada
            document.getElementById(`mf-${index}`).textContent = mediaFinal.toFixed(1);
            
            resultadosHtml += `
                <tr>
                    <td>${disciplina}</td>
                    <td>${t1.toFixed(1)}</td>
                    <td>${t2.toFixed(1)}</td>
                    <td>${t3.toFixed(1)}</td>
                    <td>${mediaFinal.toFixed(1)}</td>
                </tr>
            `;
        });
    }
    
    resultadosHtml += `
            </tbody>
        </table>
    `;
    
    // Calcular média geral
    const mediaGeral = somaMedias / disciplinas.length;
    const aproveitamento = (mediaGeral / 20) * 100;
    const situacao = mediaGeral >= 10 ? 'APROVADO' : 'REPROVADO';
    const situacaoClass = mediaGeral >= 10 ? 'aprovado' : 'reprovado';
    
    // Preencher os dados do boletim
    document.getElementById('boletimEscola').textContent = document.getElementById('nomeEscola').value;
    document.getElementById('boletimAno').textContent = document.getElementById('anoLetivo').value;
    document.getElementById('boletimAluno').textContent = document.getElementById('nomeAluno').value;
    document.getElementById('boletimTurma').textContent = classeSelect.value;
    document.getElementById('boletimCurso').textContent = cursoSelect.value;
    document.getElementById('boletimTrimestre').textContent = `${trimestre}º Trimestre`;
    document.getElementById('boletimNotas').innerHTML = resultadosHtml;
    document.getElementById('mediaGeral').textContent = mediaGeral.toFixed(1);
    document.getElementById('aproveitamento').textContent = `${aproveitamento.toFixed(1)}%`;
    document.getElementById('situacao').textContent = situacao;
    document.getElementById('situacao').className = situacaoClass;
    
    // Exibir mensagem de resultado
    exibirMensagemResultado(mediaGeral, aproveitamento, situacao);
    
    // Mostrar o boletim final
    boletimNotas.classList.remove('visible');
    boletimNotas.classList.add('hidden');
    boletimFinal.style.display = 'block';
});

// Salvar como PDF
salvarPDFBtn.addEventListener('click', () => {
    const nomeAluno = document.getElementById('nomeAluno').value;
    const curso = cursoSelect.value;
    const trimestre = trimestreSelect.value;
    
    // Configurar opções para impressão/PDF
    html2pdf().from(boletimFinal).set({
        margin: 10,
        filename: `Boletim_${nomeAluno}_${curso}_${trimestre}Trimestre.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }).save();
});

// Imprimir boletim
imprimirBtn.addEventListener('click', () => {
    window.print();
});

// Inicializar o aplicativo
function inicializar() {
    // Preencher o dropdown de cursos
    Object.keys(cursos).forEach(curso => {
        const option = document.createElement('option');
        option.value = curso;
        option.textContent = curso;
        cursoSelect.appendChild(option);
    });
    
    // Inicializar o canvas de assinatura
    inicializarCanvasAssinatura();
    
    // Configurar data atual
    configurarDataAtual();
    
    // Adicionar os botões de imprimir e salvar PDF se não existirem
    if (!document.getElementById('botoesFinal')) {
        const botoesFinal = document.createElement('div');
        botoesFinal.id = 'botoesFinal';
        botoesFinal.style.marginTop = '20px';
        botoesFinal.style.textAlign = 'center';
        
        const salvarPDFBtn = document.createElement('button');
        salvarPDFBtn.id = 'salvarPDF';
        salvarPDFBtn.textContent = 'Baixar PDF';
        salvarPDFBtn.className = 'btn btn-primary';
        salvarPDFBtn.style.marginRight = '10px';
        
        const imprimirBtn = document.createElement('button');
        imprimirBtn.id = 'imprimir';
        imprimirBtn.textContent = 'Imprimir';
        imprimirBtn.className = 'btn btn-secondary';
        
        botoesFinal.appendChild(salvarPDFBtn);
        botoesFinal.appendChild(imprimirBtn);
        
        boletimFinal.appendChild(botoesFinal);
        
        // Adicionar event listeners aos novos botões
        salvarPDFBtn.addEventListener('click', () => {
            const nomeAluno = document.getElementById('nomeAluno').value;
            const curso = cursoSelect.value;
            const trimestre = trimestreSelect.value;
            
            html2pdf().from(boletimFinal).set({
                margin: 10,
                filename: `Boletim_${nomeAluno}_${curso}_${trimestre}Trimestre.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            }).save();
        });
        
        imprimirBtn.addEventListener('click', () => {
            window.print();
        });
    }
}

disciplinas.forEach((disciplina, index) => {
    const t1 = parseFloat(document.getElementById(`t1-${index}`).value) || 0;
    const t2 = parseFloat(document.getElementById(`t2-${index}`).value) || 0;
    const t3 = parseFloat(document.getElementById(`t3-${index}`).value) || 0;
    
    // Cálculo da média final: (T1 + T2 + T3) / 3
    const mediaFinal = (t1 + t2 + t3) / 3;
    somaMedias += mediaFinal;
    
    // Atualizar o campo MF na tabela de entrada
    document.getElementById(`mf-${index}`).textContent = mediaFinal.toFixed(1);
    
    resultadosHtml += `
        <tr>
            <td>${disciplina}</td>
            <td>${t1.toFixed(1)}</td>
            <td>${t2.toFixed(1)}</td>
            <td>${t3.toFixed(1)}</td>
            <td>${mediaFinal.toFixed(1)}</td>
        </tr>
    `;
});




// Calcular média geral
const mediaGeral = somaMedias / disciplinas.length;
const aproveitamento = (mediaGeral / 20) * 100;
const situacao = mediaGeral >= 10 ? 'APROVADO' : 'REPROVADO';
const situacaoClass = mediaGeral >= 10 ? 'aprovado' : 'reprovado';

// Preencher os dados do boletim
document.getElementById('boletimEscola').textContent = document.getElementById('nomeEscola').value;
document.getElementById('boletimAno').textContent = document.getElementById('anoLetivo').value;
document.getElementById('boletimAluno').textContent = document.getElementById('nomeAluno').value;
document.getElementById('boletimTurma').textContent = document.getElementById('turma').value;
document.getElementById('boletimPeriodo').textContent = document.getElementById('periodo').value;
document.getElementById('boletimCurso').textContent = curso;
document.getElementById('boletimTrimestre').textContent = trimestre + "º Trimestre";

document.getElementById('boletimTabelaResultados').innerHTML = resultadosHtml;
document.getElementById('mediaFinal').textContent = mediaGeral.toFixed(1);
document.getElementById('aproveitamento').textContent = aproveitamento.toFixed(1);
document.getElementById('situacao').textContent = situacao;
document.getElementById('situacao').className = situacaoClass;

// Mostrar o boletim final
boletimFinal.style.display = 'block';


// Salvar em PDF
salvarPDFBtn.addEventListener('click', () => {
const conteudo = document.getElementById('boletimParaImprimir');
const options = {
margin: 10,
filename: `Boletim_${document.getElementById('nomeAluno').value.replace(/\s/g, '_')}.pdf`,
image: { type: 'jpeg', quality: 0.98 },
html2canvas: { scale: 2 },
jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
};

html2pdf().from(conteudo).set(options).save();
});

// Imprimir
imprimirBtn.addEventListener('click', () => {
window.print();
});

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', inicializar);