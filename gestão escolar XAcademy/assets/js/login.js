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
const togglePassword = document.getElementById('toggle-password');
const passwordField = document.getElementById('password');

togglePassword.addEventListener('click', function() {
    const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordField.setAttribute('type', type);
    
    // Alternar ícone
    this.classList.toggle('fa-eye');
    this.classList.toggle('fa-eye-slash');
});

// Efeito de boas-vindas
const loginForm = document.getElementById('login-form');
const loginBtn = document.getElementById('login-btn');
const welcomeScreen = document.getElementById('welcome-screen');
const welcomeName = document.getElementById('welcome-name');
const btnText = loginBtn.querySelector('span');
const loader = loginBtn.querySelector('.loader');

loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Mostrar loader no botão
    btnText.style.display = 'none';
    loader.style.display = 'block';
    
    // Obter nome de usuário do email (parte antes do @)
    const email = document.getElementById('email').value;
    const userName = email.split('@')[0];
    
    // Capitalizar primeira letra
    const capitalizedName = userName.charAt(0).toUpperCase() + userName.slice(1);
    
    // Após 2 segundos, mostrar tela de boas-vindas
    setTimeout(function() {
        welcomeName.textContent = 'Senhor(a) ' + capitalizedName;
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