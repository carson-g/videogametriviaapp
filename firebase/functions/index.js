/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const fetch = require('node-fetch');

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase! #8");
// });

exports.games = onRequest(async (request, response) => {
  const url = 'https://id.twitch.tv/oauth2/token';
  const client_id = '92vctnbxp1ye8bdouo5suryaka853u';
  const client_secret = 'y0viidmd3hcwvhbdbsampaiuqgwd45';
  const grant_type = 'client_credentials';

  const data = {
    client_id: client_id,
    client_secret: client_secret,
    grant_type: grant_type
  };

  try {
    const tokenResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams(data)
    });

    if (!tokenResponse.ok) {
      throw new Error(`Failed to fetch token: ${tokenResponse.statusText}`);
    }

    const tokenData = await tokenResponse.json();
    const access_token = tokenData.access_token;

    const fetchResponse = await fetch("https://api.igdb.com/v4/games", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Client-ID': client_id,
        'Authorization': 'Bearer ' + access_token,
      },
      body: "fields name, aggregated_rating; sort aggregated_rating desc; limit 500;"
    });

    if (!fetchResponse.ok) {
      throw new Error(`Failed to fetch games: ${fetchResponse.statusText}`);
    }

    const gamesData = await fetchResponse.json();
    const shuffledGames = gamesData.sort(() => 0.5 - Math.random());
    const randomGames = shuffledGames.slice(0, 20);

    response.status(200).json(randomGames);
  } catch (err) {
    console.error(err);
    response.status(500).send('Internal Server Error');
  }
});
