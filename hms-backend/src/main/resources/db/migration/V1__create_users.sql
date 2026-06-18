CREATE TABLE users (
    id              CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    full_name       VARCHAR(100),
    email           VARCHAR(255) UNIQUE,
    phone_number    VARCHAR(15) UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    role            VARCHAR(20) NOT NULL CHECK (role IN ('ADMIN', 'DOCTOR', 'PATIENT')),
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE admins (
    id              CHAR(36) PRIMARY KEY,
    user_id         CHAR(36) NOT NULL UNIQUE,
    full_name       VARCHAR(100) NOT NULL,
    email           VARCHAR(150) NOT NULL UNIQUE,
    phone_number    VARCHAR(15) NOT NULL UNIQUE,
    admin_code      VARCHAR(50),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_admin_user FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO users (id, full_name, email, password_hash, role, is_active) 
VALUES ('11111111-1111-1111-1111-111111111111', 'System Admin', 'admin@hospital.com', '$2a$12$N9V20eBfK4.G6i1pIqB4FOH44Dk9v5dJc.X85D4jJ0.mF6t0xH4E2', 'ADMIN', TRUE);

INSERT INTO admins (id, user_id, full_name, email, phone_number, admin_code)
VALUES ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'System Admin', 'admin@hospital.com', '1234567890', 'ADMIN123');

INSERT INTO users (id, full_name, email, password_hash, role, is_active)
VALUES ('33333333-3333-3333-3333-333333333333', 'Default Admin', 'defaultadmin@hospital.com', '$2a$12$N9V20eBfK4.G6i1pIqB4FOH44Dk9v5dJc.X85D4jJ0.mF6t0xH4E2', 'ADMIN', TRUE);

INSERT INTO admins (id, user_id, full_name, email, phone_number, admin_code)
VALUES ('44444444-4444-4444-4444-444444444444', '33333333-3333-3333-3333-333333333333', 'Default Admin', 'defaultadmin@hospital.com', '9876543210', 'CUREWELL2026');
