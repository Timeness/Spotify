const express = require("express");
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();
const port = 3000;

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
});

app.get("/login", (req, res) => {
  const scopes = ["user-read-playback-state", "user-modify-playback-state", "user-read-currently-playing"];
  const authUrl = spotifyApi.createAuthorizeURL(scopes);
  res.redirect(authUrl);
});

app.get("/callback", async (req, res) => {
  const code = req.query.code;
  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    spotifyApi.setAccessToken(data.body["access_token"]);
    spotifyApi.setRefreshToken(data.body["refresh_token"]);
    res.send("Spotify authentication successful! You can now use the bot.");
  } catch (err) {
    res.status(500).send("Error during Spotify authentication");
  }
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
