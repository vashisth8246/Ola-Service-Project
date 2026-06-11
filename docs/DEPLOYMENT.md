# Deployment Guide

## Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- Google Maps API Key
- Twilio Account (for SMS)

## Environment Setup

### Backend (.env)
```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ola_service_db
DB_USER=postgres
DB_PASSWORD=your_password

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h

# Google Maps
GOOGLE_MAPS_API_KEY=your-google-maps-key

# Twilio
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=+1234567890

# Server
PORT=3001
NODE_ENV=production
```

### Frontend (.env)
```bash
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_SOCKET_URL=http://localhost:3001
REACT_APP_GOOGLE_MAPS_KEY=your-google-maps-key
```

## Local Development

### 1. Install Dependencies
```bash
npm run install-all
```

### 2. Setup Database
```bash
# Create PostgreSQL database
createdb ola_service_db

# Run migrations
cd backend
npm run migrate
npm run seed
```

### 3. Start Services
```bash
# Start Redis
redis-server

# Start backend
cd backend
npm run dev

# Start frontend (new terminal)
cd frontend
npm start

# Start mobile app (new terminal)
cd mobile-app
npx react-native start
npx react-native run-android
```

## Production Deployment

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d
```

### Manual Deployment

#### Backend
```bash
cd backend
npm install --production
npm run build
pm2 start server.js --name ola-backend
```

#### Frontend
```bash
cd frontend
npm install
npm run build
# Serve build folder with nginx
```

### Database Migration
```bash
cd backend
NODE_ENV=production npm run migrate
```

## Monitoring & Logging

### PM2 Process Management
```bash
# Start all processes
pm2 start ecosystem.config.js

# Monitor
pm2 monit

# Logs
pm2 logs
```

### Health Checks
- Backend: `GET /health`
- Database: Connection pool monitoring
- Redis: Connection status

## Security Checklist
- [ ] Environment variables secured
- [ ] HTTPS enabled
- [ ] Rate limiting configured
- [ ] Input validation implemented
- [ ] SQL injection prevention
- [ ] JWT secret rotation
- [ ] File upload restrictions
- [ ] CORS properly configured

## Performance Optimization
- [ ] Database indexes created
- [ ] Redis caching implemented
- [ ] Image compression enabled
- [ ] CDN for static assets
- [ ] Gzip compression
- [ ] Connection pooling
- [ ] Background job queues

## Backup Strategy
- [ ] Database daily backups
- [ ] File storage backups
- [ ] Configuration backups
- [ ] Disaster recovery plan