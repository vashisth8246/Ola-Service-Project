require('dotenv').config();
const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

async function seedDatabase() {
  try {
    console.log('🌱 Seeding database...');

    // Create admin user
    const adminId = uuidv4();
    const adminPassword = await bcrypt.hash('admin123', 12);
    
    await pool.query(`
      INSERT INTO users (user_id, email, password_hash, name, phone, user_type)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (email) DO NOTHING
    `, [adminId, 'admin@ola.com', adminPassword, 'System Admin', '+91-9999999999', 'admin']);

    // Create sample customer
    const customerId = uuidv4();
    const customerPassword = await bcrypt.hash('customer123', 12);
    
    await pool.query(`
      INSERT INTO users (user_id, email, password_hash, name, phone, user_type)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (email) DO NOTHING
    `, [customerId, 'customer@example.com', customerPassword, 'John Doe', '+91-9876543210', 'customer']);

    // Create sample technician
    const technicianUserId = uuidv4();
    const technicianPassword = await bcrypt.hash('tech123', 12);
    
    await pool.query(`
      INSERT INTO users (user_id, email, password_hash, name, phone, user_type)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (email) DO NOTHING
    `, [technicianUserId, 'tech@ola.com', technicianPassword, 'Ravi Kumar', '+91-9876543211', 'technician']);

    // Create technician profile
    const technicianId = uuidv4();
    await pool.query(`
      INSERT INTO technicians (technician_id, user_id, employee_id, skills, current_location)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (employee_id) DO NOTHING
    `, [
      technicianId, 
      technicianUserId, 
      'TECH001', 
      JSON.stringify(['battery', 'motor', 'electrical']),
      JSON.stringify({ latitude: 12.9716, longitude: 77.5946 })
    ]);

    // Create sample vehicle
    const vehicleId = uuidv4();
    await pool.query(`
      INSERT INTO vehicles (vehicle_id, vin, customer_id, model, battery_serial)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (vin) DO NOTHING
    `, [vehicleId, 'OLA2024EV123456789', customerId, 'Ola S1 Pro', 'BAT123456']);

    // Create SLA rules
    const slaRules = [
      { category: 'battery', priority: 'critical', assign: 5, response: 15, arrival: 60, service: 120 },
      { category: 'battery', priority: 'high', assign: 10, response: 20, arrival: 90, service: 180 },
      { category: 'battery', priority: 'medium', assign: 15, response: 30, arrival: 120, service: 240 },
      { category: 'motor', priority: 'critical', assign: 5, response: 15, arrival: 60, service: 180 },
      { category: 'motor', priority: 'high', assign: 10, response: 20, arrival: 90, service: 240 },
      { category: 'electrical', priority: 'high', assign: 10, response: 20, arrival: 90, service: 180 },
      { category: 'brake', priority: 'critical', assign: 5, response: 15, arrival: 45, service: 120 }
    ];

    for (const rule of slaRules) {
      await pool.query(`
        INSERT INTO sla_rules (rule_id, issue_category, priority, assign_time_minutes, response_time_minutes, arrival_time_minutes, service_time_minutes)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT DO NOTHING
      `, [uuidv4(), rule.category, rule.priority, rule.assign, rule.response, rule.arrival, rule.service]);
    }

    console.log('✅ Database seeded successfully');
    console.log('📋 Sample credentials:');
    console.log('   Admin: admin@ola.com / admin123');
    console.log('   Customer: customer@example.com / customer123');
    console.log('   Technician: tech@ola.com / tech123');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seedDatabase();