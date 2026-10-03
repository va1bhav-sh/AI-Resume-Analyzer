require("dotenv").config();

const { CohereClientV2 } = require("cohere-ai");

const cohere = new CohereClientV2({
  token: process.env.COHERE_API_KEY,
});

module.exports = cohere;