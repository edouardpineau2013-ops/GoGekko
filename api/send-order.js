export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    const params = new URLSearchParams();
    for (const key in req.body) {
      params.append(key, req.body[key]);
    }

    const googleResponse = await fetch("https://script.google.com/macros/s/AKfycbwlvHNCGzIx9maX75JTEnfwyEB2FXKhUGpYNhDVmxThyw8oqV5gtzBHNLIX_WNHh_I/exec", {
      method: "POST",
      body: params
    });

    const text = await googleResponse.text();

    return res.status(200).json({
      success: true,
      googleStatus: googleResponse.status,
      googleResponse: text
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      stack: error.stack
    });
  }
}
