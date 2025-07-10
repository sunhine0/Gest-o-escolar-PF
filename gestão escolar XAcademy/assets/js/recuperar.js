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
  
  // Seletores de método
  const emailOption = document.getElementById('email-option');
  const smsOption = document.getElementById('sms-option');
  const inputField = document.getElementById('recovery-input');
  const inputLabel = document.getElementById('input-label');
  const inputIcon = document.getElementById('input-icon');
  
  emailOption.addEventListener('click', function() {
      emailOption.classList.add('active');
      smsOption.classList.remove('active');
      inputField.setAttribute('type', 'email');
      inputField.setAttribute('placeholder', 'Seu e-mail');
      inputLabel.textContent = 'E-mail';
      inputIcon.className = 'fas fa-envelope input-icon';
  });
  
  smsOption.addEventListener('click', function() {
      smsOption.classList.add('active');
      emailOption.classList.remove('active');
      inputField.setAttribute('type', 'tel');
      inputField.setAttribute('placeholder', 'Seu número de telefone');
      inputLabel.textContent = 'Telefone';
      inputIcon.className = 'fas fa-mobile-alt input-icon';
  });
  
  // Recuperação de senha
  const recoveryForm = document.getElementById('recovery-form');
  const recoveryBtn = document.getElementById('recovery-btn');
  const btnText = recoveryBtn.querySelector('span');
  const loader = recoveryBtn.querySelector('.loader');
  const countdown = document.getElementById('countdown');
  const timer = document.getElementById('timer');
  const successMessage = document.getElementById('success-message');
  const successText = document.getElementById('success-text');
  
  recoveryForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Mostrar loader no botão
      btnText.style.display = 'none';
      loader.style.display = 'block';
      
      // Após 1 segundo, mostrar contagem regressiva
      setTimeout(function() {
          recoveryForm.style.display = 'none';
          countdown.style.display = 'block';
          
          // Contagem regressiva de 60 segundos
          let timeLeft = 60;
          const countdownInterval = setInterval(function() {
              timeLeft--;
              timer.textContent = timeLeft;
              
              if (timeLeft <= 0) {
                  clearInterval(countdownInterval);
                  countdown.style.display = 'none';
                  successMessage.style.display = 'block';
                  
                  // Verificar qual método foi selecionado
                  if (emailOption.classList.contains('active')) {
                      successText.textContent = "Seu código foi enviado para o e-mail informado.";
                  } else {
                      successText.textContent = "Seu código foi enviado por SMS para o número informado.";
                  }
              }
          }, 1000);
      }, 1000);
  });