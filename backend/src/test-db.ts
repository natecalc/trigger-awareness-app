// test-db.js
import { createDb } from "./db";

async function testConnection() {
  try {
    console.log("Testing database connection...");
    const pool = await createDb();

    // Test a simple query
    const result = await pool.query("SELECT NOW() as current_time");
    console.log(
      "Connection successful! Current time:",
      result.rows[0].current_time
    );

    // Close the connection
    await pool.end();
    console.log("Connection closed.");
  } catch (error) {
    console.error("Database connection test failed:", error);
  }
}

testConnection();
