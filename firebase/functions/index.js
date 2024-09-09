const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const fetch = require("node-fetch");
const dotenv = require("dotenv");

dotenv.config();

exports.games = onRequest(async (req, response) => {
  const url = "https://id.twitch.tv/oauth2/token";
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const grantType = "client_credentials";

  const data = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: grantType,
  });

  logger.info("Requesting token", {
    url, client_id: clientId, grant_type: grantType,
  });

  try {
    const tokenResponse = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(data),
    });

    logger.info("Token response status", {
      status: tokenResponse.status, statusText: tokenResponse.statusText,
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      throw new Error(
          `Failed to fetch token: ${tokenResponse.statusText} - ${errorText}`,
      );
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    const bodyFields = "fields name, aggregated_rating";
    const bodySort = "sort aggregated_rating desc";
    const bodyLimit = "limit 500";

    logger.info("Token received", {access_token: accessToken});

    const fetchResponse = await fetch("https://api.igdb.com/v4/games", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Client-ID": clientId,
        "Authorization": "Bearer " + accessToken,
      },
      body: `${bodyFields}; ${bodySort}; ${bodyLimit};`,
    });

    logger.info("Games response status", {
      status: fetchResponse.status, statusText: fetchResponse.statusText,
    });

    if (!fetchResponse.ok) {
      const errorText = await fetchResponse.text();
      throw new Error(
          `Failed to fetch games: ${fetchResponse.statusText} - ${errorText}`,
      );
    }

    const gamesData = await fetchResponse.json();
    const shuffledGames = gamesData.sort(() => 0.5 - Math.random());
    const randomGames = shuffledGames.slice(0, 20);

    response.status(200).json(randomGames);
  } catch (err) {
    logger.error("Error in games function!", err);
    response.status(500).send("Internal Server Error");
  }
});
