CREATE TABLE encounters (
    id              CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    patient_id      CHAR(36) REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id       CHAR(36) REFERENCES doctors(id),
    visit_datetime  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    hospital_name   VARCHAR(200),
    diagnosis       TEXT,
    clinical_notes  TEXT,
    is_editable     BOOLEAN DEFAULT TRUE,  -- Becomes FALSE after 24 hours
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_encounters_patient ON encounters(patient_id);
