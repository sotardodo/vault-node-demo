const axios = require("axios");

async function getSecret(secretPath, retries = 5) {
  const vaultAddr = process.env.VAULT_ADDR || "http://vault:8200";
  const vaultToken = process.env.VAULT_TOKEN || "root";

  for (let i = 0; i < retries; i++) {
    try {
      const res = await axios.get(`${vaultAddr}/v1/${secretPath}`, {
        headers: { "X-Vault-Token": vaultToken },
      });
      return res.data.data.data;
    } catch (err) {
      console.log(`Vault not ready, retrying (${i + 1}/${retries})...`);
      await new Promise((r) => setTimeout(r, 3000));
    }
  }

  throw new Error("Vault not reachable after retries");
}

module.exports = { getSecret };
