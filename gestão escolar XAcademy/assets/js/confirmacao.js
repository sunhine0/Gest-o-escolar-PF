document.addEventListener('DOMContentLoaded', function() {
    // Set course fee based on selected course
    const courseSelect = document.getElementById('course');
    const paymentValue = document.getElementById('paymentValue');
    
    courseSelect.addEventListener('change', function() {
        // Set different fees based on course
        const courseFees = {
            'Informática de Gestão': '15.000 AOA',
            'Contabilidade': '12.500 AOA',
            'Eletricidade': '14.000 AOA',
            'Administração': '13.000 AOA',
            'Química': '15.500 AOA'
        };
        
        if (this.value) {
            paymentValue.value = courseFees[this.value] || '10.000 AOA';
        } else {
            paymentValue.value = '';
        }
    });
    
    // Show/hide bank options based on payment method
    const expressPayment = document.getElementById('expressPayment');
    const ibanPayment = document.getElementById('ibanPayment');
    const bankOptions = document.getElementById('bankOptions');
    
    expressPayment.addEventListener('change', function() {
        bankOptions.style.display = 'none';
    });
    
    ibanPayment.addEventListener('change', function() {
        bankOptions.style.display = 'block';
    });
    
    // File upload handling
    const fileInput = document.getElementById('reportCard');
    const fileName = document.getElementById('fileName');
    const approvalStatus = document.getElementById('approvalStatus');
    
    fileInput.addEventListener('change', function() {
        if (this.files && this.files.length > 0) {
            fileName.textContent = this.files[0].name;
            
            // Simulate checking report card for approval status
            // In a real application, this would involve server-side processing
            setTimeout(() => {
                // Randomly determine if student is approved (for demo)
                const isApproved = Math.random() > 0.3;
                
                if (isApproved) {
                    approvalStatus.innerHTML = '<div class="approved"><i class="fas fa-check-circle"></i> Aprovado! Você pode prosseguir com a reinscrição.</div>';
                    document.getElementById('confirmButton').disabled = false;
                } else {
                    approvalStatus.innerHTML = '<div class="not-approved"><i class="fas fa-times-circle"></i> Reprovado! Não é possível prosseguir com a reinscrição.</div>';
                    document.getElementById('confirmButton').disabled = true;
                }
            }, 1500);
        } else {
            fileName.textContent = 'Nenhum arquivo selecionado';
            approvalStatus.innerHTML = '';
        }
    });
    
    // Form submission
    const form = document.getElementById('reconfirmationForm');
    const confirmationMessage = document.getElementById('confirmationMessage');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (document.getElementById('confirmButton').disabled) {
            alert('Não é possível confirmar a matrícula pois você está reprovado.');
            return;
        }
        
        // Hide the form and show confirmation message
        form.style.display = 'none';
        confirmationMessage.style.display = 'block';
        
        // Scroll to confirmation message
        confirmationMessage.scrollIntoView({ behavior: 'smooth' });
    });
    
    // Cancel button
    document.getElementById('cancelButton').addEventListener('click', function() {
        if (confirm('Tem certeza que deseja cancelar? Todos os dados preenchidos serão perdidos.')) {
            form.reset();
            approvalStatus.innerHTML = '';
            fileName.textContent = 'Nenhum arquivo selecionado';
            bankOptions.style.display = 'none';
        }
    });
    
    // Print button
    document.getElementById('printButton').addEventListener('click', function() {
        window.print();
    });
    
    // Save as PDF button
    document.getElementById('saveButton').addEventListener('click', function() {
        alert('O comprovante será baixado como PDF.');
        // In a real application, this would trigger a PDF download
    });
});