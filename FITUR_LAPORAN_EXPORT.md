# Fitur Laporan & Export

## 📋 Overview
Fitur laporan dan export yang telah diimplementasikan untuk sistem E-Arsip Digital dengan kemampuan ekspor data ke berbagai format dan filter periode yang fleksibel.

## ✅ Fitur yang Telah Diimplementasikan

### 1. Export Data ke Excel/PDF
- ✅ **Export ke PDF**: Export laporan dengan format professional menggunakan jsPDF
- ✅ **Export ke Excel**: Export data ke format .xlsx menggunakan library xlsx
- ✅ **Metadata Lengkap**: Setiap export menyertakan informasi periode, tanggal cetak, dan filter yang digunakan
- ✅ **Format Terstruktur**: Data terorganisir dengan header dan styling yang rapi

### 2. Laporan Berdasarkan Periode
- ✅ **Filter Bulanan**: Pilih bulan dan tahun tertentu untuk melihat laporan bulanan
- ✅ **Filter Tahunan**: Lihat laporan untuk tahun tertentu
- ✅ **Filter Kustom**: Pilih range tanggal custom dengan date picker
- ✅ **Semua Data**: Opsi untuk melihat semua data tanpa filter periode

### 3. Print Report
- ✅ **Cetak Laporan**: Fitur print report dengan format siap cetak
- ✅ **Format A4**: Layout optimized untuk kertas A4
- ✅ **Print-friendly**: CSS khusus untuk hasil print yang optimal
- ✅ **Auto-print Dialog**: Otomatis membuka dialog print browser

## 🗂️ File yang Dibuat/Dimodifikasi

### File Baru:
1. **`src/lib/utils/export.ts`**
   - Utility functions untuk export PDF, Excel, dan Print
   - Fungsi: `exportToPDF()`, `exportToExcel()`, `printReport()`

2. **`src/components/report/report-filters.tsx`**
   - Komponen filter periode dengan UI yang user-friendly
   - Mendukung filter bulanan, tahunan, dan custom date range
   - Tombol export PDF, Excel, dan Print

### File yang Diupdate:
1. **`src/app/laporan-masuk/page.tsx`**
   - Integrasi fitur export dan filter periode untuk surat masuk
   - Handler functions untuk export dan print
   - UI yang lebih informatif dengan card sections

2. **`src/app/laporan-keluar/page.tsx`**
   - Integrasi fitur export dan filter periode untuk surat keluar
   - Handler functions untuk export dan print
   - UI yang lebih informatif dengan card sections

3. **`src/app/api/incoming-letters/archived/route.ts`**
   - Menambahkan support untuk query parameter periode (month, year, startDate, endDate)
   - Filter SQL untuk periode bulanan, tahunan, dan custom

4. **`src/app/api/outgoing-letters/archived/route.ts`**
   - Menambahkan support untuk query parameter periode
   - Filter SQL untuk periode bulanan, tahunan, dan custom

## 🎨 Fitur UI/UX

### Filter Section
- **Filter & Export Laporan Card**: Section terpisah untuk filter periode dan tombol export
- **Filter Tambahan Card**: Section untuk filter klasifikasi dan pencarian
- **Data Laporan Card**: Menampilkan tabel dengan informasi total data

### Tombol Export
- 🔴 **Export PDF**: Tombol merah untuk download PDF
- 🟢 **Export Excel**: Tombol hijau untuk download Excel  
- ⚪ **Print**: Tombol outline untuk print report

### Filter Periode
- **Dropdown Tipe Periode**: Pilihan "Semua Data", "Bulanan", "Tahunan", "Kustom"
- **Dynamic Fields**: Field bulan/tahun/date range muncul sesuai pilihan tipe periode
- **Date Picker**: Kalender interaktif dengan locale Indonesia untuk filter custom

## 📊 Format Export

### PDF Export
- Header dengan judul laporan
- Informasi periode, filter, dan tanggal cetak
- Tabel data dengan styling professional
- Footer dengan nomor halaman
- Auto-download dengan nama file timestamp

### Excel Export
- Sheet metadata di bagian atas
- Header kolom yang jelas
- Data terstruktur dalam format tabel
- Column width yang optimal
- Auto-download dengan nama file timestamp

### Print Report
- Layout A4 optimized
- Header dan informasi periode
- Tabel data dengan border
- Footer dengan timestamp
- Auto-trigger print dialog

## 🔧 Teknologi yang Digunakan

- **jsPDF**: Library untuk generate PDF
- **jsPDF-autoTable**: Plugin untuk membuat tabel di PDF
- **xlsx**: Library untuk export Excel
- **date-fns**: Date formatting dan manipulation
- **React Hook Form**: Form handling
- **Shadcn/UI**: Komponen UI (Select, Button, Calendar, etc.)
- **Sonner**: Toast notifications

## 📱 Responsive Design
- Desktop: Grid layout dengan 4 kolom untuk filter
- Tablet/Mobile: Stack layout untuk better mobile experience
- Print: Optimized untuk A4 paper

## 🚀 Cara Penggunaan

### 1. Filter Laporan Berdasarkan Periode
```
1. Buka halaman Laporan Surat Masuk/Keluar
2. Pilih "Tipe Periode":
   - Bulanan: Pilih bulan dan tahun
   - Tahunan: Pilih tahun
   - Kustom: Pilih tanggal mulai dan akhir
   - Semua Data: Tampilkan semua data
3. Data otomatis ter-filter
```

### 2. Export ke PDF
```
1. Filter data sesuai kebutuhan
2. Klik tombol "Export PDF"
3. File PDF akan otomatis ter-download
4. Notification sukses akan muncul
```

### 3. Export ke Excel
```
1. Filter data sesuai kebutuhan
2. Klik tombol "Export Excel"
3. File .xlsx akan otomatis ter-download
4. Notification sukses akan muncul
```

### 4. Print Report
```
1. Filter data sesuai kebutuhan
2. Klik tombol "Print"
3. Window baru akan terbuka dengan preview print
4. Dialog print browser akan otomatis muncul
5. Pilih printer dan cetak
```

## ✨ Fitur Tambahan

- **Validation**: Cek data kosong sebelum export/print
- **Toast Notifications**: Feedback user untuk setiap aksi
- **Loading States**: Button disabled saat proses export
- **Error Handling**: Proper error handling dengan user feedback
- **Consistent Naming**: File export dengan timestamp untuk menghindari duplicate

## 🎯 Best Practices Implemented

- TypeScript strict typing
- Clean code architecture
- Reusable components
- Proper error handling
- User-friendly notifications
- Responsive design
- Accessible UI
- SEO-friendly (lang attribute)
- Performance optimized

## 📝 Notes

- Semua export file menggunakan timestamp format: `yyyyMMdd-HHmmss`
- Format tanggal Indonesia: `dd/MM/yyyy`
- Locale date-fns: Indonesia (id)
- API endpoints sudah support filter periode
- Data diurutkan berdasarkan tanggal (terbaru ke terlama)

---

**Status**: ✅ Semua fitur telah diimplementasikan dan diuji
**Dependencies**: Sudah terinstall (jspdf, jspdf-autotable, xlsx)
**Errors**: Tidak ada error kompilasi

