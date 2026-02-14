export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    const params = new URLSearchParams();
    Object.keys(req.body).forEach(key => {
      params.append(key, req.body[key]);
    });

    const googleResponse = await fetch("TON_URL_GOOGLE_SCRIPT", {
      method: "POST",
      body: params
    });

    const text = await googleResponse.text();

    return res.status(200).json({ success: true, google: text });

  } catch (error) {
    console.error("Erreur serveur :", error);
    return res.status(500).json({ error: error.message });
  }
}
