 // Adicionar partículas ao fundo
 const particlesContainer = document.getElementById('particles');
 const particleCount = 30;

 for (let i = 0; i < particleCount; i++) {
     const particle = document.createElement('div');
     particle.className = 'particle';
     
     // Posicionamento aleatório
     particle.style.left = `${Math.random() * 100}%`;
     particle.style.top = `${Math.random() * 100}%`;
     
     // Tamanho aleatório
     const size = Math.random() * 8 + 3;
     particle.style.width = `${size}px`;
     particle.style.height = `${size}px`;
     
     // Cor aleatória entre branco e azul claro
     const opacity = Math.random() * 0.5 + 0.2;
     particle.style.backgroundColor = `rgba(255, 255, 255, ${opacity})`;
     
     // Animação com delay aleatório
     particle.style.animationDuration = `${Math.random() * 15 + 5}s`;
     particle.style.animationDelay = `${Math.random() * 5}s`;
     
     particlesContainer.appendChild(particle);
 }

 // --------------------
 // Calendário
 // --------------------
 const daysContainer = document.getElementById("daysContainer");
 const monthDisplay = document.getElementById("monthDisplay");
 const prevBtn = document.getElementById("prevBtn");
 const nextBtn = document.getElementById("nextBtn");

 // Define a data atual e armazena a data inicial para referência (semana inicial)
 let currentDate = new Date();
 let initialDate = new Date(currentDate.getTime());
 let selectedDay = null;

 function updateCalendar() {
     daysContainer.innerHTML = "";
     let tempDate = new Date(currentDate);

     monthDisplay.innerText = tempDate.toLocaleString("pt-BR", {
         month: "long",
         year: "numeric",
     });

     for (let i = 0; i < 7; i++) {
         let dayBox = document.createElement("div");
         dayBox.className = "day";
         
         // Destaca o dia atual
         if (tempDate.toDateString() === new Date().toDateString()) {
             dayBox.classList.add("active");
             selectedDay = tempDate.toDateString();
         }
         
         dayBox.innerHTML = `<div>${tempDate.toLocaleString("pt-BR", {
             weekday: "short",
         })}</div><div>${tempDate.getDate()}</div>`;
         
         // Adicionar evento de clique para selecionar o dia
         dayBox.addEventListener('click', function() {
             // Remove a classe active de todos os dias
             document.querySelectorAll('.day').forEach(day => {
                 day.classList.remove('active');
             });
             // Adiciona a classe active ao dia clicado
             this.classList.add('active');
             selectedDay = tempDate.toDateString();
             
             // Filtrar eventos pelo dia selecionado (opcional)
             filterEventsByDate(tempDate);
         });
         
         daysContainer.appendChild(dayBox);

         // Avança para o próximo dia
         tempDate.setDate(tempDate.getDate() + 1);
     }

     // Se estivermos na semana inicial, oculta o botão da esquerda
     if (currentDate.toDateString() === initialDate.toDateString()) {
         prevBtn.style.display = "none";
     } else {
         prevBtn.style.display = "inline-block";
     }
 }

 function prevWeek() {
     currentDate.setDate(currentDate.getDate() - 7);
     updateCalendar();
 }

 function nextWeek() {
     currentDate.setDate(currentDate.getDate() + 7);
     updateCalendar();
 }

 function filterEventsByDate(date) {
     // Implementação opcional para filtrar eventos por data
     // Esta função pode ser expandida conforme necessário
     console.log(`Filtrando eventos para: ${date.toDateString()}`);
 }

 // --------------------
 // Eventos
 // --------------------
 // Array para armazenar os eventos
 let events = [
     {
         title: "Workshop de Desenvolvimento Web",
         description: "Aprenda HTML, CSS e JavaScript básicos neste workshop interativo de 3 horas.",
         date: "2025-03-25",
         location: "Sala 302 - Edifício Principal",
         joined: false
     },
     {
         title: "Palestra: Inteligência Artificial",
         description: "Descubra como a IA está transformando a educação e o mercado de trabalho.",
         date: "2025-03-28",
         location: "Auditório Central",
         joined: true
     },
     {
         title: "Hackathon X Academy",
         description: "48 horas para desenvolver projetos inovadores em equipe. Prêmios para os melhores!",
         date: "2025-04-05",
         location: "Campus de Inovação",
         joined: false
     }
 ];

 // Função para renderizar os eventos
 function renderEvents() {
     const container = document.getElementById("eventContainer");
     container.innerHTML = "";
     
     events.forEach((event, index) => {
         const card = document.createElement("div");
         card.classList.add("event-card");
         
         // Adiciona animação com delay para efeito escalonado
         card.style.animationDelay = `${index * 0.1}s`;

         const title = document.createElement("h3");
         title.textContent = event.title;
         card.appendChild(title);

         const description = document.createElement("p");
         description.textContent = event.description;
         card.appendChild(description);

         const details = document.createElement("span");
         // Formatar a data para exibição
         const eventDate = new Date(event.date);
         const formattedDate = eventDate.toLocaleDateString("pt-BR", {
             day: "2-digit",
             month: "2-digit",
             year: "numeric"
         });
         
         details.innerHTML = `<i class="far fa-calendar-alt"></i> ${formattedDate} <br> <i class="fas fa-map-marker-alt"></i> ${event.location}`;
         card.appendChild(details);

         const button = document.createElement("button");
         if (event.joined) {
             button.textContent = "Inscrito";
             button.disabled = true;
         } else {
             button.textContent = "Inscrever-se";
             button.addEventListener("click", () => {
                 event.joined = true;
                 renderEvents();
             });
         }
         card.appendChild(button);
         container.appendChild(card);
     });
 }

 // Manipulador do formulário de evento
 document.getElementById("eventForm").addEventListener("submit", function (e) {
     e.preventDefault();
     const title = document.getElementById("title").value;
     const description = document.getElementById("description").value;
     const date = document.getElementById("date").value;
     const location = document.getElementById("location").value;
     
     const newEvent = { 
         title, 
         description, 
         date, 
         location, 
         joined: false 
     };
     
     events.unshift(newEvent); // Adiciona no início para destacar o novo evento
     this.reset();
     
     // Adiciona uma notificação de sucesso
     const successMessage = document.createElement("div");
     successMessage.textContent = "Evento criado com sucesso!";
     successMessage.style.color = "var(--primary)";
     successMessage.style.textAlign = "center";
     successMessage.style.marginTop = "10px";
     successMessage.style.fontWeight = "bold";
     
     this.appendChild(successMessage);
     
     // Remove a mensagem após alguns segundos
     setTimeout(() => {
         successMessage.remove();
     }, 3000);
     
     renderEvents();
 });

 // Inicialização
 updateCalendar();
 renderEvents();