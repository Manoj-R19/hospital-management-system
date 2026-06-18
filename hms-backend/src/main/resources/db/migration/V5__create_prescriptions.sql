CREATE TABLE prescriptions (
    id              CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    encounter_id    CHAR(36) REFERENCES encounters(id) ON DELETE CASCADE,
    patient_id      CHAR(36) REFERENCES patients(id),
    doctor_id       CHAR(36) REFERENCES doctors(id),
    medicine_name   VARCHAR(200) NOT NULL,
    dosage          VARCHAR(100) NOT NULL,
    frequency       VARCHAR(50) NOT NULL,
    duration_text   VARCHAR(100),          -- "7 days", "1 month"
    duration_days   INT,               -- Computed: for reminder scheduling
    instructions    TEXT,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_prescriptions_patient ON prescriptions(patient_id);
