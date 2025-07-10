
// ========== INICIALIZAÇÃO DO SISTEMA ==========
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar o sistema quando a página for completamente carregada
    inicializarFormulario();
    configurarEventListeners();
});

// ========== DEFINIÇÃO DE VALORES E PREÇOS ==========
    
// Valores fixos
const valorCartao = 2500; // Valor do cartão de estudante em Kz (fixo para todas as classes)
    
// Valores de matrícula por classe
const valoresMatricula = {
    '10ª': 20000,
    '11ª': 22000,
    '12ª': 24000,
    '13ª': 26000
};

// Dados bancários para pagamentos
const dadosBancarios = {
    BIC: {
        express: '923 456 789',
        iban: 'AO06 0051 0000 1234 5678 9012 3'
    },
    Atlântico: {
        express: '924 567 890',
        iban: 'AO06 0040 0000 1234 5678 9012 3'
    },
    BAI: {
        express: '925 678 901',
        iban: 'AO06 0006 0000 1234 5678 9012 3'
    },
    BFA: {
        express: '926 789 012',
        iban: 'AO06 0006 0000 1234 5678 9012 3'
    },
    BPC: {
        express: '927 890 123',
        iban: 'AO06 0010 0000 1234 5678 9012 3'
    }
};

// ========== FUNÇÕES DE INICIALIZAÇÃO ==========

/**
 * Inicializa o formulário com valores padrão
 */
function inicializarFormulario() {
    // Gerar número aleatório para o aluno (4 dígitos)
    const numeroAlunoField = document.getElementById('numeroAluno');
    if (numeroAlunoField) {
        const numeroAluno = Math.floor(1000 + Math.random() * 9000);
        numeroAlunoField.value = numeroAluno;
    }
    
    // Definir o valor do cartão no formulário
    const valorCartaoField = document.getElementById('valorCartao');
    if (valorCartaoField) {
        valorCartaoField.value = formatarNumero(valorCartao);
    }
    
    // Atualizar o valor no resumo
    const resumoCartao = document.getElementById('resumo-cartao');
    if (resumoCartao) {
        resumoCartao.textContent = formatarNumero(valorCartao) + ' Kz';
    }
    
    // Inicializar campos vazios para evitar erros de referência nula
    atualizarValores();
}

/**
 * Configura todos os event listeners para os elementos do formulário
 */
function configurarEventListeners() {
    // Atualizar o valor da matrícula quando a classe for selecionada
    const classeSelect = document.getElementById('classe');
    if (classeSelect) {
        classeSelect.addEventListener('change', atualizarValores);
    }

    // Atualizar o valor da propina quando o curso for selecionado
    const cursoSelect = document.getElementById('curso');
    if (cursoSelect) {
        cursoSelect.addEventListener('change', atualizarValores);
    }

    // Configurar os métodos de pagamento
    const paymentOptions = document.querySelectorAll('.payment-option');
    paymentOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remover a classe active de todas as opções
            paymentOptions.forEach(opt => opt.classList.remove('active'));
            
            // Adicionar a classe active à opção selecionada
            this.classList.add('active');
            
            // Ocultar todos os detalhes de pagamento
            document.querySelectorAll('.payment-details').forEach(detail => {
                detail.classList.remove('active');
            });
            
            // Mostrar os detalhes da opção selecionada
            const paymentType = this.getAttribute('data-payment');
            const paymentDetails = document.getElementById(`${paymentType}-details`);
            if (paymentDetails) {
                paymentDetails.classList.add('active');
            }
        });
    });

    // Atualizar os dados bancários quando o banco for selecionado (Express)
    const bancosExpressSelect = document.getElementById('bancosExpress');
    if (bancosExpressSelect) {
        bancosExpressSelect.addEventListener('change', function() {
            const banco = this.value;
            const expressNumeroField = document.getElementById('expressNumero');
            
            if (banco && dadosBancarios[banco] && expressNumeroField) {
                expressNumeroField.value = dadosBancarios[banco].express;
            } else if (expressNumeroField) {
                expressNumeroField.value = '';
            }
        });
    }

    // Atualizar os dados bancários quando o banco for selecionado (IBAN)
    const bancosIbanSelect = document.getElementById('bancosIban');
    if (bancosIbanSelect) {
        bancosIbanSelect.addEventListener('change', function() {
            const banco = this.value;
            const ibanNumeroField = document.getElementById('ibanNumero');
            
            if (banco && dadosBancarios[banco] && ibanNumeroField) {
                ibanNumeroField.value = dadosBancarios[banco].iban;
            } else if (ibanNumeroField) {
                ibanNumeroField.value = '';
            }
        });
    }

    // Enviar o formulário
    const inscricaoForm = document.getElementById('inscricao-form');
    if (inscricaoForm) {
        inscricaoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Verificar se os termos foram aceitos
            const termosCheckbox = document.getElementById('termos');
            if (termosCheckbox && !termosCheckbox.checked) {
                alert('Você precisa aceitar os termos e condições para prosseguir.');
                return;
            }
            
            // Verificar se um método de pagamento foi selecionado
            if (!document.querySelector('.payment-option.active')) {
                alert('Por favor, selecione um método de pagamento.');
                return;
            }
            
            // Mostrar a tela de confirmação
            const formContainer = document.getElementById('form-container');
            const confirmationContainer = document.getElementById('confirmation-container');
            
            if (formContainer) {
                formContainer.style.display = 'none';
            }
            
            if (confirmationContainer) {
                confirmationContainer.style.display = 'block';
            }
            
            // Gerar número de matrícula (ano atual + número aleatório)
            const anoAtual = new Date().getFullYear();
            const numeroMatricula = `${anoAtual}${Math.floor(1000 + Math.random() * 9000)}`;
            
            const matriculaNumero = document.getElementById('matricula-numero');
            if (matriculaNumero) {
                matriculaNumero.textContent = numeroMatricula;
            }
            
            // Preencher recibo de matrícula
            preencherRecibo();
        });
    }

    // Botões da tela de confirmação
    const imprimirBtn = document.getElementById('imprimir');
    if (imprimirBtn) {
        imprimirBtn.addEventListener('click', function() {
            window.print();
        });
    }

    const salvarPdfBtn = document.getElementById('salvar-pdf');
    if (salvarPdfBtn) {
        salvarPdfBtn.addEventListener('click', function() {
            gerarPDF();
        });
    }

    const voltarInicioBtn = document.getElementById('voltar-inicio');
    if (voltarInicioBtn) {
        voltarInicioBtn.addEventListener('click', function() {
            window.location.href = 'paginainicial.html';
        });
    }
}

// ========== FUNÇÕES DE CÁLCULO E ATUALIZAÇÃO ==========

/**
 * Atualiza os valores baseados nas seleções de classe e curso
 */
function atualizarValores() {
    const classeSelect = document.getElementById('classe');
    const cursoSelect = document.getElementById('curso');
    
    const classeSelected = classeSelect ? classeSelect.value : '';
    const cursoSelected = cursoSelect ? cursoSelect.value : '';
    
    // Atualizar valor da matrícula com base na classe selecionada
    const valorMatriculaField = document.getElementById('valorMatricula');
    const resumoMatricula = document.getElementById('resumo-matricula');
    
    if (classeSelected && valoresMatricula[classeSelected]) {
        const valorMatricula = valoresMatricula[classeSelected];
        
        if (valorMatriculaField) {
            valorMatriculaField.value = formatarNumero(valorMatricula);
        }
        
        if (resumoMatricula) {
            resumoMatricula.textContent = formatarNumero(valorMatricula) + ' Kz';
        }
    } else {
        if (valorMatriculaField) {
            valorMatriculaField.value = '';
        }
        
        if (resumoMatricula) {
            resumoMatricula.textContent = '0 Kz';
        }
    }
    
    // Atualizar valor da propina com base no curso selecionado
    const valorPropinaField = document.getElementById('valorPropina');
    const resumoPropina = document.getElementById('resumo-propina');
    
    if (cursoSelect) {
        const cursoOption = cursoSelect.querySelector(`option[value="${cursoSelected}"]`);
        
        if (cursoOption && cursoOption.dataset.price) {
            const valorPropina = parseInt(cursoOption.dataset.price);
            
            if (valorPropinaField) {
                valorPropinaField.value = formatarNumero(valorPropina);
            }
            
            if (resumoPropina) {
                resumoPropina.textContent = formatarNumero(valorPropina) + ' Kz';
            }
        } else {
            if (valorPropinaField) {
                valorPropinaField.value = '';
            }
            
            if (resumoPropina) {
                resumoPropina.textContent = '0 Kz';
            }
        }
    }
    
    // Calcular o total
    calcularTotal();
}

/**
 * Calcula o total a pagar com base nos valores de matrícula e propina
 */
function calcularTotal() {
    const valorMatriculaField = document.getElementById('valorMatricula');
    const valorPropinaField = document.getElementById('valorPropina');
    const resumoTotal = document.getElementById('resumo-total');
    
    // Obter os valores como texto
    const valorMatriculaText = valorMatriculaField ? valorMatriculaField.value : '0';
    const valorPropinaText = valorPropinaField ? valorPropinaField.value : '0';
    
    // Converter para números (remover formatação)
    const valorMatricula = valorMatriculaText ? parseInt(valorMatriculaText.replace(/\D/g, '')) : 0;
    const valorPropina = valorPropinaText ? parseInt(valorPropinaText.replace(/\D/g, '')) : 0;
    
    // Calcular total
    const total = valorMatricula + valorCartao + valorPropina;
    
    // Atualizar resumo
    if (resumoTotal) {
        resumoTotal.textContent = formatarNumero(total) + ' Kz';
    }
}

// ========== FUNÇÕES DE EXPORTAÇÃO E RELATÓRIOS ==========

/**
 * Gera o PDF do comprovante de matrícula com todas as informações
 * formatadas para caber em uma única página
 */
function gerarPDF() {
    const receiptContent = document.getElementById('receipt-content');
    
    if (!receiptContent || typeof html2pdf !== 'function') {
        alert('A biblioteca html2pdf não está disponível ou o conteúdo do recibo não foi encontrado.');
        return;
    }
    
    // Salvar o estilo original para restaurar depois da geração do PDF
    const originalStyle = receiptContent.style.cssText;
    
    // Aplicar estilos de impressão otimizados para o PDF
    receiptContent.style.cssText = 'font-size: 12px; max-width: 700px; margin: 0 auto;';
    
    // Encontrar todas as seções do recibo e ajustar os estilos
    const sections = receiptContent.querySelectorAll('.receipt-section');
    
    // Salvar os estilos originais das seções
    const originalSectionStyles = [];
    sections.forEach(section => {
        originalSectionStyles.push(section.style.cssText);
        section.style.cssText = 'margin-bottom: 10px; padding: 5px;';
        
        // Reduzir o espaçamento nos parágrafos
        const paragraphs = section.querySelectorAll('p');
        paragraphs.forEach(p => {
            p.style.margin = '4px 0';
        });
        
        // Reduzir o tamanho dos cabeçalhos
        const headers = section.querySelectorAll('h4');
        headers.forEach(h => {
            h.style.marginBottom = '5px';
        });
    });
    
    // Configurações avançadas para o PDF
    const opt = {
        margin: [10, 10, 10, 10], // margens em mm [topo, direita, baixo, esquerda]
        filename: 'comprovante_matricula.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
            scale: 2,           // Aumenta a qualidade/resolução
            useCORS: true,      // Permite imagens de outros domínios
            letterRendering: true, // Melhora a qualidade do texto
            logging: false,     // Desativa logs para melhor performance
            scrollX: 0,         // Evita problemas de scroll
            scrollY: 0,
            windowWidth: document.documentElement.offsetWidth, // Define largura do documento
            windowHeight: document.documentElement.offsetHeight // Define altura do documento
        },
        jsPDF: { 
            unit: 'mm', 
            format: 'a4', 
            orientation: 'portrait',
            compress: true      // Comprime o PDF para reduzir tamanho
        },
        pagebreak: { mode: 'avoid-all' } // Tenta evitar quebras de página em elementos
    };
    
    // Gerar o PDF com as configurações otimizadas
    html2pdf().set(opt).from(receiptContent).save().then(() => {
        // Restaurar os estilos originais após a geração do PDF
        receiptContent.style.cssText = originalStyle;
        
        // Restaurar os estilos originais das seções
        sections.forEach((section, index) => {
            section.style.cssText = originalSectionStyles[index];
            
            // Restaurar os estilos dos parágrafos
            const paragraphs = section.querySelectorAll('p');
            paragraphs.forEach(p => {
                p.style.removeProperty('margin');
            });
            
            // Restaurar os estilos dos cabeçalhos
            const headers = section.querySelectorAll('h4');
            headers.forEach(h => {
                h.style.removeProperty('margin-bottom');
            });
        });
        
        console.log('PDF gerado com sucesso!');
    }).catch(error => {
        console.error('Erro ao gerar o PDF:', error);
        alert('Ocorreu um erro ao gerar o PDF. Por favor, tente novamente.');
    });
}

// ========== UTILITÁRIOS ==========

/**
 * Formata números com separadores de milhar para melhor legibilidade
 * @param {number} numero - O número a ser formatado
 * @returns {string} O número formatado com separadores de milhar
 */
function formatarNumero(numero) {
    return numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/**
 * Preenche o recibo com os dados do formulário preenchido
 */
function preencherRecibo() {
    const reciboDetalhes = document.getElementById('recibo-detalhes');
    if (!reciboDetalhes) return;
    
    // Obter valores seguros dos campos (evitando nulls)
    const obterValorSeguro = (id) => {
        const elemento = document.getElementById(id);
        return elemento ? elemento.value : '';
    };
    
    const obterTextoSeguro = (id) => {
        const elemento = document.getElementById(id);
        return elemento ? elemento.textContent : '';
    };
    
    // Obter o método de pagamento selecionado
    const metodoPagamento = document.querySelector('.payment-option.active');
    const metodoPagamentoTexto = metodoPagamento ? metodoPagamento.textContent.trim() : 'Não especificado';
    
    // Formatação da data atual
    const dataAtual = new Date().toLocaleDateString('pt-BR');
    
    // Criar HTML com todos os detalhes relevantes
    const html = `
        <div class="receipt-header" style="text-align: center; margin-bottom: 15px;">
            <h3 style="margin: 5px 0;">X Academy - Comprovante de Matrícula</h3>
            <p><strong>Data:</strong> ${dataAtual}</p>
            <p><strong>Nº de Matrícula:</strong> ${obterTextoSeguro('matricula-numero')}</p>
        </div>
        
        <div class="receipt-section">
            <h4><i class="fas fa-user"></i> Dados Pessoais</h4>
            <p><strong>Nome:</strong> ${obterValorSeguro('nome')}</p>
            <p><strong>Número do Aluno:</strong> ${obterValorSeguro('numeroAluno')}</p>
            <p><strong>Identificação:</strong> ${obterValorSeguro('identificacao')}</p>
            <p><strong>Contato:</strong> ${obterValorSeguro('telefone')}</p>
        </div>
        
        <div class="receipt-section">
            <h4><i class="fas fa-graduation-cap"></i> Informações Acadêmicas</h4>
            <p><strong>Escola:</strong> ${obterValorSeguro('escola')}</p>
            <p><strong>Classe:</strong> ${obterValorSeguro('classe')}</p>
            <p><strong>Curso:</strong> ${obterValorSeguro('curso')}</p>
            <p><strong>Período:</strong> ${obterValorSeguro('periodo')}</p>
            <p><strong>Sala/Turma:</strong> ${obterValorSeguro('sala')} / ${obterValorSeguro('turma')}</p>
        </div>
        
        <div class="receipt-section">
            <h4><i class="fas fa-money-bill-wave"></i> Pagamento</h4>
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td><strong>Matrícula:</strong></td>
                    <td style="text-align: right;">${obterValorSeguro('valorMatricula')} Kz</td>
                </tr>
                <tr>
                    <td><strong>Cartão de Estudante:</strong></td>
                    <td style="text-align: right;">${obterValorSeguro('valorCartao')} Kz</td>
                </tr>
                <tr>
                    <td><strong>Propina Mensal:</strong></td>
                    <td style="text-align: right;">${obterValorSeguro('valorPropina')} Kz</td>
                </tr>
                <tr style="font-weight: bold;">
                    <td><strong>Total Pago:</strong></td>
                    <td style="text-align: right;">${obterTextoSeguro('resumo-total')}</td>
                </tr>
            </table>
            <p><strong>Método de Pagamento:</strong> ${metodoPagamentoTexto}</p>
        </div>
        
        <div class="receipt-section">
            <h4><i class="fas fa-user-tie"></i> Responsável Financeiro</h4>
            <p><strong>Nome:</strong> ${obterValorSeguro('nomeResponsavel')}</p>
            <p><strong>BI:</strong> ${obterValorSeguro('biResponsavel')}</p>
            <p><strong>Contato:</strong> ${obterValorSeguro('telefoneResponsavel')}</p>
        </div>
        
        <div class="receipt-footer" style="text-align: center; margin-top: 20px; border-top: 1px dashed #ccc; padding-top: 10px;">
            <p>X Academy - Formando o Futuro</p>
            <p>Este documento serve como comprovante oficial de matrícula.</p>
        </div>
    `;
    
    reciboDetalhes.innerHTML = html;
}