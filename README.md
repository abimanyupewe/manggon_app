# Manggon Mobile — Tenant Portal

<p align="center">
  <img src="https://img.shields.io/badge/Platform-React%20Native%20%7C%20Expo%20SDK%2057-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo SDK 57" />
  <img src="https://img.shields.io/badge/Language-TypeScript%20Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript Strict" />
  <img src="https://img.shields.io/badge/Architecture-Clean%20Architecture-2B7A78?style=for-the-badge" alt="Clean Architecture" />
  <img src="https://img.shields.io/badge/State-Zustand%20%2B%20TanStack%20Query-FF4154?style=for-the-badge" alt="State Management" />
  <img src="https://img.shields.io/badge/Backend-Laravel%20Sanctum-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel Sanctum" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License MIT" />
</p>

> **"Manajemen Kos Putri Multi-Lokasi, Aman, dan Transparan."**  
> *Aplikasi klien mobile berbasis React Native (Expo SDK 57) yang dirancang secara khusus untuk penghuni (**Tenant / Anak Kos Putri**) dalam ekosistem properti Manggon.*

---

## 1. Tentang Proyek

**Manggon Mobile** adalah aplikasi portofolio level enterprise yang menjadi jembatan komunikasi operasional antara anak kos putri, staf penjaga cabang, dan pemilik kos (*superadmin*). 

Proyek ini memecahkan berbagai tantangan operasional kos konvensional:
* **Mencegah Fraud Finansial:** Menghilangkan pembayaran tunai manual tanpa jejak melalui integrasi upload bukti transfer perbankan langsung ke sistem.
* **Keamanan & Satpam Digital:** Menggantikan buku tamu kertas konvensional dengan sistem perizinan digital untuk jam malam serta pendataan tamu wanita yang menginap.
* **Transparansi Perbaikan Fasilitas:** Menyediakan tiket keluhan transparan dengan *timeline tracking* status perbaikan secara langsung dari staf cabang.

---

## 2. Fitur Utama (Core Modules)

Aplikasi klien mobile berfokus pada 4 modul fungsional utama bagi tenant:

### 1. Force Password Change (First-Login Security)
* Menangani alur keamanan saat anak kos pertama kali login menggunakan kredensial acak dari sistem.
* Intersepsi respon HTTP `403` bertanda `MUST_CHANGE_PASSWORD` dengan token sementara.
* Mengunci navigasi aplikasi pada layar rotasi kata sandi sebelum pengguna diizinkan masuk ke Beranda.

### 2. Satpam Digital (Security Desk)
* **Izin Pulang Malam (`late_return`):** Formulir pengajuan jam kedatangan terlambat beserta alasan operasional.
* **Izin Tamu Menginap (`guest_visit`):** Pendataan nama tamu wanita dan estimasi durasi kunjungan.
* **Live Status Tracking:** Memantau status persetujuan staf cabang (`Menunggu Konfirmasi`, `Disetujui`, atau `Ditolak` disertai alasan penolakan).

### 3. Pembayaran Mandiri (Billing & Proof Upload)
* Ringkasan status sewa bulan berjalan (`Lunas` / `Belum Dibayar`).
* Menampilkan informasi rekening resmi cabang kos untuk menghindari penipuan rekening pihak ketiga.
* Unggah bukti transfer langsung dari kamera atau galeri dengan kompresi lokal sebelum dikirim ke server.

### 4. Sistem Tiket Keluhan (Complaints / Maintenance)
* Pelaporan kerusakan fasilitas kamar (AC, kran air, kelistrikan, fasilitas kamar mandi).
* Lampiran foto bukti kerusakan.
* Pemantauan progres penanganan oleh staf: `Menunggu` -> `Sedang Ditangani` -> `Selesai`.

### 5. Profil & Kontak Darurat
* Rincian nomor kamar, lantai, harga sewa, dan daftar fasilitas.
* Pembaruan data nomor ponsel dan kontak darurat (Orang Tua / Wali).

---

## 3. Tech Stack & Ekosistem

Aplikasi dibangun dengan memprioritaskan performa rendering, *strict type safety*, dan arsitektur modular yang dapat diuji (*testable*):

| Kategori | Teknologi / Library | Deskripsi & Peran |
| :--- | :--- | :--- |
| **Framework** | [React Native (v0.86)](https://reactnative.dev/) & [Expo SDK 57](https://expo.dev/) | Ekosistem cross-platform modern dengan akses native modul optimal. |
| **Bahasa** | [TypeScript 6](https://www.typescriptlang.org/) | Pengetikan statis ketat (*Strict Mode*, `noImplicitAny: true`). |
| **UI Styling** | React Native `StyleSheet` | Styling murni berperforma tinggi tanpa overhead runtime, Clean Minimalist theme. |
| **Icons** | [Lucide React Native](https://lucide.dev/) | Ikon vektor bergaris tipis, konsisten, dan elegan. |
| **Routing** | [Expo Router (v57)](https://docs.expo.dev/router/introduction/) | File-based navigation dengan performa transisi native. |
| **Async State** | [@tanstack/react-query](https://tanstack.com/query/latest) | Manajemen cache data API, background refetching, dan loading states. |
| **Global State** | [Zustand](https://zustand.docs.pmnd.rs/) | State management sinkron yang ultra-ringan untuk sesi auth & profil pengguna. |
| **Network Client**| [Axios](https://axios-http.com/) | HTTP client dengan interceptor token Bearer dan auto-logout 401. |
| **Form & Validasi**| [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/) | Validasi skema formulir terstruktur dengan pesan kesalahan yang ramah. |
| **Enkripsi Token**| [expo-secure-store](https://docs.expo.dev/versions/latest/sdk/securestore/) | Enkripsi Bearer Token di hardware level (Android Keystore / iOS Keychain). |
| **Media Native** | [expo-image-picker](https://docs.expo.dev/versions/latest/sdk/imagepicker/) & [image-manipulator](https://docs.expo.dev/versions/latest/sdk/imagemanipulator/) | Akses kamera/galeri dan kompresi foto bukti bayar secara lokal. |

---

## 4. Pola Arsitektur (*Feature-Based Clean Architecture*)

Struktur proyek diorganisir ke dalam lapisan tanggung jawab (*layers of concerns*) yang terpisah dari komponen UI:

```
src/
├── core/                       # Global setup, utilities, theme, and network client
│   ├── api/                    # Axios instance & request/response interceptors
│   ├── config/                 # Konfigurasi runtime & Environment variables
│   └── theme/                  # Skema warna Clean Minimalist, tipografi, dan metrik
├── domain/                     # Core Business Domain (Murni TypeScript, No UI)
│   ├── models/                 # Model entitas (User, Bill, SecurityLog, Complaint)
│   └── repositories/           # Interface kontrak pemanggilan API
├── data/                       # Data Implementation Layer
│   ├── sources/                # Implementasi API remote (Axios endpoints)
│   └── secure_storage/         # Wrapper token storage (expo-secure-store)
└── presentation/               # Antarmuka Pengguna & State
    ├── app/                    # Expo Router pages/routes
    ├── components/             # Komponen UI atomik & reusable (Button, Input, Card)
    ├── screens/                # Implementasi layar spesifik per fitur
    └── store/                  # Global Zustand stores (AuthStore, UserStore)
```

---

## 5. Panduan Instalasi & Menjalankan Aplikasi

### Prasyarat:
* [Node.js](https://nodejs.org/) LTS (v20.x atau v22.x disarankan).
* Manajer paket: `npm` atau `pnpm` / `yarn`.
* [Expo Go](https://expo.dev/go) pada perangkat fisik, atau Android Studio (Emulator) / Xcode (Simulator).

### Langkah-langkah:

1. **Clone repositori:**
   ```bash
   git clone <URL_REPOSITORI>
   cd manggon_app
   ```

2. **Instal dependensi:**
   ```bash
   npm install
   ```

3. **Konfigurasi Environment Variables:**
   Salin berkas `.env.example` menjadi `.env`:
   ```bash
   cp .env.example .env
   ```
   Atur `EXPO_PUBLIC_API_URL` sesuai lingkungan Anda:
   * **Android Emulator:** `http://10.0.2.2:8000/api/v1`
   * **iOS Simulator:** `http://localhost:8000/api/v1`
   * **Device Fisik (LAN):** `http://<IP_KOMPUTER_HOST>:8000/api/v1`

4. **Jalankan Development Server:**
   ```bash
   npx expo start
   ```

5. **Pilih target platform:**
   * Tekan `a` untuk membuka di Android Emulator / Device.
   * Tekan `i` untuk membuka di iOS Simulator.
   * Pindai kode QR menggunakan aplikasi **Expo Go** pada ponsel fisik Anda.

---

## 6. Referensi Dokumentasi Spesifikasi

Dokumentasi lengkap dan kontrak teknis proyek tersedia di folder [`dev/`](file:///home/clara/Project/manggon_app/dev):

* [Product Requirements Document (PRD)](file:///home/clara/Project/manggon_app/dev/Product%20Requirements%20Document%20%28PRD%29%20-%20Manggon.md): Visi produk, latar belakang, target persona, dan batasan fitur MVP.
* [Software Design Document (SDD)](file:///home/clara/Project/manggon_app/dev/Software%20Design%20Document%20%28SDD%29%20-%20Manggon%20Mobile.md): Cetak biru arsitektur Clean Architecture, spesifikasi pustaka, dan alur autentikasi Sanctum.
* [Mobile REST API Contract (v1)](file:///home/clara/Project/manggon_app/dev/docs/MOBILE_API_CONTRACT.md): Rincian 12 endpoint API, format envelope standar, skema request/response JSON, dan definisi interface TypeScript.

---

## 7. Lisensi

Proyek ini dilisensikan di bawah [MIT License](file:///home/clara/Project/manggon_app/LICENSE).
