# UML Use Case Diagram

## Use Case Diagram

```mermaid
flowchart LR
    actorPatient[Patient]
    actorStaff[Clinic Staff]
    actorSystem[System / ML Engine]

    subgraph HealthcareClinic[Healthcare Clinic Appointment System]
        UC1[UC1: Book Appointment]
        UC2[UC2: Submit Appointment Request]
        UC3[UC3: Validate Input Data]
        UC4[UC4: Check Scheduling Conflict]
        UC5[UC5: Store Appointment]
        UC6[UC6: Analyze No-show Risk]
        UC7[UC7: Recommend Best Slots]
        UC8[UC8: Recommend Doctors]
        UC9[UC9: View Appointment Records]
        UC10[UC10: Check System Health]
    end

    actorPatient --> UC1
    actorPatient --> UC2

    actorStaff --> UC9
    actorStaff --> UC8
    actorStaff --> UC7

    actorSystem --> UC3
    actorSystem --> UC4
    actorSystem --> UC5
    actorSystem --> UC6
    actorSystem --> UC7
    actorSystem --> UC8
    actorSystem --> UC10

    UC1 --> UC3
    UC3 --> UC4
    UC4 --> UC5
    UC5 --> UC6
    UC6 --> UC7
    UC6 --> UC8

    UC9 --> UC5
    UC10 --> actorSystem
```

## Use Case Descriptions

### UC1: Book Appointment
A patient enters appointment details through the clinic website.

### UC2: Submit Appointment Request
The front-end sends the booking request to the server for processing.

### UC3: Validate Input Data
The system verifies that required fields are present and correctly formatted.

### UC4: Check Scheduling Conflict
The system compares the new request against existing appointment data to avoid duplicate bookings.

### UC5: Store Appointment
Valid appointments are saved locally in the appointments JSON file.

### UC6: Analyze No-show Risk
The ML-style engine evaluates appointment risk and generates a no-show probability and confidence score.

### UC7: Recommend Best Slots
The system ranks available appointment slots based on predicted risk and availability.

### UC8: Recommend Doctors
The system suggests suitable doctors based on the consultation type and expected schedule load.

### UC9: View Appointment Records
Clinic staff can inspect stored requests to manage bookings and schedule planning.

### UC10: Check System Health
A developer or monitoring system verifies that the service is live through the health endpoint.

## Notes
This diagram reflects the current demo implementation of the healthcare clinic project. It intentionally represents lightweight heuristic-based recommendations rather than a full production clinical workflow.
