 // Função para mostrar/ocultar senha usando Font Awesome
        // Permite ao usuário visualizar a senha digitada
        function togglePassword() {
            const senhaInput = document.getElementById('senha');
            const toggleIcon = document.querySelector('.toggle-password');
            
            // Verifica o tipo atual do campo (password ou text)
            if (senhaInput.type === 'password') {
                // Mostra a senha alterando o tipo para text
                senhaInput.type = 'text';
                // Muda para ícone de "ocultar" (olho cortado) do Font Awesome
                toggleIcon.className = 'fas fa-eye-slash toggle-password';
            } else {
                // Oculta a senha voltando o tipo para password
                senhaInput.type = 'password';
                // Volta para ícone de "mostrar" (olho) do Font Awesome
                toggleIcon.className = 'fas fa-eye toggle-password';
            }
        }

        // Script para controlar o slideshow de fundo
        // Alternância automática entre as 6 imagens de fundo
        let currentSlide = 0;
        const slides = document.querySelectorAll('.slide');
        const totalSlides = slides.length;

        function nextSlide() {
            // Remove a classe active do slide atual
            slides[currentSlide].classList.remove('active');
            
            // Move para o próximo slide (volta ao primeiro após o último)
            currentSlide = (currentSlide + 1) % totalSlides;
            
            // Adiciona a classe active ao novo slide
            slides[currentSlide].classList.add('active');
        }

        // Inicia a troca automática de slides a cada 4 segundos
        // Usando a cor principal (amarelo dourado) como tema das transições
        setInterval(nextSlide, 4000);

        // Animação suave para o formulário aparecer
        window.addEventListener('load', function() {
            const loginCard = document.querySelector('.login-card');
            loginCard.style.opacity = '0';
            loginCard.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                loginCard.style.transition = 'all 0.8s ease';
                loginCard.style.opacity = '1';
                loginCard.style.transform = 'translateY(0)';
            }, 300);
        });

        // Validação e redirecionamento do formulário
        document.querySelector('form').addEventListener('submit', function(e) {
            e.preventDefault(); // Impede o envio padrão do formulário
            
            // Obtém os valores dos campos de usuário e senha
            const usuario = document.getElementById('usuario').value;
            const senha = document.getElementById('senha').value;
            
            // Validação básica - verifica se os campos estão preenchidos
            if (!usuario || !senha) {
                alert('Por favor, preencha todos os campos.');
                return; // Para a execução se algum campo estiver vazio
            }
            
            // Feedback visual durante o processo de login
            // Usando a cor principal para indicar carregamento
            const button = document.querySelector('.login-button');
            const originalText = button.textContent;
            
            // Altera aparência do botão para indicar processamento
            button.style.background = 'var(--amarelo-escuro)';
            button.textContent = 'Entrando...';
            button.disabled = true; // Desabilita o botão temporariamente
            
            // Simula processo de autenticação com delay
            setTimeout(() => {
                // Restaura aparência original do botão
                button.style.background = 'var(--amarelo-primario)';
                button.textContent = originalText;
                button.disabled = false;
                
                // REDIRECIONAMENTO PARA PÁGINA INICIAL
                // Redireciona para inicial.html após validação bem-sucedida
                window.location.href = 'Pagina_inicial.html';
                
                // Mensagem de confirmação (opcional, pois será redirecionado)
                console.log('Login realizado com sucesso! Redirecionando...');
            }, 1500); // Delay de 1.5 segundos para melhor UX
        });