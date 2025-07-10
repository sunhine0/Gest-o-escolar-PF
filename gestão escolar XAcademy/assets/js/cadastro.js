   // Criar partículas decorativas
   const particlesContainer = document.getElementById('particles');
   for (let i = 0; i < 20; i++) {
       const particle = document.createElement('div');
       particle.classList.add('particle');
       particle.style.top = Math.random() * 100 + '%';
       particle.style.left = Math.random() * 100 + '%';
       particle.style.width = (Math.random() * 8 + 4) + 'px';
       particle.style.height = particle.style.width;
       particle.style.opacity = Math.random() * 0.5;
       particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
       particle.style.animationDelay = (Math.random() * 5) + 's';
       particlesContainer.appendChild(particle);
   }
   
   // Mostrar/ocultar senha
   const toggleSenha = document.getElementById('toggle-senha');
   const senhaField = document.getElementById('senha');
   
   toggleSenha.addEventListener('click', function() {
       const type = senhaField.getAttribute('type') === 'password' ? 'text' : 'password';
       senhaField.setAttribute('type', type);
       
       // Alternar ícone
       this.classList.toggle('fa-eye');
       this.classList.toggle('fa-eye-slash');
   });
   
   // Mostrar/ocultar confirmar senha
   const toggleConfirmarSenha = document.getElementById('toggle-confirmar-senha');
   const confirmarSenhaField = document.getElementById('confirmar-senha');
   
   toggleConfirmarSenha.addEventListener('click', function() {
       const type = confirmarSenhaField.getAttribute('type') === 'password' ? 'text' : 'password';
       confirmarSenhaField.setAttribute('type', type);
       
       // Alternar ícone
       this.classList.toggle('fa-eye');
       this.classList.toggle('fa-eye-slash');
   });
   
   // Efeito de boas-vindas
   const cadastroForm = document.getElementById('cadastro-form');
   const cadastrarBtn = document.getElementById('cadastrar-btn');
   const welcomeScreen = document.getElementById('welcome-screen');
   const welcomeTitle = document.getElementById('welcome-title');
   const welcomeName = document.getElementById('welcome-name');
   const btnText = cadastrarBtn.querySelector('span');
   const loader = cadastrarBtn.querySelector('.loader');
   
   cadastroForm.addEventListener('submit', function(e) {
       e.preventDefault();
       
       // Validar se senhas coincidem
       if (senhaField.value !== confirmarSenhaField.value) {
           alert('As senhas não coincidem!');
           return;
       }
       
       // Mostrar loader no botão
       btnText.style.display = 'none';
       loader.style.display = 'block';
       
       // Obter nome completo e gênero
       const nomeCompleto = document.getElementById('nome').value;
       const genero = document.querySelector('input[name="genero"]:checked').value;
       
       // Após 5 segundos, mostrar tela de boas-vindas
       setTimeout(function() {
           // Configurar mensagem baseada no gênero
           if (genero === 'masculino') {
               welcomeTitle.textContent = 'Seja bem-vindo';
               welcomeName.textContent = 'Senhor ' + nomeCompleto + ' à X Academy';
           } else {
               welcomeTitle.textContent = 'Seja bem-vinda';
               welcomeName.textContent = 'Senhora ' + nomeCompleto + ' à X Academy';
           }
           
           welcomeScreen.style.opacity = '1';
           welcomeScreen.style.visibility = 'visible';
           
           // Após mais 3 segundos, redirecionar
           setTimeout(function() {
               welcomeScreen.style.animation = 'fadeOut 1s forwards';
               
               setTimeout(function() {
                   window.location.href = 'paginainicial.html';
               }, 1000);
           }, 3000);
       }, 2000);
   });