CREATE TABLE reminders (
    id                  CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    patient_id          CHAR(36) REFERENCES patients(id) ON DELETE CASCADE,
    prescription_id     CHAR(36) REFERENCES prescriptions(id) ON DELETE CASCADE,
    medicine_name       VARCHAR(200) NOT NULL,
    dosage              VARCHAR(100),
    reminder_time       TIME NOT NULL,          -- e.g., 08:00
    start_date          DATE NOT NULL,
    end_date            DATE,
    is_active           BOOLEAN DEFAULT TRUE,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reminder_logs (
    id              CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    reminder_id     CHAR(36) REFERENCES reminders(id) ON DELETE CASCADE,
    patient_id      CHAR(36) REFERENCES patients(id),
    scheduled_for   DATETIME NOT NULL,
    status          VARCHAR(20) CHECK (status IN ('TAKEN', 'SKIPPED', 'SNOOZED', 'MISSED')),
    logged_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes           TEXT
);

CREATE INDEX idx_reminders_patient_date ON reminders(patient_id, start_date, end_date);
CREATE INDEX idx_reminder_logs_reminder ON reminder_logs(reminder_id, scheduled_for);
