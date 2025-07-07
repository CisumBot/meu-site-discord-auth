const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const CLIENT_ID = "1328097422651691089";
const CLIENT_SECRET = "Fjh0Dxlg6UNFj3weYy-p1aE4w6_5lPKR";
const REDIRECT_URI = "https://cisumbot.wixsite.com/cisum/discord-callback";

app.post("/discord-auth", async (req, res) => {
  const { code } = req.body;

  try {
    // Trocar o code por um access token
    const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
      }),
    });

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Buscar dados do usuário
    const userResponse = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const userData = await userResponse.json();
    res.json(userData);
  } catch (err) {
    console.error("Erro ao autenticar com o Discord:", err);
    res.status(500).json({ error: "Erro na autenticação" });
  }
});

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
