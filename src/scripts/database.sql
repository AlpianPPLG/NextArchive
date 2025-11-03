-- Create Database
CREATE DATABASE IF NOT EXISTS e_arsip_db;
USE e_arsip_db;

-- 1. Users Table (Admin Only)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role ENUM('ADMIN') NOT NULL DEFAULT 'ADMIN',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

-- 2. Classifications Table
CREATE TABLE IF NOT EXISTS classifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(10) UNIQUE NOT NULL,
    description VARCHAR(255) NOT NULL,
    shelf_location VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

-- 3. Incoming Letters Table
CREATE TABLE IF NOT EXISTS incoming_letters (
    id VARCHAR(36) PRIMARY KEY,
    letter_number VARCHAR(100) UNIQUE NOT NULL,
    sender VARCHAR(150) NOT NULL,
    incoming_date DATE NOT NULL,
    subject VARCHAR(255) NOT NULL,
    file_url VARCHAR(500),
    classification_id INT,
    number_of_copies INT NOT NULL DEFAULT 1,
    archive_file_number VARCHAR(50),
    is_archived BOOLEAN NOT NULL DEFAULT FALSE,
    recorded_by_user_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (classification_id) REFERENCES classifications(id) ON DELETE SET NULL,
    FOREIGN KEY (recorded_by_user_id) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_is_archived (is_archived),
    INDEX idx_classification_id (classification_id)
    );

-- 4. Outgoing Letters Table
CREATE TABLE IF NOT EXISTS outgoing_letters (
    id VARCHAR(36) PRIMARY KEY,
    letter_number VARCHAR(100) UNIQUE NOT NULL,
    destination VARCHAR(150) NOT NULL,
    outgoing_date DATE NOT NULL,
    subject VARCHAR(255) NOT NULL,
    file_url VARCHAR(500),
    classification_id INT,
    number_of_copies INT NOT NULL DEFAULT 1,
    archive_file_number VARCHAR(50),
    is_archived BOOLEAN NOT NULL DEFAULT FALSE,
    recorded_by_user_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (classification_id) REFERENCES classifications(id) ON DELETE SET NULL,
    FOREIGN KEY (recorded_by_user_id) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_is_archived (is_archived),
    INDEX idx_classification_id (classification_id)
    );

-- 5. FAQ Table
CREATE TABLE IF NOT EXISTS faqs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    question VARCHAR(255) NOT NULL,
    answer TEXT NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

-- 6. Files Table
CREATE TABLE IF NOT EXISTS files (
    id VARCHAR(36) PRIMARY KEY,
    original_name VARCHAR(255) NOT NULL,
    file_data LONGBLOB NOT NULL,
    file_type ENUM('pdf', 'png', 'jpg', 'xlsx', 'xls', 'csv') NOT NULL,
    file_size BIGINT NOT NULL,
    uploaded_by_user_id VARCHAR(36) NOT NULL,
    reference_type ENUM('incoming_letter', 'outgoing_letter') NOT NULL,
    reference_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (uploaded_by_user_id) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_reference (reference_type, reference_id)
);

-- Sample Data
-- Password: password123 (hashed with bcrypt)
INSERT INTO users (id, username, email, password_hash, full_name, role) VALUES
    ('550e8400-e29b-41d4-a716-446655440000', 'admin_arsip', 'admin@arsip.local', '$2a$10$3P8Fz6T9cR1wY.E3f.D2n.pL5jA1rF.l7iZ.hJ6s.K8y.U9wI3uC.', 'Admin Utama PP', 'ADMIN');

INSERT INTO classifications (code, description, shelf_location) VALUES
    ('001', 'Umum dan Protokoler', 'Rak A1'),
    ('002', 'Keuangan dan Anggaran', 'Rak B2'),
    ('003', 'Kepegawaian', 'Rak C3'),
    ('004', 'Perencanaan dan Evaluasi', 'Rak D4');

INSERT INTO incoming_letters (id, letter_number, sender, incoming_date, subject, classification_id, number_of_copies, archive_file_number, is_archived, recorded_by_user_id) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'DIR-123/IX/2025', 'Dinas A', '2025-09-10', 'Permohonan Kerjasama', 1, 2, 'A001', TRUE, '550e8400-e29b-41d4-a716-446655440000'),
    ('550e8400-e29b-41d4-a716-446655440002', 'KEU-045/IX/2025', 'Bank B', '2025-09-12', 'Konfirmasi Transfer Dana', 2, 1, 'B005', FALSE, '550e8400-e29b-41d4-a716-446655440000'),
    ('550e8400-e29b-41d4-a716-446655440003', 'PROV-089/IX/2025', 'Pemerintah Provinsi', '2025-09-15', 'Surat Edaran Kebijakan', 1, 3, 'A002', FALSE, '550e8400-e29b-41d4-a716-446655440000'),
    ('550e8400-e29b-41d4-a716-446655440004', 'HR-012/IX/2025', 'Departemen SDM', '2025-09-18', 'Pengumuman Rekrutmen', 3, 1, 'C001', TRUE, '550e8400-e29b-41d4-a716-446655440000');

INSERT INTO outgoing_letters (id, letter_number, destination, outgoing_date, subject, classification_id, number_of_copies, archive_file_number, is_archived, recorded_by_user_id) VALUES
    ('550e8400-e29b-41d4-a716-446655440005', 'BALAS/2025/001', 'Dinas A', '2025-09-15', 'Surat Balasan Kerjasama', 1, 1, 'A002', TRUE, '550e8400-e29b-41d4-a716-446655440000'),
    ('550e8400-e29b-41d4-a716-446655440006', 'NOTIF/2025/001', 'Semua Departemen', '2025-09-20', 'Pengumuman Penting', 1, 5, 'A003', FALSE, '550e8400-e29b-41d4-a716-446655440000');

INSERT INTO faqs (question, answer, sort_order) VALUES
    ('Bagaimana cara login ke sistem?', 'Gunakan username dan password yang telah diberikan oleh administrator untuk login ke sistem e-Arsip Digital.', 1),
    ('Apa perbedaan antara Surat Masuk dan Laporan Surat Masuk?', 'Surat Masuk menampilkan semua surat yang belum diarsipkan (sedang diproses), sedangkan Laporan Surat Masuk menampilkan surat yang sudah difinalisasi dan diarsipkan.', 2),
    ('Bagaimana cara menambah surat baru?', 'Klik tombol "Tambah Surat" pada halaman Surat Masuk atau Surat Keluar, isi formulir dengan data lengkap, dan klik Simpan.', 3),
    ('Bisakah saya menghapus surat yang sudah diarsipkan?', 'Tidak, surat yang sudah diarsipkan tidak dapat dihapus untuk menjaga integritas data arsip. Hubungi administrator jika ada kebutuhan khusus.', 4);

-- =====================================================
-- QUERIES FOR REGISTER FEATURE
-- =====================================================

-- Query untuk register user baru (digunakan oleh API endpoint /api/auth/register)
-- INSERT INTO users (id, username, email, password_hash, full_name, role)
-- VALUES (?, ?, ?, ?, ?, 'ADMIN');
-- Parameters: [userId (UUID), username, email (nullable), passwordHash (bcrypt), fullName]

-- Query untuk cek username yang sudah ada
-- SELECT id FROM users WHERE username = ?;

-- Query untuk cek email yang sudah ada
-- SELECT id FROM users WHERE email = ?;

-- =====================================================
-- QUERIES FOR FAQ MANAGEMENT
-- =====================================================

-- Query untuk insert FAQ baru
-- INSERT INTO faqs (question, answer, sort_order)
-- VALUES (?, ?, ?);
-- Parameters: [question, answer, sort_order]

-- Query untuk update FAQ
-- UPDATE faqs SET question = ?, answer = ?, sort_order = ?
-- WHERE id = ?;
-- Parameters: [question, answer, sort_order, id]

-- Query untuk delete FAQ
-- DELETE FROM faqs WHERE id = ?;
-- Parameters: [id]

-- Query untuk get all FAQs ordered by sort_order
-- SELECT * FROM faqs ORDER BY sort_order ASC, created_at DESC;
