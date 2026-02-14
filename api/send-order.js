export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    const response = await fetch("https://script.google.com/macros/s/AKfycbwdj9CrLkHTnR2r7twmM91cCqEpLXxc4jUw_7tAZfPzHwiU1VJsnLIFzsnZEfPaHXk/exec", {
      method: "POST",
      body: new URLSearchParams(req.body)
    });

    const text = await response.text();

    res.status(200).json({ success: true, data: text });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
