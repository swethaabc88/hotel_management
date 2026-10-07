const { Pool, types } = require("pg");
require("dotenv").config();

// Parse PostgreSQL NUMERIC/DECIMAL (OID 1700) as JavaScript numbers
types.setTypeParser(1700, (val) => (val === null ? null : parseFloat(val)));

// PostgreSQL Connection Pool configuration
// Supports either DATABASE_URL or individual connection parameters
const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
    }
  : {
      host: process.env.DB_HOST || "localhost",
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || "stayscape",
    };

const pool = new Pool(poolConfig);

pool.on("connect", () => {
  console.log("✅ PostgreSQL client connected to database pool");
});

pool.on("error", (err) => {
  console.error("❌ Unexpected PostgreSQL pool error:", err);
});

module.exports = pool;