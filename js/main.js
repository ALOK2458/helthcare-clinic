async function bookAppointment(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const button = form.querySelector('button[type="submit"]');
    const status = document.getElementById('appointmentStatus');
    const payload = Object.fromEntries(new FormData(form).entries());

    button.disabled = true;
    button.textContent = 'Submitting...';
    status.textContent = '';
    status.className = '';

    try {
        const response = await fetch('/api/appointments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        const result = await response.json();

        if (!response.ok) throw new Error(result.error || 'Request failed');

        const appointment = result.appointment;
        status.innerHTML = `
            <strong>${result.message}</strong>
            <span>Request ID: ${appointment.id}</span>
            <span>${appointment.doctor} | ${appointment.date} at ${appointment.time}</span>
            <span>${appointment.consultationType}</span>
        `;
        status.className = 'appointment-status success';
        form.reset();
    } catch (error) {
        status.textContent = error.message.includes('Failed to fetch') ?
            'The appointment service is offline. Start the backend and try again.' :
            error.message;
        status.className = 'appointment-status error';
    } finally {
        button.disabled = false;
        button.textContent = '📅 Confirm Appointment';
    }

    return false;
}