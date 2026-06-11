-- Ola Electric Service Tracking Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (customers, technicians, admins)
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('customer', 'technician', 'admin')),
    profile_data JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vehicles table
CREATE TABLE vehicles (
    vehicle_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vin VARCHAR(17) UNIQUE NOT NULL,
    customer_id UUID NOT NULL REFERENCES users(user_id),
    model VARCHAR(100) NOT NULL,
    battery_serial VARCHAR(100),
    vehicle_specs JSONB DEFAULT '{}',
    purchase_date DATE,
    warranty_status VARCHAR(20) DEFAULT 'active' CHECK (warranty_status IN ('active', 'expired', 'extended')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SLA Rules table
CREATE TABLE sla_rules (
    rule_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    issue_category VARCHAR(50) NOT NULL,
    priority VARCHAR(20) NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    assign_time_minutes INTEGER NOT NULL DEFAULT 15,
    response_time_minutes INTEGER NOT NULL DEFAULT 30,
    arrival_time_minutes INTEGER NOT NULL DEFAULT 120,
    service_time_minutes INTEGER NOT NULL DEFAULT 240,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tickets table
CREATE TABLE tickets (
    ticket_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_number VARCHAR(20) UNIQUE NOT NULL,
    customer_id UUID NOT NULL REFERENCES users(user_id),
    vehicle_id UUID NOT NULL REFERENCES vehicles(vehicle_id),
    issue_category VARCHAR(50) NOT NULL CHECK (issue_category IN ('battery', 'motor', 'brake', 'electrical', 'body', 'other')),
    issue_description TEXT NOT NULL,
    location_data JSONB NOT NULL,
    priority VARCHAR(20) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    status VARCHAR(20) NOT NULL DEFAULT 'created' CHECK (status IN ('created', 'assigned', 'en_route', 'arrived', 'in_progress', 'completed', 'closed', 'cancelled', 'escalated')),
    sla_start_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    sla_due_time TIMESTAMP NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    customer_feedback TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- Technicians table
CREATE TABLE technicians (
    technician_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id),
    employee_id VARCHAR(20) UNIQUE NOT NULL,
    skills JSONB DEFAULT '[]',
    availability_status VARCHAR(20) DEFAULT 'available' CHECK (availability_status IN ('available', 'busy', 'offline', 'break')),
    current_location JSONB,
    rating_avg DECIMAL(3,2) DEFAULT 0.00,
    tickets_completed INTEGER DEFAULT 0,
    last_location_update TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Assignments table
CREATE TABLE assignments (
    assignment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID NOT NULL REFERENCES tickets(ticket_id),
    technician_id UUID NOT NULL REFERENCES technicians(technician_id),
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    accepted_at TIMESTAMP,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    assignment_status VARCHAR(20) DEFAULT 'assigned' CHECK (assignment_status IN ('assigned', 'accepted', 'declined', 'started', 'completed', 'cancelled')),
    notes TEXT
);

-- Ticket Events table (audit trail)
CREATE TABLE ticket_events (
    event_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID NOT NULL REFERENCES tickets(ticket_id),
    user_id UUID REFERENCES users(user_id),
    event_type VARCHAR(50) NOT NULL,
    event_data JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Photos and Videos table
CREATE TABLE photos_videos (
    media_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID NOT NULL REFERENCES tickets(ticket_id),
    uploaded_by UUID NOT NULL REFERENCES users(user_id),
    media_type VARCHAR(10) NOT NULL CHECK (media_type IN ('photo', 'video')),
    file_url VARCHAR(500) NOT NULL,
    category VARCHAR(20) NOT NULL CHECK (category IN ('before', 'after', 'parts', 'damage', 'other')),
    metadata JSONB DEFAULT '{}',
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Parts Used table
CREATE TABLE parts_used (
    usage_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID NOT NULL REFERENCES tickets(ticket_id),
    part_number VARCHAR(100) NOT NULL,
    part_name VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_cost DECIMAL(10,2),
    part_category VARCHAR(50),
    used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Escalations table
CREATE TABLE escalations (
    escalation_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID NOT NULL REFERENCES tickets(ticket_id),
    escalated_by UUID REFERENCES users(user_id),
    escalated_to UUID REFERENCES users(user_id),
    escalation_reason VARCHAR(50) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'resolved', 'closed')),
    escalated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_tickets_customer_id ON tickets(customer_id);
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_created_at ON tickets(created_at);
CREATE INDEX idx_tickets_sla_due_time ON tickets(sla_due_time);
CREATE INDEX idx_assignments_ticket_id ON assignments(ticket_id);
CREATE INDEX idx_assignments_technician_id ON assignments(technician_id);
CREATE INDEX idx_ticket_events_ticket_id ON ticket_events(ticket_id);
CREATE INDEX idx_ticket_events_created_at ON ticket_events(created_at);
CREATE INDEX idx_technicians_availability ON technicians(availability_status);
CREATE INDEX idx_vehicles_customer_id ON vehicles(customer_id);

-- GIN indexes for JSONB columns
CREATE INDEX idx_tickets_location_data ON tickets USING GIN (location_data);
CREATE INDEX idx_technicians_current_location ON technicians USING GIN (current_location);
CREATE INDEX idx_technicians_skills ON technicians USING GIN (skills);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tickets_updated_at BEFORE UPDATE ON tickets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();