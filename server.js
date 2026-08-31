require("dotenv").config();
const express = require("express");
const fetch = require("node-fetch");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

const PORT = process.env.PORT || 3000;
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

app.post("/api/submit", async (req, res) => {
  const name1 = (req.body.name1 || "").trim();
  const name2 = (req.body.name2 || "").trim();

  if (!name1 || !name2) {
    return res.status(400).json({ error: "Both names are required." });
  }
  if (name1.length > 100 || name2.length > 100) {
    return res.status(400).json({ error: "Names are too long." });
  }

  if (!BOT_TOKEN || !CHAT_ID) {
    console.error("Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID in .env");
    return res.status(500).json({ error: "Server is not configured yet." });
  }

  const text = `New name suggestion\n\nName 1: ${name1}\nName 2: ${name2}`;

  try {
    const tgResp = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: CHAT_ID, text }),
      }
    );

    if (!tgResp.ok) {
      const errBody = await tgResp.text();
      console.error("Telegram API error:", errBody);
      return res.status(502).json({ error: "Failed to send to Telegram." });
    }

    return res.json({ ok: true });
  } catch (err) {
    console.error("Error contacting Telegram:", err);
    return res.status(500).json({ error: "Unexpected server error." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
