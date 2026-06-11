# API Documentation

## Base URL
- Development: `http://localhost:3001/api`
- Production: `https://api.ola-service.com/api`

## Authentication
All API endpoints (except auth) require a Bearer token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Core Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user

### Tickets
- `GET /tickets` - List tickets (with filters)
- `POST /tickets` - Create new ticket
- `GET /tickets/{id}` - Get ticket details
- `PUT /tickets/{id}/status` - Update ticket status
- `POST /tickets/{id}/feedback` - Submit feedback

### Users
- `GET /users/profile` - Get user profile
- `PUT /users/profile` - Update profile
- `GET /users/vehicles` - Get user vehicles

### Technicians
- `GET /technicians/assignments` - Get assigned tickets
- `PUT /technicians/location` - Update location
- `PUT /technicians/status` - Update availability

### Location Services
- `POST /location/geocode` - Address to coordinates
- `POST /location/reverse-geocode` - Coordinates to address
- `POST /location/directions` - Get directions

### File Upload
- `POST /upload/ticket-media` - Upload photos/videos
- `GET /upload/ticket-media/{ticket_id}` - Get ticket media

## Sample Requests

### Create Ticket
```json
POST /api/tickets
{
  "customer_id": "uuid-customer-123",
  "vehicle_id": "uuid-vehicle-456",
  "issue_category": "battery",
  "issue_description": "Scooter not charging properly",
  "location_data": {
    "latitude": 12.9716,
    "longitude": 77.5946,
    "address": "123 MG Road, Bangalore"
  },
  "priority": "high"
}
```

### Update Ticket Status
```json
PUT /api/tickets/{id}/status
{
  "status": "in_progress"
}
```

### Technician Location Update
```json
PUT /api/technicians/location
{
  "latitude": 12.9716,
  "longitude": 77.5946,
  "accuracy": 5
}
```

## WebSocket Events

### Client → Server
- `technician:location_update` - Send location update
- `ticket:join` - Join ticket room
- `chat:message` - Send chat message

### Server → Client
- `ticket:created` - New ticket created
- `ticket:status_updated` - Ticket status changed
- `technician:location` - Technician location update
- `notification` - Push notification

## Error Responses
```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {}
}
```

## Status Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error