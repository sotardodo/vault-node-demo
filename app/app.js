const axios = require("axios");

async function getSecret(secretPath) {
  const vaultAddr = process.env.VAULT_ADDR || "http://127.0.0.1:8200";
  const vaultToken = process.env.VAULT_TOKEN;

  try {
    const res = await axios.get(`${vaultAddr}/v1/${secretPath}`, {
      headers: { "X-Vault-Token": vaultToken },
    });
    return res.data.data.data; // vault kv v2
  } catch (err) {
    console.error("Error getting secret from Vault:", err.message);
    throw err;
  }
}

module.exports = { getSecret };

