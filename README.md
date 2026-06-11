# Ola Electric After-Sales Service Tracking System

## Overview
Complete B2B after-sales service tracking system for electric scooters with real-time tracking, SLA management, and multi-user interfaces.

## Architecture
- **Backend**: Node.js + Express + PostgreSQL
- **Frontend**: React (Customer Portal) + React Native (Technician App) + Admin Dashboard
- **Real-time**: Socket.io + Redis
- **Maps**: Google Maps API integration
- **File Storage**: Local storage (production: AWS S3)

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- Google Maps API key

### Installation
```bash
# Clone and setup
git clone <repo-url>
cd ola-service-tracking

# Backend setup
cd backend
npm install
cp .env.example .env
# Configure database and API keys in .env
npm run migrate
npm run seed
npm start

# Frontend setup
cd ../frontend
npm install
npm start

# Technician app
cd ../mobile-app
npm install
npx react-native run-android
```

## Project Structure
```
├── backend/           # Node.js API server
├── frontend/          # React customer portal
├── mobile-app/        # React Native technician app
├── admin-dashboard/   # Admin interface
├── database/          # SQL migrations & seeds
├── docs/             # API documentation
└── diagrams/         # Mermaid diagrams
```

## Features
- ✅ Real-time ticket tracking
- ✅ GPS-based technician assignment
- ✅ SLA monitoring & auto-escalation
- ✅ Photo/video evidence capture
- ✅ Multi-role dashboards
- ✅ WhatsApp/SMS notifications
- ✅ Parts inventory tracking

## API Documentation
Visit `/api/docs` for Swagger documentation

## License
MIT