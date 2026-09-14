async function bookAppointment(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const button = form.querySelector('button[type="submit"]');
    const status = document.getElementById('appointmentStatus');
    const mlPredictionsDiv = document.getElementById('mlPredictions');
    const payload = Object.fromEntries(new FormData(form).entries());

    button.disabled = true;
    button.textContent = 'Submitting...';
    status.textContent = '';
    status.className = '';
    mlPredictionsDiv.classList.remove('show');

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
        const mlData = result.ml || {};

        status.innerHTML = `
            <strong>${result.message}</strong>
            <span>Request ID: ${appointment.id}</span>
            <span>${appointment.doctor} | ${appointment.date} at ${appointment.time}</span>
            <span>${appointment.consultationType}</span>
        `;
        status.className = 'appointment-status success';

        // Display ML predictions
        if (mlData) {
            displayMLPredictions(mlData);
        }

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

function displayMLPredictions(mlData) {
    const mlPredictionsDiv = document.getElementById('mlPredictions');

    // Update confidence score
    const confidenceScore = document.getElementById('confidenceScore');
    confidenceScore.textContent = mlData.confidence + '%';

    // Update risk indicator
    const riskIndicator = document.getElementById('riskIndicator');
    const riskLevel = mlData.riskScore > 60 ? 'high' : mlData.riskScore > 30 ? 'medium' : 'low';
    const riskText = riskLevel === 'high' ? '🔴 Urgent' : riskLevel === 'medium' ? '🟡 Moderate' : '🟢 Routine';
    const riskClass = `risk-${riskLevel}`;

    riskIndicator.innerHTML = `<div class="ml-metric-value">${riskText}</div>`;
    riskIndicator.querySelector('.ml-metric-value').style.background = 'none';
    riskIndicator.querySelector('.ml-metric-value').style.color = riskLevel === 'high' ? '#ef4444' : riskLevel === 'medium' ? '#f59e0b' : '#10b981';
    riskIndicator.classList.add(riskClass);

    // Update no-show risk
    const noShowRisk = document.getElementById('noShowRisk');
    noShowRisk.textContent = mlData.noShowProbability + '%';

    // Update recommendation
    const mlRecommendation = document.getElementById('mlRecommendation');
    if (mlData.noShowProbability > 40) {
        mlRecommendation.textContent = 'Consider sending appointment reminder 24 hours before. Patient has moderate no-show risk.';
    } else if (mlData.riskScore > 60) {
        mlRecommendation.textContent = 'This is an urgent case. Consider prioritizing and scheduling doctor confirmation.';
    } else {
        mlRecommendation.textContent = 'Appointment is scheduled normally. Routine follow-up may be appropriate.';
    }

    // Show predictions
    mlPredictionsDiv.classList.add('show');
}