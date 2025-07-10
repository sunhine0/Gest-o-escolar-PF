// ===============================================
// Sistema de Boletim Escolar - Código Completo
// ===============================================

// Dados dos cursos e suas disciplinas (arrays com as matérias para cada curso)
const cursos = {
    "Informática de Gestão": [
        "Matemática Aplicada", "Programação", "Redes de Computadores", "Sistemas de Informação", 
        "Gestão de Projetos", "Base de Dados", "Estatística Aplicada", "Empreendedorismo", "Inglês Técnico"
    ],
    "Contabilidade": [
        "Princípios de Contabilidade", "Contabilidade Financeira", "Contabilidade de Custos", "Análise de Balanços", 
        "Legislação Tributária", "Auditoria", "Sistemas Contábeis", "Planejamento Financeiro"
    ],
    "Eletricidade": [
        "Circuitos Elétricos", "Sistemas Digitais", "Eletrônica", "Máquinas Elétricas", 
        "Instalações Elétricas", "Automação", "Desenho Técnico", "Física Aplicada"
    ],
    "Gestão Empresarial": [
        "Matemática Financeira", "Economia", "Contabilidade", "Marketing", "Direito Empresarial", 
        "Gestão de Recursos Humanos", "Estatística", "Informática Aplicada", "Planejamento Estratégico"
    ],
    "Técnicas de Enfermagem": [
        "Anatomia Humana", "Fisiologia", "Técnicas de Enfermagem", "Primeiros Socorros", 
        "Saúde Coletiva", "Farmacologia", "Ética Profissional", "Psicologia"
    ],
    "Análises Clínicas": [
        "Bioquímica", "Microbiologia", "Parasitologia", "Hematologia", 
        "Imunologia", "Técnicas de Coleta", "Análises Clínicas", "Patologia"
    ],
    "Gestão de Recursos Humanos": [
        "Comportamento Organizacional", "Direito Trabalhista", "Administração de Pessoal", "Psicologia Organizacional", 
        "Técnicas de Recrutamento e Seleção", "Gestão de Desempenho", "Liderança e Motivação", "Estatística Aplicada", 
        "Comunicação Empresarial"
    ],
    "Máquinas e Motores": [
        "Mecânica Aplicada", "Termodinâmica", "Motores a Combustão", "Manutenção Mecânica", 
        "Hidráulica e Pneumática", "Desenho Técnico", "Materiais", "Física Aplicada"
    ],
    "Economia e Jurídica": [
        "Microeconomia", "Macroeconomia", "Direito Constitucional", "Direito Civil", 
        "Direito Comercial", "Política Econômica", "Estatística", "Finanças Públicas"
    ],
    "Construção Civil": [
        "Materiais de Construção", "Estruturas", "Mecânica dos Solos", "Topografia", 
        "Desenho Técnico", "Instalações Prediais", "Orçamento e Planejamento", "Tecnologia das Construções"
    ]
};

// Dados das contas bancárias (para métodos de pagamento)
const contasBancarias = {
    express: { // Números de conta para transferências express
        "BIC": "9876543210",
        "Atlântico": "8765432109",
        "BAI": "7654321098",
        "BFA": "6543210987",
        "BPC": "5432109876"
    },
    iban: { // Números IBAN para transferências bancárias
        "BIC": "AO06000600000000000000000",
        "Atlântico": "AO07000700000000000000000",
        "BAI": "AO08000800000000000000000",
        "BFA": "AO09000900000000000000000",
        "BPC": "AO10001000000000000000000"
    }
};

// ===============================================
// Seleção de elementos do DOM (interface do usuário)
// ===============================================

// Elementos relacionados ao método de pagamento
const metodoPagamentoSelect = document.getElementById('metodoPagamento');
const expressOptions = document.getElementById('expressOptions');
const ibanOptions = document.getElementById('ibanOptions');
const bancaExpressSelect = document.getElementById('bancaExpress');
const bancaIBANSelect = document.getElementById('bancaIBAN');
const expressContaInput = document.getElementById('expressConta');
const ibanContaInput = document.getElementById('ibanConta');

// Elementos relacionados ao boletim e notas
const cursoSelect = document.getElementById('curso');
const classeSelect = document.getElementById('classe');
const trimestreSelect = document.getElementById('trimestre');
const gerarBoletimBtn = document.getElementById('gerarBoletim');
const calcularNotasBtn = document.getElementById('calcularNotas');
const salvarPDFBtn = document.getElementById('salvarPDF');
const imprimirBtn = document.getElementById('imprimir');
const boletimNotas = document.getElementById('boletimNotas');
const tabelaNotas = document.getElementById('tabelaNotas');
const boletimFinal = document.getElementById('boletimFinal');

// ===============================================
// Event Listeners - Gestão de Eventos da Interface
// ===============================================

// Mostrar/ocultar opções de pagamento com base na seleção
metodoPagamentoSelect.addEventListener('change', () => {
    const metodo = metodoPagamentoSelect.value;
    
    // Ocultar todas as opções primeiro
    expressOptions.style.display = 'none';
    ibanOptions.style.display = 'none';
    
    // Mostrar apenas a opção selecionada
    if (metodo === 'express') {
        expressOptions.style.display = 'block';
        atualizarContaBancaria('express');
    } else if (metodo === 'iban') {
        ibanOptions.style.display = 'block';
        atualizarContaBancaria('iban');
    }
});

// Atualizar conta bancária quando o banco for alterado (Express)
bancaExpressSelect.addEventListener('change', () => {
    atualizarContaBancaria('express');
});

// Atualizar conta bancária quando o banco for alterado (IBAN)
bancaIBANSelect.addEventListener('change', () => {
    atualizarContaBancaria('iban');
});

// Evento para o botão Gerar Boletim (mostrar formulário de notas)
gerarBoletimBtn.addEventListener('click', () => {
    const curso = cursoSelect.value;
    const trimestre = trimestreSelect.value;
    
    // Validação básica dos dados do aluno
    if (!curso || !document.getElementById('nomeAluno').value) {
        alert('Por favor, preencha os dados do aluno e selecione um curso');
        return;
    }
    
    // Gerar formulário de notas e exibi-lo
    gerarTabelaNotas(curso, trimestre);
    boletimNotas.classList.remove('hidden');
    boletimNotas.classList.add('visible');
    boletimFinal.style.display = 'none';
});

// Evento para o botão Calcular Notas
calcularNotasBtn.addEventListener('click', () => {
    const curso = cursoSelect.value;
    const trimestre = trimestreSelect.value;
    const disciplinas = cursos[curso];
    
    let notasValidas = true;
    let somaMedias = 0;
    
    // Lógica diferente para cada trimestre
    if (trimestre === "1" || trimestre === "2") {
        // Cálculo para 1º e 2º trimestres
        disciplinas.forEach((disciplina, index) => {
            // Obter valores dos inputs (com fallback para 0 se vazio/inválido)
            const mac = parseFloat(document.getElementById(`mac-${index}`).value) || 0;
            const npp = parseFloat(document.getElementById(`npp-${index}`).value) || 0;
            const npt = parseFloat(document.getElementById(`npt-${index}`).value) || 0;
            
            // Validar notas (entre 0 e 20)
            if ((mac < 0 || mac > 20) || (npp < 0 || npp > 20) || (npt < 0 || npt > 20)) {
                alert('Todas as notas devem estar entre 0 e 20');
                notasValidas = false;
                return;
            }
            
            // Calcular média do trimestre com pesos: (MAC × 0.25) + (NPP × 0.35) + (NPT × 0.4)
            const media = (mac * 0.25) + (npp * 0.35) + (npt * 0.4);
            document.getElementById(`mt-${index}`).textContent = media.toFixed(1);
            somaMedias += media;
        });
    } else {
        // Cálculo para 3º trimestre e média final
        disciplinas.forEach((disciplina, index) => {
            // Obter valores dos inputs
            const mt1 = parseFloat(document.getElementById(`mt1-${index}`).value) || 0;
            const mt2 = parseFloat(document.getElementById(`mt2-${index}`).value) || 0;
            const mac = parseFloat(document.getElementById(`mac-${index}`).value) || 0;
            const npp = parseFloat(document.getElementById(`npp-${index}`).value) || 0;
            const npt = parseFloat(document.getElementById(`npt-${index}`).value) || 0;
            
            // Validar notas
            if ((mt1 < 0 || mt1 > 20) || (mt2 < 0 || mt2 > 20) || 
                (mac < 0 || mac > 20) || (npp < 0 || npp > 20) || (npt < 0 || npt > 20)) {
                alert('Todas as notas devem estar entre 0 e 20');
                notasValidas = false;
                return;
            }
            
            // Calcular média do 3º trimestre
            const mt3 = (mac * 0.25) + (npp * 0.35) + (npt * 0.4);
            document.getElementById(`mt3-${index}`).textContent = mt3.toFixed(1);
            
            // Calcular média final (MT1 + MT2 + MT3) / 3
            const mediaFinal = (mt1 + mt2 + mt3) / 3;
            document.getElementById(`mf-${index}`).textContent = mediaFinal.toFixed(1);
            somaMedias += mediaFinal;
        });
    }
    
    // Se houver notas inválidas, interromper processamento
    if (!notasValidas) return;
    
    // Gerar boletim final com estatísticas calculadas
    const mediaFinal = somaMedias / disciplinas.length;
    const aproveitamento = (mediaFinal * 100) / 20; // Percentual de aproveitamento (escala 0-20)
    const situacao = mediaFinal >= 10 ? "APROVADO" : "REPROVADO"; // Aprovação com média ≥ 10
    
    // Preencher informações do aluno no boletim final
    document.getElementById('boletimEscola').textContent = document.getElementById('nomeEscola').value;
    document.getElementById('boletimAno').textContent = document.getElementById('anoLetivo').value;
    document.getElementById('boletimAluno').textContent = document.getElementById('nomeAluno').value;
    document.getElementById('boletimNumero').textContent = document.getElementById('numeroAluno').value;
    document.getElementById('boletimClasse').textContent = document.getElementById('classe').value;
    document.getElementById('boletimSala').textContent = document.getElementById('sala').value;
    document.getElementById('boletimTurma').textContent = document.getElementById('turma').value;
    document.getElementById('boletimPeriodo').textContent = document.getElementById('periodo').value;
    document.getElementById('boletimCurso').textContent = curso;
    document.getElementById('boletimTrimestre').textContent = trimestre + "º Trimestre";
    
    // Preencher informações de pagamento
    document.getElementById('metodoPagamentoInfo').textContent = 
        metodoPagamentoSelect.value === 'express' ? 'Express a Express' : 'IBAN';
    document.getElementById('bancoInfo').textContent = 
        metodoPagamentoSelect.value === 'express' ? bancaExpressSelect.value : bancaIBANSelect.value;
    document.getElementById('referenciaInfo').textContent = 
        metodoPagamentoSelect.value === 'express' ? expressContaInput.value : ibanContaInput.value;
    
    // Gerar e inserir tabela de resultados no boletim
    let tabelaResultados = gerarTabelaResultados(disciplinas, trimestre);
    document.getElementById('boletimTabelaResultados').innerHTML = tabelaResultados;
    
    // Preencher resultados finais
    document.getElementById('mediaFinal').textContent = mediaFinal.toFixed(1);
    document.getElementById('aproveitamento').textContent = aproveitamento.toFixed(1);
    
    // Definir situação (aprovado/reprovado) com classe CSS apropriada
    const situacaoElement = document.getElementById('situacao');
    situacaoElement.textContent = situacao;
    situacaoElement.className = situacao === "APROVADO" ? "aprovado" : "reprovado";
    
    // Mostrar boletim final
    boletimFinal.style.display = 'block';
});

// Evento para o botão Salvar em PDF
salvarPDFBtn.addEventListener('click', () => {
    // Garantir que o conteúdo esteja visível antes de gerar o PDF
    const boletimParaImprimir = document.getElementById('boletimParaImprimir');
    
    // Certificar que boletimParaImprimir contém todas as informações necessárias
    if (!boletimParaImprimir || !boletimParaImprimir.innerHTML.trim()) {
        alert('Não há dados suficientes para gerar o PDF. Por favor, preencha o boletim primeiro.');
        return;
    }
    
    // Ocultar temporariamente elementos que não devem aparecer no PDF
    const elementosOcultar = document.querySelectorAll('.no-print');
    elementosOcultar.forEach(el => {
        el.dataset.displayOriginal = el.style.display; // Guardar estilo original
        el.style.display = 'none';
    });
    
    // Configurações para o PDF
    const options = {
        margin: 10,  // Aumentar margem para melhor visualização
        filename: `boletim_${document.getElementById('nomeAluno').value.replace(/\s+/g, '_')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
            scale: 2,  // Aumentar escala para melhor qualidade
            useCORS: true,  // Permitir recursos de origens cruzadas
            logging: false, // Desativar logs
            letterRendering: true  // Melhorar renderização de texto
        },
        jsPDF: { 
            unit: 'mm', 
            format: 'a4', 
            orientation: 'portrait',
            compress: true // Comprimir o PDF para tamanho menor
        }
    };
    
    // Gerar o PDF usando a biblioteca html2pdf
    html2pdf()
        .set(options)
        .from(boletimParaImprimir)
        .save()
        .then(() => {
            // Restaurar a visibilidade dos elementos ocultados
            elementosOcultar.forEach(el => {
                el.style.display = el.dataset.displayOriginal || '';
                delete el.dataset.displayOriginal;
            });
            
            console.log('PDF gerado com sucesso!');
        })
        .catch(error => {
            console.error('Erro ao gerar PDF:', error);
            alert('Ocorreu um erro ao gerar o PDF. Por favor, tente novamente.');
            
            // Restaurar a visibilidade mesmo em caso de erro
            elementosOcultar.forEach(el => {
                el.style.display = el.dataset.displayOriginal || '';
                delete el.dataset.displayOriginal;
            });
        });
});

// Evento para o botão Imprimir
imprimirBtn.addEventListener('click', () => {
    // Verificar se há dados para imprimir
    const boletimParaImprimir = document.getElementById('boletimParaImprimir');
    if (!boletimParaImprimir || !boletimParaImprimir.innerHTML.trim()) {
        alert('Não há dados suficientes para imprimir. Por favor, preencha o boletim primeiro.');
        return;
    }
    
    // Ocultar temporariamente elementos que não devem ser impressos
    const elementosOcultar = document.querySelectorAll('.no-print');
    elementosOcultar.forEach(el => {
        el.dataset.displayOriginal = el.style.display;
        el.style.display = 'none';
    });
    
    // Adicionar CSS temporário para impressão
    const styleTemp = document.createElement('style');
    styleTemp.id = 'print-style-temp';
    styleTemp.innerHTML = `
        @media print {
            body * {
                visibility: hidden;
            }
            #boletimParaImprimir, #boletimParaImprimir * {
                visibility: visible;
            }
            #boletimParaImprimir {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
            }
            .no-print {
                display: none !important;
            }
            @page {
                size: A4;
                margin: 10mm;
            }
        }
    `;
    document.head.appendChild(styleTemp);
    
    // Executar a impressão
    setTimeout(() => {
        window.print();
        
        // Remover o CSS temporário
        document.head.removeChild(styleTemp);
        
        // Restaurar a visibilidade dos elementos ocultados
        setTimeout(() => {
            elementosOcultar.forEach(el => {
                el.style.display = el.dataset.displayOriginal || '';
                delete el.dataset.displayOriginal;
            });
        }, 500);
    }, 300);
});

// ===============================================
// Funções de Utilidade
// ===============================================

// Função para atualizar a conta bancária com base na seleção do banco
function atualizarContaBancaria(tipo) {
    if (tipo === 'express') {
        const banco = bancaExpressSelect.value;
        expressContaInput.value = contasBancarias.express[banco];
    } else if (tipo === 'iban') {
        const banco = bancaIBANSelect.value;
        ibanContaInput.value = contasBancarias.iban[banco];
    }
}

// Função para gerar a tabela de notas baseada no curso e trimestre
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
        // Para 1º e 2º trimestres (mais simples)
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
        // Para o 3º trimestre (inclui trimestres anteriores e média final)
        tabela += `
                    <th>1º Trimestre</th>
                    <th>2º Trimestre</th>
                    <th>MAC</th>
                    <th>NPP</th>
                    <th>NPT</th>
                    <th>MT3</th>
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
                    <td><input type="number" min="0" max="20" class="input-number" id="mt1-${index}" placeholder="0-20"></td>
                    <td><input type="number" min="0" max="20" class="input-number" id="mt2-${index}" placeholder="0-20"></td>
                    <td><input type="number" min="0" max="20" class="input-number" id="mac-${index}" placeholder="0-20"></td>
                    <td><input type="number" min="0" max="20" class="input-number" id="npp-${index}" placeholder="0-20"></td>
                    <td><input type="number" min="0" max="20" class="input-number" id="npt-${index}" placeholder="0-20"></td>
                    <td id="mt3-${index}">--</td>
                    <td id="mf-${index}">--</td>
                </tr>
            `;
        });
    }
    
    // Fechar tabela
    tabela += `
            </tbody>
        </table>
    `;
    
    // Inserir tabela gerada no elemento HTML
    tabelaNotas.innerHTML = tabela;
}

// Função para gerar a tabela de resultados para o boletim final
function gerarTabelaResultados(disciplinas, trimestre) {
    let tabela = `
        <table>
            <thead>
                <tr>
                    <th>Disciplina</th>
    `;
    
    // Estrutura diferente para cada tipo de trimestre
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
        
        // Preencher com valores das notas inseridas
        disciplinas.forEach((disciplina, index) => {
            const mac = document.getElementById(`mac-${index}`).value;
            const npp = document.getElementById(`npp-${index}`).value;
            const npt = document.getElementById(`npt-${index}`).value;
            const mt = document.getElementById(`mt-${index}`).textContent;
            
            tabela += `
                <tr>
                    <td>${disciplina}</td>
                    <td>${mac}</td>
                    <td>${npp}</td>
                    <td>${npt}</td>
                    <td>${mt}</td>
                </tr>
            `;
        });
    } else {
        // Para o 3º trimestre (mais completo)
        tabela += `
                    <th>1º Trimestre</th>
                    <th>2º Trimestre</th>
                    <th>MAC</th>
                    <th>NPP</th>
                    <th>NPT</th>
                    <th>MT3</th>
                    <th>Média Final</th>
                </tr>
            </thead>
            <tbody>
        `;
        
        // Preencher com valores das notas inseridas
        disciplinas.forEach((disciplina, index) => {
            const mt1 = document.getElementById(`mt1-${index}`).value;
            const mt2 = document.getElementById(`mt2-${index}`).value;
            const mac = document.getElementById(`mac-${index}`).value;
            const npp = document.getElementById(`npp-${index}`).value;
            const npt = document.getElementById(`npt-${index}`).value;
            const mt3 = document.getElementById(`mt3-${index}`).textContent;
            const mf = document.getElementById(`mf-${index}`).textContent;
            
            tabela += `
                <tr>
                    <td>${disciplina}</td>
                    <td>${mt1}</td>
                    <td>${mt2}</td>
                    <td>${mac}</td>
                    <td>${npp}</td>
                    <td>${npt}</td>
                    <td>${mt3}</td>
                    <td>${mf}</td>
                </tr>
            `;
        });
    }
    
    // Fechar tabela
    tabela += `
            </tbody>
        </table>
    `;
    
    return tabela;
}

// Inicialização: atualizar valores das contas bancárias
atualizarContaBancaria('express');
atualizarContaBancaria('iban');