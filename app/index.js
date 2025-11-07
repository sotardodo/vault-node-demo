const express = require("express");
const mysql = require("mysql2/promise");
const { getSecret } = require("./vault");

const app = express();
const PORT = 3000;

async function startServer() {
  console.log("Starting app...");

  // Ambil kredensial DB dari Vault
  const secretPath = process.env.DB_SECRET_PATH || "secret/data/mysql";
  const secrets = await getSecret(secretPath);

  const dbUser = secrets.username;
  const dbPass = secrets.password;

  console.log("Connecting to MySQL...");

  const db = await mysql.createConnection({
    host: "mysql",
    user: dbUser,
    password: dbPass,
    database: "demo",
  });

  console.log("Connected to MySQL!");

  app.get("/", async (req, res) => {
    const [rows] = await db.query("SELECT NOW() AS time");
    res.send(`✅ Vault + MySQL connected! Server time: ${rows[0].time}`);
  });

  app.listen(PORT, () => {
    console.log(`Node.js app running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("❌ Error starting app:", err.message);
  process.exit(1);
});
