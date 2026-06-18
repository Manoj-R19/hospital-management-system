CREATE TABLE blood_stock (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    blood_group VARCHAR(5) NOT NULL UNIQUE,
    units_available DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    units_reserved DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    low_stock_threshold DECIMAL(10,2) NOT NULL DEFAULT 5.00
);

CREATE TABLE blood_donors (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    patient_id CHAR(36) NULL,
    full_name VARCHAR(100) NOT NULL,
    blood_group VARCHAR(5) NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    email VARCHAR(150) NULL,
    address TEXT NULL,
    latitude DECIMAL(10,7) NULL,
    longitude DECIMAL(10,7) NULL,
    last_donation_date DATE NULL,
    notification_consent BOOLEAN DEFAULT TRUE,
    is_eligible BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE SET NULL
);

CREATE TABLE blood_requests (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    requester_id CHAR(36) NOT NULL,
    patient_id CHAR(36) NULL,
    blood_group VARCHAR(5) NOT NULL,
    units_required DECIMAL(10,2) NOT NULL,
    urgency_level ENUM('LOW', 'MEDIUM', 'HIGH', 'EMERGENCY') NOT NULL DEFAULT 'HIGH',
    status ENUM('PENDING', 'MATCHING', 'FULFILLED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    hospital_name VARCHAR(150) NOT NULL,
    hospital_address TEXT NULL,
    hospital_latitude DECIMAL(10,7) NULL,
    hospital_longitude DECIMAL(10,7) NULL,
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fulfilled_at TIMESTAMP NULL,
    FOREIGN KEY (requester_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE SET NULL
);

CREATE TABLE blood_request_matches (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    request_id CHAR(36) NOT NULL,
    donor_id CHAR(36) NOT NULL,
    distance_km DECIMAL(8,2) NOT NULL,
    notification_status ENUM('PENDING', 'NOTIFIED', 'DELIVERED', 'ACCEPTED', 'DECLINED', 'COMPLETED') NOT NULL DEFAULT 'PENDING',
    notified_at TIMESTAMP NULL,
    response_at TIMESTAMP NULL,
    FOREIGN KEY (request_id) REFERENCES blood_requests(id) ON DELETE CASCADE,
    FOREIGN KEY (donor_id) REFERENCES blood_donors(id) ON DELETE CASCADE
);

-- Prepopulate Blood Stock with standard groups
INSERT INTO blood_stock (id, blood_group, units_available, units_reserved, low_stock_threshold) VALUES
(UUID(), 'A+', 15.00, 2.00, 5.00),
(UUID(), 'A-', 8.00, 0.00, 5.00),
(UUID(), 'B+', 20.00, 4.00, 5.00),
(UUID(), 'B-', 5.00, 1.00, 5.00),
(UUID(), 'AB+', 12.00, 1.00, 5.00),
(UUID(), 'AB-', 3.00, 0.00, 5.00),
(UUID(), 'O+', 25.00, 5.00, 8.00),
(UUID(), 'O-', 10.00, 2.00, 8.00);

-- Prepopulate some default test donors
INSERT INTO blood_donors (id, full_name, blood_group, phone_number, email, address, latitude, longitude, notification_consent, is_eligible) VALUES
(UUID(), 'Rohan Mehta', 'O-', '9876543210', 'rohan@gmail.com', 'Andheri East, Mumbai', 19.115491, 72.872695, TRUE, TRUE),
(UUID(), 'Aisha Khan', 'A+', '9876543211', 'aisha@gmail.com', 'Bandra West, Mumbai', 19.059559, 72.829525, TRUE, TRUE),
(UUID(), 'Vikram Singh', 'B+', '9876543212', 'vikram@gmail.com', 'Thane West, Mumbai', 19.218333, 72.978056, TRUE, TRUE),
(UUID(), 'Neha Sharma', 'O+', '9876543213', 'neha@gmail.com', 'Dadar West, Mumbai', 19.017778, 72.847778, TRUE, TRUE);
