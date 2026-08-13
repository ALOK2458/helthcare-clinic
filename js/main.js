document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('appointmentForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const data = new FormData(form);
        const payload = { name: data.get('name'), email: data.get('email'), date: data.get('date'), notes: data.get('notes') };
        alert('Appointment request received for ' + payload.name + ".\nThis is a demo — no data was sent.");
        form.reset();
        console.log('Demo appointment payload', payload);
    });
});