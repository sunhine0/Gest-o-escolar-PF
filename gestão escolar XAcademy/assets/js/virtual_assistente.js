  // Chat variables
  let userName = '';
  let chatActive = false;
  let uploadedImage = null;
  
  // DOM elements
  const welcomeScreen = document.getElementById('welcome-screen');
  const userNameInput = document.getElementById('user-name-input');
  const startChatBtn = document.getElementById('start-chat-btn');
  const chatMessages = document.getElementById('chat-messages');
  const messageInput = document.getElementById('message-input');
  const sendBtn = document.getElementById('send-btn');
  const fileUpload = document.getElementById('file-upload');
  
  // X Academy information
  const academyInfo = {
      creator: "Erick Raimundo",
      courses: [
          "Desenvolvimento Web Full Stack",
          "Design Gráfico Avançado",
          "Marketing Digital",
          "Programação Mobile",
          "Inteligência Artificial",
          "Análise de Dados"
      ],
      services: [
          "Cursos profissionalizantes",
          "Mentorias individuais",
          "Workshops mensais",
          "Eventos de networking",
          "Consultoria para empresas",
          "Certificação profissional"
      ],
      advantages: [
          "Professores altamente qualificados",
          "Conteúdo atualizado com o mercado",
          "Acesso vitalício às atualizações",
          "Suporte técnico 24/7",
          "Comunidade exclusiva de alunos",
          "Oportunidades de emprego com empresas parceiras"
      ],
      payment: {
          methods: ["Cartão de crédito", "Boleto", "PIX", "Transferência bancária"],
          link: "https://xacademy.com.br/pagamento"
      },
      location: "Av. Paulista, 1000 - São Paulo, SP",
      contact: {
          phone: "(11) 99999-9999",
          email: "contato@xacademy.com.br"
      }
  };
  
  // Suggestion chips
  const suggestionChips = [
      "Quais cursos oferecem?",
      "Como faço pagamento?",
      "Onde fica a X Academy?",
      "Quem criou o site?",
      "Vantagens da X Academy"
  ];
  
  // Start chat function
  startChatBtn.addEventListener('click', () => {
      if (userNameInput.value.trim() !== '') {
          userName = userNameInput.value.trim();
          startChat();
      } else {
          alert("Por favor, digite seu nome para começar.");
      }
  });
  
  userNameInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && userNameInput.value.trim() !== '') {
          userName = userNameInput.value.trim();
          startChat();
      }
  });
  
  function startChat() {
      chatActive = true;
      welcomeScreen.remove();
      messageInput.disabled = false;
      
      // Add initial bot message
      setTimeout(() => {
          addBotMessage(`Olá, ${userName}! É um prazer te conhecer! 😊 Sou o assistente virtual da X Academy, criado pelo desenvolvedor Full Stack Erick Raimundo. Como posso te ajudar hoje?`);
          
          // Add suggestion chips
          addSuggestionChips();
      }, 500);
  }
  
  // Add suggestion chips
  function addSuggestionChips() {
      const chipsContainer = document.createElement('div');
      chipsContainer.className = 'suggestion-chips';
      
      suggestionChips.forEach(suggestion => {
          const chip = document.createElement('div');
          chip.className = 'suggestion-chip';
          chip.textContent = suggestion;
          chip.addEventListener('click', () => {
              handleChipClick(suggestion);
          });
          chipsContainer.appendChild(chip);
      });
      
      chatMessages.appendChild(chipsContainer);
      chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  
  function handleChipClick(suggestion) {
      messageInput.value = suggestion;
      sendMessage();
  }
  
  // Message sending functionality
  sendBtn.addEventListener('click', sendMessage);
  messageInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
          sendMessage();
      }
  });
  
  function sendMessage() {
      if (!chatActive) return;
      
      const message = messageInput.value.trim();
      if (message === '' && !uploadedImage) return;
      
      // Add user message
      addUserMessage(message, uploadedImage);
      
      // Clear input
      messageInput.value = '';
      
      // Show typing indicator
      showTypingIndicator();
      
      // Process response
      setTimeout(() => {
          processResponse(message);
      }, 1000 + Math.random() * 1000); // Random delay for realistic typing
      
      // Reset uploaded image
      uploadedImage = null;
  }
  
  // File upload handling
  fileUpload.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
              uploadedImage = event.target.result;
              messageInput.placeholder = "Imagem selecionada. Adicione um comentário ou envie...";
          };
          reader.readAsDataURL(file);
      }
  });
  
  // Add messages to chat
  function addUserMessage(text, image = null) {
      const messageDiv = document.createElement('div');
      messageDiv.className = 'message user-message';
      
      if (text) {
          messageDiv.innerHTML = `<p>${text}</p>`;
      }
      
      if (image) {
          const imgElement = document.createElement('img');
          imgElement.src = image;
          imgElement.className = 'image-preview';
          messageDiv.appendChild(imgElement);
      }
      
      const timestamp = document.createElement('div');
      timestamp.className = 'timestamp';
      timestamp.textContent = getCurrentTime();
      messageDiv.appendChild(timestamp);
      
      chatMessages.appendChild(messageDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  
  function addBotMessage(text) {
      // Remove typing indicator if exists
      const typingIndicator = document.querySelector('.typing-indicator');
      if (typingIndicator) {
          typingIndicator.remove();
      }
      
      const messageDiv = document.createElement('div');
      messageDiv.className = 'message bot-message';
      messageDiv.innerHTML = `<p>${text}</p>`;
      
      const timestamp = document.createElement('div');
      timestamp.className = 'timestamp';
      timestamp.textContent = getCurrentTime();
      messageDiv.appendChild(timestamp);
      
      chatMessages.appendChild(messageDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  
  function showTypingIndicator() {
      const typingDiv = document.createElement('div');
      typingDiv.className = 'typing-indicator';
      typingDiv.innerHTML = `
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
      `;
      chatMessages.appendChild(typingDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  
  // Get current time
  function getCurrentTime() {
      const now = new Date();
      return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  // Process user input and generate responses
  function processResponse(message) {
      const lowercaseMsg = message.toLowerCase();
      let response = '';
      
      // Check for specific keywords
      if (lowercaseMsg.includes('quem criou') || lowercaseMsg.includes('quem desenvolveu') || lowercaseMsg.includes('criador') || lowercaseMsg.includes('desenvolvedor') || lowercaseMsg.includes('erick') || lowercaseMsg.includes('raimundo')) {
          response = "A X Academy e este chatbot foram criados pelo desenvolvedor Full Stack Erick Raimundo. Ele é um profissional talentoso na área de desenvolvimento web e tem grande experiência em criar soluções digitais inovadoras.";
      } 
      else if (lowercaseMsg.includes('curso') || lowercaseMsg.includes('oferecem') || lowercaseMsg.includes('formação')) {
          response = `A X Academy oferece os seguintes cursos:<br><br>
          • ${academyInfo.courses.join('<br>• ')}<br><br>
          Todos os cursos são ministrados por profissionais experientes do mercado e possuem certificado reconhecido.`;
      }
      else if (lowercaseMsg.includes('pag') || lowercaseMsg.includes('como pagar') || lowercaseMsg.includes('boleto') || lowercaseMsg.includes('cartão')) {
          response = `Você pode realizar o pagamento dos cursos da X Academy através dos seguintes métodos:<br><br>
          • ${academyInfo.payment.methods.join('<br>• ')}<br><br>
          Para efetuar o pagamento, acesse: <a href="${academyInfo.payment.link}" target="_blank">${academyInfo.payment.link}</a>`;
      }
      else if (lowercaseMsg.includes('onde') || lowercaseMsg.includes('localização') || lowercaseMsg.includes('endereço') || lowercaseMsg.includes('fica')) {
          response = `A X Academy está localizada em: ${academyInfo.location}. Estamos em um local de fácil acesso, próximo a estações de metrô e pontos de ônibus.`;
      }
      else if (lowercaseMsg.includes('serviço') || lowercaseMsg.includes('oferece')) {
          response = `Além dos cursos, a X Academy oferece os seguintes serviços:<br><br>
          • ${academyInfo.services.join('<br>• ')}`;
      }
      else if (lowercaseMsg.includes('vantagem') || lowercaseMsg.includes('benefício') || lowercaseMsg.includes('diferencial')) {
          response = `Estudar na X Academy oferece várias vantagens:<br><br>
          • ${academyInfo.advantages.join('<br>• ')}`;
      }
      else if (lowercaseMsg.includes('contato') || lowercaseMsg.includes('telefone') || lowercaseMsg.includes('email')) {
          response = `Você pode entrar em contato com a X Academy pelos seguintes canais:<br><br>
          • Telefone: ${academyInfo.contact.phone}<br>
          • E-mail: ${academyInfo.contact.email}`;
      }
      else if (lowercaseMsg.includes('boleti') && lowercaseMsg.includes('analis')) {
          response = "Posso analisar seu boletim! Por favor, envie a imagem do seu boletim através do botão de anexo, e farei a análise para você.";
      }
      else if (lowercaseMsg.includes('olá') || lowercaseMsg.includes('oi') || lowercaseMsg.includes('ola') || lowercaseMsg.includes('ei')) {
          response = `Olá ${userName}! Como posso ajudar você hoje? Estou aqui para responder qualquer dúvida sobre a X Academy.`;
      }
      else if (lowercaseMsg.includes('obrigad') || lowercaseMsg.includes('valeu') || lowercaseMsg.includes('agradeç')) {
          response = `De nada, ${userName}! Estou sempre à disposição para ajudar. Tem mais alguma dúvida?`;
      }
      else if (uploadedImage) {
          response = "Recebi sua imagem! Se for um boletim, posso analisar que você foi aprovado em todas as disciplinas. Parabéns! Se precisar de mais detalhes ou tiver outras dúvidas, me avise.";
      }
      else {
          response = `Desculpe, ${userName}, não entendi completamente sua pergunta. Posso ajudar com informações sobre nossos cursos, formas de pagamento, localização, vantagens da X Academy ou serviços oferecidos. Como posso te ajudar?`;
      }
      
      addBotMessage(response);
      
      // Add suggestion chips again after some responses
      if (lowercaseMsg.includes('obrigad') || lowercaseMsg.includes('valeu') || response.includes('não entendi')) {
          setTimeout(() => {
              addSuggestionChips();
          }, 500);
      }
  }