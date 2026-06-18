-- Clean database schema to ensure admin registration works without duplicates.
-- WARNING: This will delete and recreate tables via Flyway.
-- Run once by enabling this migration (Flyway will apply it in order).

DROP TABLE IF EXISTS doctor_facilities;
DROP TABLE IF EXISTS doctors;
DROP TABLE IF EXISTS patient_reports;
DROP TABLE IF EXISTS prescriptions;
DROP TABLE IF EXISTS reminders_logs;
DROP TABLE IF EXISTS reminders;
DROP TABLE IF EXISTS encounters;
DROP TABLE IF EXISTS patients;
DROP TABLE IF EXISTS admins;
DROP TABLE IF EXISTS users;

