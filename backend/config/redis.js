const redis = require('redis');

let client;

async function initializeRedis() {
  try {
    client = redis.createClient({
      url: process.env.REDIS_URL
    });
    
    client.on('error', (err) => console.error('Redis Client Error', err));
    client.on('connect', () => console.log('✅ Redis connected successfully'));
    
    await client.connect();
  } catch (error) {
    console.error('❌ Redis connection failed:', error);
    throw error;
  }
}

function getRedisClient() {
  return client;
}

module.exports = { initializeRedis, getRedisClient };