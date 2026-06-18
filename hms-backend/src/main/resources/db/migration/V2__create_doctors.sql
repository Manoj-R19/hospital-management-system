CREATE TABLE doctors (

    id CHAR(36) PRIMARY KEY,

    user_id CHAR(36) NOT NULL UNIQUE,

    full_name VARCHAR(100) NOT NULL,

    email VARCHAR(150) NOT NULL UNIQUE,

    phone_number VARCHAR(15) NOT NULL UNIQUE,

    qualification VARCHAR(100) NOT NULL,

    specialization VARCHAR(100) NOT NULL,

    govt_reg_number VARCHAR(100) NOT NULL UNIQUE,

    hospital_name VARCHAR(200) NOT NULL,

    hospital_address TEXT NOT NULL,

    hospital_opening_time TIME,

    hospital_closing_time TIME,

    certificate_file_path VARCHAR(500),

    is_verified BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_doctor_user
        FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE

);


CREATE TABLE doctor_facilities (

    doctor_id CHAR(36) NOT NULL,

    facility VARCHAR(100) NOT NULL,

    CONSTRAINT fk_facility_doctor
        FOREIGN KEY(doctor_id)
        REFERENCES doctors(id)
        ON DELETE CASCADE

);


CREATE INDEX idx_doctor_email
ON doctors(email);

CREATE INDEX idx_doctor_phone
ON doctors(phone_number);

CREATE INDEX idx_doctor_registration
ON doctors(govt_reg_number);

CREATE INDEX idx_doctor_verified
ON doctors(is_verified);