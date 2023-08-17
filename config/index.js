require("dotenv/config");

const { env } = process;

const config = {
  port: +env.PORT || 4000,
  jwtSecretKey: env.JWT_SECRET_KEY,
};

module.exports = config;
