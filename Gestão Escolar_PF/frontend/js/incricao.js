  var gk_isXlsx = false;
        var gk_xlsxFileLookup = {};
        var gk_fileData = {};
        function filledCell(cell) {
          return cell !== '' && cell != null;
        }
        function loadFileData(filename) {
        if (gk_isXlsx && gk_xlsxFileLookup[filename]) {
            try {
                var workbook = XLSX.read(gk_fileData[filename], { type: 'base64' });
                var firstSheetName = workbook.SheetNames[0];
                var worksheet = workbook.Sheets[firstSheetName];

                // Convert sheet to JSON to filter blank rows
                var jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, blankrows: false, defval: '' });
                // Filter out blank rows (rows where all cells are empty, null, or undefined)
                var filteredData = jsonData.filter(row => row.some(filledCell));

                // Heuristic to find the header row by ignoring rows with fewer filled cells than the next row
                var headerRowIndex = filteredData.findIndex((row, index) =>
                  row.filter(filledCell).length >= filteredData[index + 1]?.filter(filledCell).length
                );
                // Fallback
                if (headerRowIndex === -1 || headerRowIndex > 25) {
                  headerRowIndex = 0;
                }

                // Convert filtered JSON back to CSV
                var csv = XLSX.utils.aoa_to_sheet(filteredData.slice(headerRowIndex)); // Create a new sheet from filtered array of arrays
                csv = XLSX.utils.sheet_to_csv(csv, { header: 1 });
                return csv;
            } catch (e) {
                console.error(e);
                return "";
            }
        }
        return gk_fileData[filename] || "";
        }

           // Variáveis globais
        let dadosInscricao = {};

        // Função para alternar tema claro/escuro
        const themeToggle = document.getElementById('themeToggle');
        const body = document.body;

        themeToggle.addEventListener('click', () => {
            const currentTheme = body.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            body.setAttribute('data-theme', newTheme);
            
            // Alterar ícone do botão de tema
            const icon = themeToggle.querySelector('i');
            if (newTheme === 'dark') {
                icon.className = 'fas fa-sun';
            } else {
                icon.className = 'fas fa-moon';
            }
            
            // Salvar preferência de tema
            localStorage.setItem('theme', newTheme);
        });

        // Carregar tema salvo
        const savedTheme = localStorage.getItem('theme') || 'light';
        body.setAttribute('data-theme', savedTheme);
        const icon = themeToggle.querySelector('i');
        if (savedTheme === 'dark') {
            icon.className = 'fas fa-sun';
        }

        // Função para toggle do menu lateral
        const menuToggle = document.getElementById('menuToggle');
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');
        const mainContent = document.getElementById('mainContent');

        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('ativo');
            overlay.classList.toggle('ativo');
            mainContent.classList.toggle('ativo');
        });

        overlay.addEventListener('click', () => {
            sidebar.classList.remove('ativo');
            overlay.classList.remove('ativo');
            mainContent.classList.remove('ativo');
        });

        // Função para gerenciar navegação
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove a classe active de todos os links
                navLinks.forEach(l => l.classList.remove('active'));
                
                // Adiciona a classe active ao link clicado
                link.classList.add('active');
                
                // Atualiza o título da página
                const pageTitle = link.getAttribute('data-page');
                document.querySelector('.page-title').textContent = pageTitle;
                
                // Fecha o menu lateral
                sidebar.classList.remove('ativo');
                overlay.classList.remove('ativo');
                mainContent.classList.remove('ativo');
            });
        });

        // Função para limpar o formulário
        function limparFormulario() {
            if (confirm('Tem certeza que deseja limpar todos os campos?')) {
                document.getElementById('formularioInscricao').reset();
            }
        }

        // Função para cancelar o formulário
        function cancelarFormulario() {
            if (confirm('Tem certeza que deseja cancelar? Todos os dados serão perdidos.')) {
                document.getElementById('formularioInscricao').reset();
                window.location.reload();
            }
        }

        // Função para processar submissão do formulário
        document.getElementById('formularioInscricao').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Coletar dados do formulário
            const formData = new FormData(this);
            dadosInscricao = {};
            
            for (let [key, value] of formData.entries()) {
                dadosInscricao[key] = value;
            }
            
            // Validar campos obrigatórios
            if (!validarFormulario()) {
                return;
            }
            
            // Preencher folha de inscrição
            preencherFolhaInscricao();
            
            // Mostrar modal
            document.getElementById('modalFolha').style.display = 'flex';
        });

        // Função para validar formulário
        function validarFormulario() {
            const camposObrigatorios = [
                'nomeCompleto', 'genero', 'provincia', 'municipio', 'bairro', 
                'bilheteIdentidade', 'dataNascimento', 'endereco', 'telefonePrincipal',
                'email', 'curso', 'classe', 'periodo', 'anoLetivo', 'nomeResponsavel',
                'parentesco', 'biResponsavel', 'telefoneResponsavel', 'taxaInscricao',
                'mensalidade', 'formaPagamento'
            ];
            
            for (let campo of camposObrigatorios) {
                const elemento = document.getElementById(campo);
                if (!elemento.value.trim()) {
                    alert(`Por favor, preencha o campo: ${elemento.previousElementSibling.textContent}`);
                    elemento.focus();
                    return false;
                }
            }
            
            // Validar email
            const email = document.getElementById('email').value;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Por favor, digite um email válido.');
                document.getElementById('email').focus();
                return false;
            }
            
            return true;
        }

        // Função para preencher folha de inscrição
        function preencherFolhaInscricao() {
            // Dados pessoais
            document.getElementById('folhaNome').textContent = dadosInscricao.nomeCompleto || '';
            document.getElementById('folhaGenero').textContent = dadosInscricao.genero || '';
            document.getElementById('folhaDataNascimento').textContent = formatarData(dadosInscricao.dataNascimento) || '';
            document.getElementById('folhaBI').textContent = dadosInscricao.bilheteIdentidade || '';
            document.getElementById('folhaNacionalidade').textContent = dadosInscricao.nacionalidade || '';
            document.getElementById('folhaEndereco').textContent = `${dadosInscricao.endereco}, ${dadosInscricao.bairro}, ${dadosInscricao.municipio}, ${dadosInscricao.provincia}` || '';
            document.getElementById('folhaTelefone').textContent = dadosInscricao.telefonePrincipal || '';
            document.getElementById('folhaEmail').textContent = dadosInscricao.email || '';
            
            // Dados acadêmicos
            document.getElementById('folhaCurso').textContent = dadosInscricao.curso || '';
            document.getElementById('folhaClasse').textContent = dadosInscricao.classe || '';
            document.getElementById('folhaPeriodo').textContent = dadosInscricao.periodo || '';
            document.getElementById('folhaAnoLetivo').textContent = dadosInscricao.anoLetivo || '';
            
            // Dados do responsável
            document.getElementById('folhaNomeResponsavel').textContent = dadosInscricao.nomeResponsavel || '';
            document.getElementById('folhaParentesco').textContent = dadosInscricao.parentesco || '';
            document.getElementById('folhaBIResponsavel').textContent = dadosInscricao.biResponsavel || '';
            document.getElementById('folhaTelefoneResponsavel').textContent = dadosInscricao.telefoneResponsavel || '';
            
            // Dados financeiros
            document.getElementById('folhaTaxaInscricao').textContent = formatarMoeda(dadosInscricao.taxaInscricao) || '';
            document.getElementById('folhaMensalidade').textContent = formatarMoeda(dadosInscricao.mensalidade) || '';
            document.getElementById('folhaFormaPagamento').textContent = dadosInscricao.formaPagamento || '';
            
            // Data atual
            document.getElementById('dataInscricao').textContent = new Date().toLocaleDateString('pt-BR');
        }

        // Função para formatar data
        function formatarData(data) {
            if (!data) return '';
            const date = new Date(data);
            return date.toLocaleDateString('pt-BR');
        }

        // Função para formatar moeda
        function formatarMoeda(valor) {
            if (!valor) return '0,00';
            return Number(valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
        }

        // Função para fechar modal
        function fecharModal() {
            document.getElementById('modalFolha').style.display = 'none';
        }

        // Função para imprimir folha
        function imprimirFolha() {
            window.print();
        }

        // Função para gerar PDF
        function gerarPDF() {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF();
            
            // Configurações do PDF
            pdf.setFont('helvetica');
            
            // Cabeçalho
            pdf.setFontSize(18);
            pdf.setTextColor(255, 215, 0);
            pdf.text('COLÉGIO PENSADOR DO FUTURO', 105, 20, { align: 'center' });
            
            pdf.setFontSize(14);
            pdf.setTextColor(0, 0, 0);
            pdf.text('Sistema de Gestão Escolar - Folha de Inscrição', 105, 30, { align: 'center' });
            
            // Linha separadora
            pdf.setDrawColor(255, 215, 0);
            pdf.setLineWidth(0.5);
            pdf.line(20, 35, 190, 35);
            
            let y = 50;
            
            // Dados Pessoais
            pdf.setFontSize(12);
            pdf.setTextColor(255, 215, 0);
            pdf.text('DADOS PESSOAIS DO ESTUDANTE', 20, y);
            y += 10;
            
            pdf.setTextColor(0, 0, 0);
            pdf.setFontSize(10);
            pdf.text(`Nome Completo: ${dadosInscricao.nomeCompleto}`, 20, y);
            y += 8;
            pdf.text(`Gênero: ${dadosInscricao.genero}`, 20, y);
            pdf.text(`Data de Nascimento: ${formatarData(dadosInscricao.dataNascimento)}`, 110, y);
            y += 8;
            pdf.text(`BI: ${dadosInscricao.bilheteIdentidade}`, 20, y);
            pdf.text(`Nacionalidade: ${dadosInscricao.nacionalidade}`, 110, y);
            y += 8;
            pdf.text(`Endereço: ${dadosInscricao.endereco}, ${dadosInscricao.bairro}`, 20, y);
            y += 8;
            pdf.text(`${dadosInscricao.municipio}, ${dadosInscricao.provincia}`, 20, y);
            y += 8;
            pdf.text(`Telefone: ${dadosInscricao.telefonePrincipal}`, 20, y);
            pdf.text(`Email: ${dadosInscricao.email}`, 110, y);
            y += 15;
            
            // Dados Acadêmicos
            pdf.setFontSize(12);
            pdf.setTextColor(255, 215, 0);
            pdf.text('DADOS ACADÊMICOS', 20, y);
            y += 10;
            
            pdf.setTextColor(0, 0, 0);
            pdf.setFontSize(10);
            pdf.text(`Curso: ${dadosInscricao.curso}`, 20, y);
            pdf.text(`Classe: ${dadosInscricao.classe}`, 110, y);
            y += 8;
            pdf.text(`Período: ${dadosInscricao.periodo}`, 20, y);
            pdf.text(`Ano Letivo: ${dadosInscricao.anoLetivo}`, 110, y);
            y += 8;
            
            if (dadosInscricao.escolaAnterior) {
                pdf.text(`Escola Anterior: ${dadosInscricao.escolaAnterior}`, 20, y);
                y += 8;
            }
            if (dadosInscricao.mediaAnterior) {
                pdf.text(`Média Anterior: ${dadosInscricao.mediaAnterior}`, 20, y);
                y += 8;
            }
            y += 7;
            
            // Dados do Responsável
            pdf.setFontSize(12);
            pdf.setTextColor(255, 215, 0);
            pdf.text('DADOS DO RESPONSÁVEL', 20, y);
            y += 10;
            
            pdf.setTextColor(0, 0, 0);
            pdf.setFontSize(10);
            pdf.text(`Nome: ${dadosInscricao.nomeResponsavel}`, 20, y);
            pdf.text(`Parentesco: ${dadosInscricao.parentesco}`, 110, y);
            y += 8;
            pdf.text(`BI: ${dadosInscricao.biResponsavel}`, 20, y);
            pdf.text(`Telefone: ${dadosInscricao.telefoneResponsavel}`, 110, y);
            y += 15;
            
            // Informações Financeiras
            pdf.setFontSize(12);
            pdf.setTextColor(255, 215, 0);
            pdf.text('INFORMAÇÕES FINANCEIRAS', 20, y);
            y += 10;
            
            pdf.setTextColor(0, 0, 0);
            pdf.setFontSize(10);
            pdf.text(`Taxa de Inscrição: ${formatarMoeda(dadosInscricao.taxaInscricao)} Kz`, 20, y);
            y += 8;
            pdf.text(`Mensalidade: ${formatarMoeda(dadosInscricao.mensalidade)} Kz`, 20, y);
            y += 8;
            pdf.text(`Forma de Pagamento: ${dadosInscricao.formaPagamento}`, 20, y);
            y += 15;
            
            // Seção de Assinaturas
            if (y > 240) {
                pdf.addPage();
                y = 20;
            }
            
            pdf.setFontSize(12);
            pdf.setTextColor(255, 215, 0);
            pdf.text('ASSINATURAS', 20, y);
            y += 20;
            
            pdf.setTextColor(0, 0, 0);
            pdf.setFontSize(10);
            
            // Linha para assinatura do estudante
            pdf.line(20, y, 90, y);
            pdf.text('Assinatura do Estudante', 20, y + 5);
            
            // Linha para assinatura do responsável
            pdf.line(110, y, 180, y);
            pdf.text('Assinatura do Responsável', 110, y + 5);
            
            y += 20;
            
            // Rodapé
            pdf.setFontSize(8);
            pdf.setTextColor(100, 100, 100);
            pdf.text(`Data de Inscrição: ${new Date().toLocaleDateString('pt-BR')}`, 105, y, { align: 'center' });
            y += 5;
            pdf.text('Colégio Pensador do Futuro - Formando o Futuro de Angola', 105, y, { align: 'center' });
            
            // Salvar PDF
            const nomeArquivo = `Inscricao_${dadosInscricao.nomeCompleto.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
            pdf.save(nomeArquivo);
        }

        // Fechar modal ao clicar fora dele
        document.getElementById('modalFolha').addEventListener('click', function(e) {
            if (e.target === this) {
                fecharModal();
            }
        });

        // Adicionar suporte para tecla ESC para fechar modal
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && document.getElementById('modalFolha').style.display === 'flex') {
                fecharModal();
            }
        });

        // Função para calcular idade baseada na data de nascimento
        function calcularIdade(dataNascimento) {
            const hoje = new Date();
            const nascimento = new Date(dataNascimento);
            let idade = hoje.getFullYear() - nascimento.getFullYear();
            const mesAtual = hoje.getMonth();
            const mesNascimento = nascimento.getMonth();
            
            if (mesAtual < mesNascimento || (mesAtual === mesNascimento && hoje.getDate() < nascimento.getDate())) {
                idade--;
            }
            
            return idade;
        }

        // Função para aplicar máscara de telefone
        function aplicarMascaraTelefone(input) {
            let valor = input.value.replace(/\D/g, '');
            valor = valor.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
            input.value = valor;
        }

        // Aplicar máscaras aos campos de telefone
        document.addEventListener('DOMContentLoaded', function() {
            const camposTelefone = ['telefonePrincipal', 'telefoneAlternativo', 'telefoneResponsavel'];
            
            camposTelefone.forEach(campoId => {
                const campo = document.getElementById(campoId);
                if (campo) {
                    campo.addEventListener('input', function() {
                        aplicarMascaraTelefone(this);
                    });
                }
            });
        });

        // Adicionar validação em tempo real para campos numéricos
        const camposNumericos = ['taxaInscricao', 'mensalidade', 'mediaAnterior'];
        camposNumericos.forEach(campoId => {
            const campo = document.getElementById(campoId);
            if (campo) {
                campo.addEventListener('input', function() {
                    if (this.value < 0) this.value = 0;
                    if (campoId === 'mediaAnterior' && this.value > 20) this.value = 20;
                });
            }
        });