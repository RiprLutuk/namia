# Spam Caller Defense System 🛡️🚫

A comprehensive anti-spam solution featuring a native Android client and a Laravel backend. This system protects users from spam calls using crowd-sourced reporting, web scraping intelligence, and secure cloud backups.

![Project Banner](https://via.placeholder.com/800x200.png?text=Spam+Caller+Defense+System)

## ✨ Features

### 📱 Android Client
- **Caller ID & Blocking**: Automatically screens incoming calls and blocks numbers flagged as "Spam".
- **Beautiful UI**: Dark-themed, Google-Dialer inspired interface with circular icons and relative timestamps.
- **Smart Intelligence**:
    - **Web Scraping**: Unknown numbers are simulated-checked against online sources (Mocked: numbers ending in `999` are flagged).
    - **Local Caching**: Blocks persist even when offline via Room Database.
- **Crowd Reporting**: "Report" button to instantly flag a number and sync it to the community.
- **Contact Cloud Backup**: securely backup your contacts to the cloud to prevent them from ever being blocked (Whitelist).

### 🖥️ Backend (Laravel)
- **Centralized Database**: Stores reported numbers and blocklists.
- **API**:
    - `POST /report`: Receive spam reports.
    - `GET /sync`: Delta-sync updates to clients.
    - `POST /contacts/backup`: Secure contact vault with upsert (deduplication) logic.
- **Threshold Logic**: Auto-blocks numbers after receiving reports (Current Config: Immediate Block on 1 report).

## 🛠️ Tech Stack

### Android (Native)
- **Language**: Java
- **Architecture**: MVC / Service-based
- **Key Libraries**:
    - `Retrofit` (Networking)
    - `Room` (Local Database)
    - `WorkManager` (Background Sync & Backup)
    - `CallScreeningService` (Telecom API)

### Backend
- **Framework**: Laravel 11
- **Database**: MariaDB / PostgreSQL
- **Server**: Apache / Nginx (or `php artisan serve` for dev)

## 🚀 Getting Started

### Prerequisites
- Android Studio Koala or newer.
- PHP 8.2+, Composer.
- A database server.

### 1. Backend Setup
```bash
cd backend
composer install
cp .env.example .env
# Configure DB in .env
php artisan migrate
php artisan key:generate
php artisan serve
```

### 2. Android Setup
1. Open `android/` in Android Studio.
2. Update `NetworkClient.java` with your backend's IP address (host machine IP if using Emulator).
3. Build and Run.
4. Grant **Call Screening** and **Contact** permissions when prompted.

## 🤝 Contributing
Contributions are welcome! Please fork the repository and submit a pull request.

## 📝 License
This project is open-source and available under the [MIT License](LICENSE).
