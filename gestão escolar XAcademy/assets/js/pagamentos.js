document.addEventListener('DOMContentLoaded', function() {
    // ========================
    // DADOS E CONFIGURAÇÕES
    // ========================
    
    // Objeto para armazenar todos os dados do formulário 
    let formData = {};
    
    // Carregar dados salvos do localStorage se existirem
    if (localStorage.getItem('formData')) {
        formData = JSON.parse(localStorage.getItem('formData'));
        
        // Verificar em qual etapa o usuário estava e restaurar
        const savedStep = localStorage.getItem('currentStep') || 1;
        setTimeout(() => {
            // Preencher os campos com os dados salvos
            restoreFormFields();
            
            // Navegar para a etapa correta
            for (let i = 1; i < savedStep; i++) {
                document.querySelector(`.step[data-step="${i}"]`).classList.remove('active');
                document.querySelector(`.step[data-step="${i+1}"]`).classList.add('active');
                
                document.getElementById(`step${i}`).classList.remove('active');
                document.getElementById(`step${i+1}`).classList.add('active');
                
                // Se estamos indo para o passo 4 (confirmação), preenche o resumo
                if (i + 1 === 4) {
                    updatePaymentSummary();
                }
            }
        }, 100);
    }
    
    // Tabela de valores de propinas por curso (em Kwanzas Angolanos - AOA)
    const propinasPorCurso = {
        'Informática de Gestão': '25000 AOA',
        'Contabilidade': '23000 AOA',
        'Eletricidade': '27000 AOA',
        'Gestão Empresarial': '24000 AOA',
        'Técnicas de Enfermagem': '28000 AOA',
        'Análises Clínicas': '30000 AOA',
        'Gestão de Recursos Humanos': '24000 AOA',
        'Máquinas e Motores': '26000 AOA',
        'Economia e Jurídica': '25000 AOA',
        'Construção Civil': '27000 AOA'
    };
    
    // Dados bancários para pagamentos (contas fictícias)
    const dadosBancos = {
        'BIC': {
            express: '999988887777',
            iban: 'AO06000600000100037131195'
        },
        'Atlântico': {
            express: '888877776666',
            iban: 'AO06005500000200037134492'
        },
        'BAI': {
            express: '777766665555',
            iban: 'AO06004000000300037139983'
        },
        'BFA': {
            express: '666655554444',
            iban: 'AO06006000000400037135574'
        },
        'BPC': {
            express: '555544443333',
            iban: 'AO06001000000500037132265'
        }
    };
    
    // ========================
    // REFERÊNCIAS DE ELEMENTOS DOM
    // ========================
    
    // Elementos de navegação do formulário multi-etapas
    const steps = document.querySelectorAll('.step');
    const stepContents = document.querySelectorAll('.step-content');
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');
    
    // Elementos do formulário de pagamento
    const formaPagamento = document.getElementById('forma-pagamento');
    const expressContainer = document.getElementById('express-container');
    const ibanContainer = document.getElementById('iban-container');
    
    // Botões de ação final
    const pagarBtn = document.getElementById('btn-pagar');
    const imprimirBtn = document.getElementById('btn-imprimir');
    const salvarPdfBtn = document.getElementById('btn-salvar-pdf');
    const verBoletimBtn = document.getElementById('btn-ver-boletim');
    
    // ========================
    // EVENT LISTENERS
    // ========================
    
    // Atualiza o valor da propina quando o curso é selecionado
    document.getElementById('curso').addEventListener('change', function() {
        const valorPropinaInput = document.getElementById('valor-propina');
        valorPropinaInput.value = propinasPorCurso[this.value] || '';
        saveFormData();
    });
    
    // Alterna entre os métodos de pagamento (Express ou IBAN)
    formaPagamento.addEventListener('change', function() {
        if (this.value === 'express') {
            expressContainer.style.display = 'block';
            ibanContainer.style.display = 'none';
        } else if (this.value === 'iban') {
            expressContainer.style.display = 'none';
            ibanContainer.style.display = 'block';
        }
        saveFormData();
    });
    
    // Preenche automaticamente o número Express quando um banco é selecionado
    document.getElementById('banco-express').addEventListener('change', function() {
        const expressInfo = document.getElementById('express-info');
        expressInfo.value = dadosBancos[this.value]?.express || '';
        saveFormData();
    });
    
    // Preenche automaticamente o IBAN quando um banco é selecionado
    document.getElementById('banco-iban').addEventListener('change', function() {
        const ibanInfo = document.getElementById('iban-info');
        ibanInfo.value = dadosBancos[this.value]?.iban || '';
        saveFormData();
    });
    
    // Configura os botões de navegação para avançar entre etapas
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentStep = parseInt(this.closest('.step-content').id.replace('step', ''));
            goToNextStep(currentStep);
        });
    });
    
    // Configura os botões de navegação para voltar entre etapas
    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentStep = parseInt(this.closest('.step-content').id.replace('step', ''));
            goToPrevStep(currentStep);
        });
    });
    
    // Adicionar evento para permitir avançar com a tecla Enter
    stepContents.forEach(stepContent => {
        const inputs = stepContent.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const currentStep = parseInt(this.closest('.step-content').id.replace('step', ''));
                    // Não avançar se estiver no último campo do último passo
                    if (currentStep < 5) {
                        goToNextStep(currentStep);
                    } else if (currentStep === 4) {
                        // Se for o último passo, simular clique no botão pagar
                        pagarBtn.click();
                    }
                }
            });
            
            // Salvar dados quando um campo for alterado
            input.addEventListener('change', saveFormData);
            input.addEventListener('input', saveFormData);
        });
    });
    
    // Configura o botão de pagar para processar o pagamento
    pagarBtn.addEventListener('click', function() {
        // Verifica se os termos foram aceitos
        const aceitarTermos = document.getElementById('aceitar-termos');
        const assinatura = document.getElementById('assinatura');
        
        if (!aceitarTermos.checked) {
            alert('Por favor, aceite os termos de responsabilidade para continuar.');
            return;
        }
        
        if (!assinatura.value.trim()) {
            alert('Por favor, forneça sua assinatura para continuar.');
            return;
        }
        
        // Coleta dados do último passo
        collectFormData(4);
        
        // Oculta a visualização completa do recibo inicialmente
        document.getElementById('boletim-pagamento').style.display = 'none';
        document.getElementById('boletim-preview').style.display = 'block';
        
        // Atualiza navegação para o passo de confirmação
        document.querySelector('.step[data-step="4"]').classList.remove('active');
        document.querySelector('.step[data-step="5"]').classList.add('active');
        
        document.getElementById('step4').classList.remove('active');
        document.getElementById('step5').classList.add('active');
        
        // Atualizar o passo atual no localStorage
        localStorage.setItem('currentStep', 5);
        
        // Cria o recibo de pagamento
        createReceipt();
    });
    
    // Configura o botão de ver boletim completo
    if (verBoletimBtn) {
        verBoletimBtn.addEventListener('click', function() {
            document.getElementById('boletim-preview').style.display = 'none';
            document.getElementById('boletim-pagamento').style.display = 'block';
        });
    }
    
    // Configura o botão de imprimir
    imprimirBtn.addEventListener('click', function() {
        // Cria um estilo temporário para a impressão que oculta elementos indesejados
        const style = document.createElement('style');
        style.innerHTML = `
            @media print {
                body * {
                    visibility: hidden;
                }
                #boletim-pagamento, #boletim-pagamento * {
                    visibility: visible;
                }
                #boletim-pagamento {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                }
                .action-buttons {
                    display: none;
                }
            }
        `;
        document.head.appendChild(style);
        
        // Exibe o boletim completo para impressão
        document.getElementById('boletim-preview').style.display = 'none';
        document.getElementById('boletim-pagamento').style.display = 'block';
        
        window.print();
        
        // Remove o estilo temporário após a impressão
        setTimeout(() => {
            document.head.removeChild(style);
        }, 1000);
    });
    
    // Configura o botão de salvar como PDF
    salvarPdfBtn.addEventListener('click', function() {
        // Certifica-se de que o boletim completo está visível
        document.getElementById('boletim-preview').style.display = 'none';
        document.getElementById('boletim-pagamento').style.display = 'block';
        
        // Usa a biblioteca html2pdf (carregada externamente)
        const element = document.getElementById('boletim-pagamento');
        const opt = {
            margin:       [10, 10, 10, 10],
            filename:     `boletim_${formData.alunoNome.replace(/\s+/g, '_')}_${formData.mesPagamento}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2 },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        
        // Verifica se html2pdf está disponível
        if (typeof html2pdf !== 'undefined') {
            html2pdf().set(opt).from(element).save();
        } else {
            // Fallback usando o método de impressão do navegador
            window.print();
            alert('Para melhor qualidade, instale a biblioteca html2pdf.');
        }
    });
    
    // ========================
    // FUNÇÕES
    // ========================
    
    /**
     * Avança para o próximo passo do formulário
     * @param {number} currentStepNumber - O número do passo atual
     */
    function goToNextStep(currentStepNumber) {
        // Valida os campos do passo atual antes de avançar
        if (!validateCurrentStep(currentStepNumber)) {
            alert('Por favor, preencha todos os campos obrigatórios antes de continuar.');
            return;
        }
        
        // Salva dados do formulário
        collectFormData(currentStepNumber);
        
        // Atualiza a navegação visual dos passos
        document.querySelector(`.step[data-step="${currentStepNumber}"]`).classList.remove('active');
        document.querySelector(`.step[data-step="${currentStepNumber + 1}"]`).classList.add('active');
        
        // Atualiza a exibição do conteúdo do passo
        document.getElementById(`step${currentStepNumber}`).classList.remove('active');
        document.getElementById(`step${currentStepNumber + 1}`).classList.add('active');
        
        // Atualizar o passo atual no localStorage
        localStorage.setItem('currentStep', currentStepNumber + 1);
        
        // Se estamos indo para o passo 4 (confirmação), preenche o resumo
        if (currentStepNumber + 1 === 4) {
            updatePaymentSummary();
        }
        
        // Se estamos indo para o passo de pagamento (3), verifica a forma de pagamento
        if (currentStepNumber + 1 === 3) {
            // Configurar visibilidade inicial dos containers de pagamento
            const formaPagamento = document.getElementById('forma-pagamento');
            if (formaPagamento.value === 'express') {
                expressContainer.style.display = 'block';
                ibanContainer.style.display = 'none';
            } else if (formaPagamento.value === 'iban') {
                expressContainer.style.display = 'none';
                ibanContainer.style.display = 'block';
            }
        }
    }
    
    /**
     * Volta para o passo anterior do formulário
     * @param {number} currentStepNumber - O número do passo atual
     */
    function goToPrevStep(currentStepNumber) {
        // Atualiza a navegação visual dos passos
        document.querySelector(`.step[data-step="${currentStepNumber}"]`).classList.remove('active');
        document.querySelector(`.step[data-step="${currentStepNumber - 1}"]`).classList.add('active');
        
        // Atualiza a exibição do conteúdo do passo
        document.getElementById(`step${currentStepNumber}`).classList.remove('active');
        document.getElementById(`step${currentStepNumber - 1}`).classList.add('active');
        
        // Atualizar o passo atual no localStorage
        localStorage.setItem('currentStep', currentStepNumber - 1);
    }
    
    /**
     * Valida os campos obrigatórios do passo atual
     * @param {number} stepNumber - O número do passo a validar
     * @return {boolean} - Verdadeiro se todos os campos obrigatórios estiverem preenchidos
     */
    function validateCurrentStep(stepNumber) {
        const currentStep = document.getElementById(`step${stepNumber}`);
        const requiredFields = currentStep.querySelectorAll('[required]:not([disabled])');
        
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
            } else {
                field.classList.remove('error');
            }
        });
        
        return isValid;
    }
    
    /**
     * Coleta os dados do formulário de acordo com a etapa
     * @param {number} stepNumber - O número do passo para coletar dados
     */
    function collectFormData(stepNumber) {
        switch(stepNumber) {
            case 1: // Dados do aluno
                formData.alunoNome = document.getElementById('aluno-nome').value;
                formData.escola = document.getElementById('escola').value;
                formData.classe = document.getElementById('classe').value;
                formData.curso = document.getElementById('curso').value;
                formData.sala = document.getElementById('sala').value;
                formData.turma = document.getElementById('turma').value;
                formData.numeroAluno = document.getElementById('numero-aluno').value;
                break;
            case 2: // Dados do pagador
                formData.pagadorNome = document.getElementById('pagador-nome').value;
                formData.biNumero = document.getElementById('bi-numero').value;
                break;
            case 3: // Dados do pagamento
                formData.mesPagamento = document.getElementById('mes-pagamento').value;
                formData.valorPropina = document.getElementById('valor-propina').value;
                formData.formaPagamento = document.getElementById('forma-pagamento').value;
                
                // Armazena os dados específicos do método de pagamento selecionado
                if (formData.formaPagamento === 'express') {
                    formData.banco = document.getElementById('banco-express').value;
                    formData.dadosPagamento = document.getElementById('express-info').value;
                } else {
                    formData.banco = document.getElementById('banco-iban').value;
                    formData.dadosPagamento = document.getElementById('iban-info').value;
                }
                break;
            case 4: // Assinatura e confirmação
                formData.assinatura = document.getElementById('assinatura').value;
                formData.termos = document.getElementById('aceitar-termos').checked;
                break;
        }
        
        // Salvar dados no localStorage
        saveFormData();
    }
    
    /**
     * Salva os dados do formulário no localStorage
     */
    function saveFormData() {
        // Captura dados em tempo real de todos os passos
        const allInputs = document.querySelectorAll('input, select');
        allInputs.forEach(input => {
            if (input.type === 'checkbox') {
                formData[input.id] = input.checked;
            } else {
                formData[input.id] = input.value;
            }
        });
        
        localStorage.setItem('formData', JSON.stringify(formData));
    }
    
    /**
     * Restaura os campos do formulário com dados salvos
     */
    function restoreFormFields() {
        // Percorrer todos os campos e restaurar valores
        Object.keys(formData).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = formData[key];
                } else {
                    element.value = formData[key];
                }
            }
        });
        
        // Verificar e ajustar a exibição dos containers de pagamento
        if (formData['forma-pagamento'] === 'express') {
            expressContainer.style.display = 'block';
            ibanContainer.style.display = 'none';
        } else if (formData['forma-pagamento'] === 'iban') {
            expressContainer.style.display = 'none';
            ibanContainer.style.display = 'block';
        }
    }
    
    /**
     * Atualiza o resumo de pagamento na etapa de confirmação
     */
    function updatePaymentSummary() {
        const resumoPagamento = document.getElementById('resumo-pagamento');
        
        let resumoHTML = `
            <p><strong>Aluno:</strong> ${formData.alunoNome || formData['aluno-nome'] || ''}</p>
            <p><strong>Escola:</strong> ${formData.escola || ''}</p>
            <p><strong>Classe:</strong> ${formData.classe || ''}</p>
            <p><strong>Curso:</strong> ${formData.curso || ''}</p>
            <p><strong>Sala/Turma/Número:</strong> ${formData.sala || ''}/${formData.turma || ''}/${formData.numeroAluno || formData['numero-aluno'] || ''}</p>
            <p><strong>Pagador:</strong> ${formData.pagadorNome || formData['pagador-nome'] || ''}</p>
            <p><strong>Número do BI:</strong> ${formData.biNumero || formData['bi-numero'] || ''}</p>
            <p><strong>Mês a Pagar:</strong> ${formData.mesPagamento || formData['mes-pagamento'] || ''}</p>
            <p><strong>Valor da Propina:</strong> ${formData.valorPropina || formData['valor-propina'] || ''}</p>
            <p><strong>Forma de Pagamento:</strong> ${formData.formaPagamento === 'express' || formData['forma-pagamento'] === 'express' ? 'Express a Express' : 'IBAN'}</p>
            <p><strong>Banco:</strong> ${formData.banco || ''}</p>
            <p><strong>${formData.formaPagamento === 'express' || formData['forma-pagamento'] === 'express' ? 'Express' : 'IBAN'}:</strong> ${formData.dadosPagamento || ''}</p>
        `;
        
        resumoPagamento.innerHTML = resumoHTML;
    }
    
    /**
     * Cria o recibo de pagamento após confirmação
     */
    function createReceipt() {
        const receiptContent = document.getElementById('receipt-content');
        const receiptDate = document.getElementById('receipt-date');
        const mensagemSucesso = document.getElementById('mensagem-sucesso');
        const boletimPreview = document.getElementById('boletim-preview-content');
        
        // Gera data e hora atual formatada para o recibo
        const dataAtual = new Date();
        const dataFormatada = dataAtual.toLocaleDateString('pt-AO');
        const horaFormatada = dataAtual.toLocaleTimeString('pt-AO');
        
        // Gera número de referência aleatório para o pagamento
        const refPagamento = 'REF' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
        
        // Preenche data do recibo
        receiptDate.textContent = `Data: ${dataFormatada} - ${horaFormatada}`;
        
        // Preenche mensagem de sucesso
        const mesPagamento = formData.mesPagamento || formData['mes-pagamento'] || '';
        mensagemSucesso.textContent = `Pagamento de ${mesPagamento} Realizado com Sucesso!`;
        
        // Inicializa o conteúdo HTML do recibo
        let receiptHTML = '';
        
        // Obter valores ajustados para garantir que use os dados corretos
        const alunoNome = formData.alunoNome || formData['aluno-nome'] || '';
        const escola = formData.escola || '';
        const classe = formData.classe || '';
        const curso = formData.curso || '';
        const sala = formData.sala || '';
        const turma = formData.turma || '';
        const numeroAluno = formData.numeroAluno || formData['numero-aluno'] || '';
        const valorPropina = formData.valorPropina || formData['valor-propina'] || '';
        const formaPagamentoStr = (formData.formaPagamento === 'express' || formData['forma-pagamento'] === 'express') ? 'Express a Express' : 'IBAN';
        const banco = formData.banco || '';
        const pagadorNome = formData.pagadorNome || formData['pagador-nome'] || '';
        
        // Cria a estrutura para adicionar as linhas ao recibo
        const rows = [
            { label: 'Referência de Pagamento', value: refPagamento },
            { label: 'Aluno', value: alunoNome },
            { label: 'Escola', value: escola },
            { label: 'Classe', value: classe },
            { label: 'Curso', value: curso },
            { label: 'Sala/Turma/Número', value: `${sala}/${turma}/${numeroAluno}` },
            { label: 'Mês Pago', value: mesPagamento },
            { label: 'Valor Pago', value: valorPropina },
            { label: 'Forma de Pagamento', value: formaPagamentoStr },
            { label: 'Banco', value: banco },
            { label: 'Pagador', value: pagadorNome },
            { label: 'Data do Pagamento', value: `${dataFormatada}` }
        ];
        
        // Adiciona cada linha ao recibo
        rows.forEach(row => {
            receiptHTML += `
                <div class="receipt-row">
                    <div class="receipt-label">${row.label}:</div>
                    <div class="receipt-value">${row.value}</div>
                </div>
            `;
        });
        
        // Define o HTML completo do recibo
        receiptContent.innerHTML = receiptHTML;
        
        // Cria uma versão resumida para o preview
        const previewRows = rows.slice(0, 5); // Apenas as primeiras 5 linhas
        let previewHTML = '';
        
        previewRows.forEach(row => {
            previewHTML += `
                <div class="receipt-row">
                    <div class="receipt-label">${row.label}:</div>
                    <div class="receipt-value">${row.value}</div>
                </div>
            `;
        });
        
        // Adiciona uma indicação de que há mais informações
        previewHTML += `
            <div class="preview-more">
                <p>... mais informações disponíveis no boletim completo</p>
            </div>
        `;
        
        boletimPreview.innerHTML = previewHTML;
    }
    
    /**
     * Botão para limpar os dados salvos (para testes)
     */
    function addResetButton() {
        const resetButton = document.createElement('button');
        resetButton.textContent = 'Limpar Dados Salvos';
        resetButton.style.position = 'fixed';
        resetButton.style.bottom = '10px';
        resetButton.style.right = '10px';
        resetButton.style.zIndex = '9999';
        resetButton.style.padding = '5px 10px';
        resetButton.style.backgroundColor = '#f44336';
        resetButton.style.color = 'white';
        resetButton.style.border = 'none';
        resetButton.style.borderRadius = '4px';
        resetButton.style.cursor = 'pointer';
        
        resetButton.addEventListener('click', function() {
            localStorage.removeItem('formData');
            localStorage.removeItem('currentStep');
            window.location.reload();
        });
        
        document.body.appendChild(resetButton);
    }
    
    // Adiciona botão de reset para testes
    addResetButton();
    
    // Carrega a biblioteca html2pdf dinamicamente para garantir a funcionalidade de PDF
    function loadHtml2PdfLibrary() {
        if (typeof html2pdf === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
            document.head.appendChild(script);
        }
    }
    
    // Carrega a biblioteca no carregamento da página
    loadHtml2PdfLibrary();
});