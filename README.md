# e-Arsip Digital - Sistem Manajemen Surat Masuk & Keluar

Sistem informasi arsip digital yang dirancang untuk mengelola seluruh siklus hidup surat masuk dan surat keluar dalam sebuah organisasi dengan efisien dan profesional.

## Fitur Utama

- **Authentication**: Sistem login admin dengan JWT dan bcrypt password hashing
- **Dashboard**: KPI cards menampilkan statistik real-time surat masuk/keluar
- **Manajemen Surat Masuk**: CRUD lengkap untuk surat yang diterima
- **Manajemen Surat Keluar**: CRUD lengkap untuk surat yang dikirim
- **Laporan & Filtering**: Filter berdasarkan klasifikasi dengan pencarian
- **FAQ**: Halaman bantuan untuk pengguna
- **Landing Page**: Halaman marketing informatif

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS v4
- **UI Components**: ShadCN UI, Radix UI
- **Backend**: Next.js API Routes
- **Database**: MySQL
- **Authentication**: JWT + Bcrypt
- **Styling**: Tailwind CSS dengan design tokens

## Prerequisites

- Node.js 18+
- MySQL 8.0+
- npm atau yarn

## Setup & Installation

### 1. Clone Repository
\`\`\`bash
git clone <repository-url>
cd e-arsip-digital
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Setup Database

Buat database MySQL dan jalankan script SQL:

\`\`\`bash
mysql -u root -p < scripts/01-init-database.sql
\`\`\`

Atau gunakan MySQL client untuk menjalankan script secara manual.

### 4. Configure Environment Variables

Buat file `.env.local` di root project:

\`\`\`env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=e_arsip_db

# JWT Authentication
JWT_SECRET=e97a3146f0c3bd9309ab92a47a43be34e31d29aa6e629b52825578c716df7de1

# Base URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

### 5. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Aplikasi akan berjalan di `http://localhost:3000`

## Default Login Credentials

- **Username**: `admin_arsip`
- **Password**: `password123`

## Project Structure

\`\`\`
e-arsip-digital/
├── app/
│   ├── (public)/              # Public pages (landing page)
│   ├── api/                   # API routes
│   │   ├── auth/              # Authentication endpoints
│   │   ├── dashboard/         # Dashboard statistics
│   │   ├── incoming-letters/  # Incoming letters CRUD
│   │   ├── outgoing-letters/  # Outgoing letters CRUD
│   │   ├── classifications/   # Classifications
│   │   └── faqs/              # FAQ data
│   ├── dashboard/             # Dashboard page
│   ├── surat-masuk/           # Incoming letters page
│   ├── surat-keluar/          # Outgoing letters page
│   ├── laporan-masuk/         # Incoming letters report
│   ├── laporan-keluar/        # Outgoing letters report
│   ├── faq/                   # FAQ page
│   ├── login/                 # Login page
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Root page (redirect)
│   └── globals.css            # Global styles
├── components/
│   ├── layout/                # Layout components
│   │   ├── sidebar.tsx
│   │   ├── header.tsx
│   │   └── main-layout.tsx
│   ├── dashboard/             # Dashboard components
│   │   └── kpi-card.tsx
│   ├── surat-masuk/           # Incoming letters components
│   │   ├── form-dialog.tsx
│   │   └── data-table.tsx
│   ├── surat-keluar/          # Outgoing letters components
│   │   ├── form-dialog.tsx
│   │   └── data-table.tsx
│   ├── report/                # Report components
│   │   └── report-table.tsx
│   ├── faq/                   # FAQ components
│   │   └── faq-item.tsx
│   └── ui/                    # ShadCN UI components
├── hooks/
│   ├── use-auth.ts            # Authentication hook
│   └── use-mobile.ts          # Mobile detection hook
├── lib/
│   ├── db.ts                  # Database connection
│   ├── auth.ts                # Authentication utilities
│   ├── types.ts               # TypeScript types
│   ├── utils.ts               # Utility functions
│   └── utils/
│       └── uuid.ts            # UUID generator
├── scripts/
│   └── 01-init-database.sql   # Database initialization
├── .env.local                 # Environment variables
├── package.json
├── tsconfig.json
├── next.config.mjs
└── README.md
\`\`\`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login admin
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Dashboard
- `GET /api/dashboard/stats` - Get statistics

### Incoming Letters
- `GET /api/incoming-letters` - Get pending incoming letters
- `GET /api/incoming-letters/[id]` - Get specific letter
- `POST /api/incoming-letters` - Create new letter
- `PUT /api/incoming-letters/[id]` - Update letter
- `DELETE /api/incoming-letters/[id]` - Delete letter
- `GET /api/incoming-letters/archived` - Get archived letters

### Outgoing Letters
- `GET /api/outgoing-letters` - Get pending outgoing letters
- `GET /api/outgoing-letters/[id]` - Get specific letter
- `POST /api/outgoing-letters` - Create new letter
- `PUT /api/outgoing-letters/[id]` - Update letter
- `DELETE /api/outgoing-letters/[id]` - Delete letter
- `GET /api/outgoing-letters/archived` - Get archived letters

### Classifications
- `GET /api/classifications` - Get all classifications

### FAQ
- `GET /api/faqs` - Get all FAQs

## Database Schema

### users
- id (UUID)
- username (VARCHAR)
- email (VARCHAR)
- password_hash (VARCHAR)
- full_name (VARCHAR)
- role (ENUM: ADMIN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### classifications
- id (INT, AUTO_INCREMENT)
- code (VARCHAR, UNIQUE)
- description (VARCHAR)
- shelf_location (VARCHAR)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### incoming_letters
- id (UUID)
- letter_number (VARCHAR, UNIQUE)
- sender (VARCHAR)
- incoming_date (DATE)
- subject (VARCHAR)
- file_url (VARCHAR)
- classification_id (INT, FK)
- number_of_copies (INT)
- archive_file_number (VARCHAR)
- is_archived (BOOLEAN)
- recorded_by_user_id (UUID, FK)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### outgoing_letters
- id (UUID)
- letter_number (VARCHAR, UNIQUE)
- destination (VARCHAR)
- outgoing_date (DATE)
- subject (VARCHAR)
- file_url (VARCHAR)
- classification_id (INT, FK)
- number_of_copies (INT)
- archive_file_number (VARCHAR)
- is_archived (BOOLEAN)
- recorded_by_user_id (UUID, FK)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### faqs
- id (INT, AUTO_INCREMENT)
- question (VARCHAR)
- answer (TEXT)
- sort_order (INT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

## Fitur Keamanan

- **JWT Authentication**: Token-based authentication dengan expiry 24 jam
- **Password Hashing**: Bcrypt dengan salt rounds 10
- **HTTP-Only Cookies**: Token disimpan di HTTP-only cookies
- **CORS Protection**: Configured untuk production
- **Input Validation**: Validasi data di server-side

## Development

### Build untuk Production
\`\`\`bash
npm run build
npm start
\`\`\`

### Linting
\`\`\`bash
npm run lint
\`\`\`

## Troubleshooting

### Database Connection Error
- Pastikan MySQL service berjalan
- Verifikasi credentials di `.env.local`
- Pastikan database `e_arsip_db` sudah dibuat

### Login Gagal
- Pastikan database sudah diinisialisasi dengan script SQL
- Verifikasi username dan password di database
- Check browser console untuk error messages

### Port 3000 Sudah Digunakan
\`\`\`bash
npm run dev -- -p 3001
\`\`\`

## Performance Optimization

- Database queries menggunakan indexes pada `is_archived` dan `classification_id`
- Connection pooling untuk MySQL
- Lazy loading untuk components
- Image optimization dengan Next.js Image component

## Future Enhancements

- File upload untuk dokumen surat
- Export laporan ke PDF/Excel
- Email notifications
- Multi-user support dengan role management
- Audit trail untuk semua operasi
- Advanced search dengan full-text search
- Dashboard analytics dengan charts

## License

Proprietary - All Rights Reserved 2025

## Support

Untuk bantuan atau pertanyaan, hubungi admin@arsip.local

---

**Created with v0.app** - Modern, Professional, No Spaghetti Code
