const express = require("express");
const config = require("../config");
const sequelize = require("./database/sequelize");
const routes = require("./routes");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

const bootstrap = async (req, res) => {
  await sequelize.authenticate({
    logging: false,
  });

  await sequelize.sync({
    alter: true,
    logging: false,
  });

  app.listen(config.port, () => {
    console.log(config.port);
  });
};
bootstrap();
