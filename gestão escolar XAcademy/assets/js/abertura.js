 // Criar partículas decorativas
 const particlesContainer = document.getElementById('particles');
 for (let i = 0; i < 30; i++) {
     const particle = document.createElement('div');
     particle.classList.add('particle');
     particle.style.top = Math.random() * 100 + '%';
     particle.style.left = Math.random() * 100 + '%';
     particle.style.width = (Math.random() * 10 + 5) + 'px';
     particle.style.height = particle.style.width;
     particle.style.opacity = Math.random() * 0.5;
     particle.style.animationDuration = (Math.random() * 10 + 5) + 's';
     particle.style.animationDelay = (Math.random() * 5) + 's';
     particlesContainer.appendChild(particle);
 }
 
 // Redirecionar após 4 segundos
 setTimeout(function() {
     window.location.href = "login.html";
 }, 5000);