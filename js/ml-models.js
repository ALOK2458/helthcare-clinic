/**
 * ML Models for MEdicare smart health assistence predictions
 * - No-show prediction
 * - Risk scoring
 * - Appointment recommendations
 */

// Training data: synthetic historical patterns
const TRAINING_DATA = {
    noShowPatterns: [{
            consultationType: 'Checkup',
            dayOfWeek: 'Monday',
            timeSlot: 'morning',
            hoursBefore: 72,
            noShow: false
        },
        {
            consultationType: 'Checkup',
            dayOfWeek: 'Friday',
            timeSlot: 'evening',
            hoursBefore: 24,
            noShow: true
        },
        {
            consultationType: 'Urgent',
            dayOfWeek: 'Monday',
            timeSlot: 'morning',
            hoursBefore: 2,
            noShow: false
        },
        {
            consultationType: 'Urgent',
            dayOfWeek: 'Wednesday',
            timeSlot: 'afternoon',
            hoursBefore: 48,
            noShow: false
        },
        {
            consultationType: 'Follow-up',
            dayOfWeek: 'Tuesday',
            timeSlot: 'morning',
            hoursBefore: 168,
            noShow: false
        },
        {
            consultationType: 'Follow-up',
            dayOfWeek: 'Thursday',
            timeSlot: 'evening',
            hoursBefore: 12,
            noShow: true
        },
        {
            consultationType: 'Specialist',
            dayOfWeek: 'Monday',
            timeSlot: 'afternoon',
            hoursBefore: 336,
            noShow: false
        },
        {
            consultationType: 'Specialist',
            dayOfWeek: 'Friday',
            timeSlot: 'morning',
            hoursBefore: 96,
            noShow: true
        },
    ],
    riskFactors: {
        consultationType: {
            'Urgent': 0.9,
            'Emergency': 0.95,
            'Specialist': 0.7,
            'Follow-up': 0.5,
            'Checkup': 0.3
        },
        timeSlot: {
            'early-morning': 0.2,
            'morning': 0.3,
            'afternoon': 0.5,
            'evening': 0.7
        }
    }
};

// Simple No-Show Prediction Model
class NoShowPredictor {
    constructor() {
        this.consultationWeights = {
            'Urgent': 0.1,
            'Emergency': 0.05,
            'Specialist': 0.3,
            'Follow-up': 0.4,
            'Checkup': 0.5
        };
        this.dayWeights = {
            'Monday': 0.2,
            'Tuesday': 0.2,
            'Wednesday': 0.2,
            'Thursday': 0.3,
            'Friday': 0.4,
            'Saturday': 0.5,
            'Sunday': 0.6
        };
        this.timeSlotWeights = {
            'morning': 0.2,
            'afternoon': 0.4,
            'evening': 0.6
        };
    }

    getTimeSlot(time) {
        const hour = parseInt(time.split(':')[0]);
        if (hour < 12) return 'morning';
        if (hour < 17) return 'afternoon';
        return 'evening';
    }

    getDayOfWeek(dateStr) {
        const date = new Date(dateStr + 'T00:00:00');
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[date.getDay()];
    }

    getHoursBefore(dateStr, timeStr) {
        const appointmentTime = new Date(dateStr + 'T' + timeStr);
        const now = new Date();
        return (appointmentTime - now) / (1000 * 60 * 60);
    }

    predict(appointment) {
        const consultationType = appointment.consultationType || 'Checkup';
        const dayOfWeek = this.getDayOfWeek(appointment.date);
        const timeSlot = this.getTimeSlot(appointment.time);
        const hoursBefore = this.getHoursBefore(appointment.date, appointment.time);

        // Base no-show probability from consultation type
        let probability = this.consultationWeights[consultationType] || 0.4;

        // Adjust by day of week (weekends/late week higher risk)
        probability += this.dayWeights[dayOfWeek] * 0.1;

        // Adjust by time slot (evening higher risk)
        probability += this.timeSlotWeights[timeSlot] * 0.1;

        // Adjust by booking distance (very close bookings have lower risk)
        if (hoursBefore < 24) {
            probability -= 0.15;
        } else if (hoursBefore > 336) {
            probability += 0.05;
        }

        return Math.max(0, Math.min(1, probability));
    }
}

// Risk Scoring Model
class AppointmentRiskScorer {
    score(appointment, allAppointments = []) {
        let riskScore = 0;

        // Consultation type risk
        const consultTypeRisk = TRAINING_DATA.riskFactors.consultationType[appointment.consultationType] || 0.5;
        riskScore += consultTypeRisk * 0.4;

        // Time slot risk
        const hour = parseInt(appointment.time.split(':')[0]);
        let timeRisk = 0.3;
        if (hour < 10) timeRisk = 0.2;
        if (hour >= 17) timeRisk = 0.6;
        riskScore += timeRisk * 0.3;

        // Doctor workload risk
        const doctorLoad = allAppointments.filter(a =>
            a.doctor === appointment.doctor &&
            a.date === appointment.date &&
            a.status !== 'cancelled'
        ).length;
        const loadRisk = Math.min(1, doctorLoad / 5);
        riskScore += loadRisk * 0.3;

        return Math.round(riskScore * 100) / 100;
    }
}

// Recommendation Engine
class AppointmentRecommender {
    getAvailableSlots(doctor, date, allAppointments) {
        const slots = [
            '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
            '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
        ];

        const bookedSlots = allAppointments
            .filter(a => a.doctor === doctor && a.date === date && a.status !== 'cancelled')
            .map(a => a.time);

        return slots.filter(slot => !bookedSlots.includes(slot));
    }

    recommendBestSlots(appointment, allAppointments, maxRecommendations = 3) {
        const scorer = new AppointmentRiskScorer();
        const predictors = {
            noShow: new NoShowPredictor()
        };

        const slots = this.getAvailableSlots(appointment.doctor, appointment.date, allAppointments);

        const scoredSlots = slots.map(time => {
            const testAppointment = {
                ...appointment,
                time
            };
            const riskScore = scorer.score(testAppointment, allAppointments);
            const noShowProbability = predictors.noShow.predict(testAppointment);

            return {
                time,
                riskScore,
                noShowProbability,
                confidence: 1 - noShowProbability,
                score: (1 - noShowProbability) * (1 - riskScore) // Higher is better
            };
        });

        return scoredSlots
            .sort((a, b) => b.score - a.score)
            .slice(0, maxRecommendations)
            .map(({
                time,
                riskScore,
                noShowProbability,
                confidence
            }) => ({
                time,
                riskScore,
                noShowProbability: Math.round(noShowProbability * 100),
                confidence: Math.round(confidence * 100)
            }));
    }

    recommendDoctors(consultationType, date, allAppointments, maxRecommendations = 3) {
        const doctors = ['Dr. Smith', 'Dr. Johnson', 'Dr. Williams', 'Dr. Brown'];
        const scorer = new AppointmentRiskScorer();

        const doctorScores = doctors.map(doctor => {
            const load = allAppointments.filter(a =>
                a.doctor === doctor &&
                a.date === date &&
                a.status !== 'cancelled'
            ).length;
            const availability = Math.max(0, 5 - load);
            const specialization = consultationType === 'Specialist' ? 0.9 : 0.7;

            return {
                doctor,
                load,
                availability,
                specialization,
                score: (availability / 5) * specialization
            };
        });

        return doctorScores
            .sort((a, b) => b.score - a.score)
            .slice(0, maxRecommendations)
            .map(({
                doctor,
                availability,
                score
            }) => ({
                doctor,
                availableSlots: availability,
                recommendationScore: Math.round(score * 100)
            }));
    }
}

// Export models (for Node.js)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        NoShowPredictor,
        AppointmentRiskScorer,
        AppointmentRecommender
    };
}