export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Clé API OpenAI manquante" });
  }

  try {
    // ✅ Lire le corps de la requête manuellement
    let body = "";
    await new Promise((resolve, reject) => {
      req.on("data", chunk => {
        body += chunk;
      });
      req.on("end", () => resolve());
      req.on("error", err => reject(err));
    });

    const parsedBody = JSON.parse(body);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: parsedBody.messages,
        temperature: 0.7
      })
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message || "Erreur serveur" });
  }
}
