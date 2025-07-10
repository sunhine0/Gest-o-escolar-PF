let selectedSchool = '';
        
function selectSchool(element, school) {
    // Remove selected class from all options
    const options = document.querySelectorAll('.school-option');
    options.forEach(option => option.classList.remove('selected'));
    
    // Add selected class to clicked option
    element.classList.add('selected');
    selectedSchool = school;
}

function formatDate(date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

function previewNotification() {
    if (!selectedSchool) {
        alert('Por favor, selecione uma escola!');
        return;
    }
    
    const title = document.getElementById('notification-title').value;
    if (!title) {
        alert('Por favor, adicione um título para a notificação!');
        return;
    }
    
    const message = document.getElementById('notification-message').value;
    if (!message) {
        alert('Por favor, adicione uma mensagem para a notificação!');
        return;
    }
    
    // Update preview
    document.getElementById('preview-title').textContent = title;
    document.getElementById('preview-message').textContent = message;
    document.getElementById('preview-school').textContent = `Escola: ${selectedSchool}`;
    
    const currentDate = new Date();
    document.getElementById('preview-date').textContent = `Data: ${formatDate(currentDate)}`;
    
    // Show preview
    document.getElementById('notification-preview').classList.add('active');
}

function hidePreview() {
    document.getElementById('notification-preview').classList.remove('active');
}

function downloadPDF() {
    // This function would typically integrate with a PDF generation library
    // For demonstration purposes, we're just showing an alert
    alert('Função de download de PDF será implementada com uma biblioteca como jsPDF ou integração com o backend.');
    
    // In a real implementation, you would use something like:
     const doc = new jsPDF();
     doc.text(document.getElementById('preview-title').textContent, 10, 10);
     doc.text(document.getElementById('preview-message').textContent, 10, 20);
    doc.save('notificacao.pdf');
}