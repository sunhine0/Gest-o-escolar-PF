   // Obter elementos do modal
   const modal = document.getElementById("inscricao-modal");
   const btn = document.getElementById("inscricao-btn");
   const span = document.getElementsByClassName("close-modal")[0];

   // Quando o usuário clicar no botão, abrir o modal
   btn.onclick = function() {
       modal.style.display = "flex";
   }

   // Quando o usuário clicar no X, fechar o modal
   span.onclick = function() {
       modal.style.display = "none";
   }

   // Quando o usuário clicar fora do modal, fechar o modal
   window.onclick = function(event) {
       if (event.target == modal) {
           modal.style.display = "none";
       }
   }