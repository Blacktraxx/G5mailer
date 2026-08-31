module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const name1 = String(req.body?.name1 || "").trim();
  const name2 = String(req.body?.name2 || "").trim();

  if (!name1 || !name2) {
    return res.status(400).json({ error: "Both names are required." });
  }

  if (name1.length > 100 || name2.length > 100) {
    return res.status(400).json({ error: "Names are too long." });
  }

  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  if (!BOT_TOKEN || !CHAT_ID) {
    console.error("Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID environment variables.");
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

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Error contacting Telegram:", err);
    return res.status(500).json({ error: "Unexpected server error." });
  }
};
