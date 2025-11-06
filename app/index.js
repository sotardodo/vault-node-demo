const mysql = require("mysql2/promise");
const { getSecret } = require("./vault");
const express = require("express");
const app = express();

app.get("/", async (req, res) => {
  try {
    // Ambil rahasia dari Vault
    const secret = await getSecret(process.env.DB_SECRET_PATH);
    const { username, password, host } = secret;

    // Koneksi ke MySQL
    const connection = await mysql.createConnection({
      host,
      user: username,
      password,
      database: "demo",
    });

    const [rows] = await connection.execute("SELECT NOW() AS now");
    await connection.end();

    res.json({ success: true, time: rows[0].now });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("✅ Node app running on port 3000"));

