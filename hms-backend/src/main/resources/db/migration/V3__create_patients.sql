CREATE TABLE patients (

    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),

    user_id CHAR(36) UNIQUE NOT NULL,


    full_name               VARCHAR(100) NOT NULL,

    email                   VARCHAR(150) NOT NULL,

    phone_number            VARCHAR(15) NOT NULL,

    aadhaar_hash            VARCHAR(64) NOT NULL UNIQUE,

    aadhaar_last4           CHAR(4) NOT NULL,

    age                     INT CHECK(age > 0 AND age < 121),

    gender                  ENUM('Male','Female','Other'),

    address                 TEXT,


    has_insurance           BOOLEAN DEFAULT FALSE,

    insurance_provider      VARCHAR(150),

    policy_number           VARCHAR(100),

    blood_group             ENUM(
        'A+','A-',
        'B+','B-',
        'AB+','AB-',
        'O+','O-'
    ),

    height_cm               DECIMAL(5,2),

    weight_kg               DECIMAL(5,2),


    medical_conditions      JSON,

    allergies               JSON,


    taking_medicines        BOOLEAN DEFAULT FALSE,

    medicine_name           VARCHAR(200),

    dosage                  VARCHAR(100),

    frequency               VARCHAR(100),

    medicine_time           JSON,

    medicine_reason         TEXT,

    medicine_duration       VARCHAR(100),


    previous_surgery        BOOLEAN DEFAULT FALSE,

    surgery_name            VARCHAR(200),

    surgery_type            VARCHAR(200),

    surgery_hospital        VARCHAR(200),

    surgeon_name            VARCHAR(150),

    surgery_date            DATE,

    recovery_duration       VARCHAR(100),

    surgery_reason          TEXT,

    current_health_status   VARCHAR(100),

    smoking                 BOOLEAN DEFAULT FALSE,

    alcohol                 BOOLEAN DEFAULT FALSE,


    emergency_contact_name      VARCHAR(100),

    emergency_contact_number    VARCHAR(15),

    emergency_relationship      VARCHAR(50),


    patient_status ENUM(
        'Active',
        'Inactive',
        'Blocked'
    ) DEFAULT 'Active',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE

);

CREATE INDEX idx_patients_aadhaar
ON patients(aadhaar_hash);

CREATE INDEX idx_patients_bloodgroup
ON patients(blood_group);

CREATE INDEX idx_patients_phone
ON patients(phone_number);



