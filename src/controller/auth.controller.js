const bcrypt = require("bcrypt");
const jwt = require("../libs/jwt");
const { generateHash, compareHash } = require("../libs/bcrypt");
const { jwtSecretKey } = require("../../config");
const Users = require("../models/auth.model");


const register = async (req, res) => {
  try {
    const { username, password } = req.body;

    const generate = await generateHash(password);
    const findUser = await Users.findAll({
      where: { username },
      logging: false,
    });

    if (findUser.length > 0) {
      return res.status(404).json({ message: "Username already exists" });
    }

    const admin = await Users.create({ username, password: generate }, {logging: false});

    const token = jwt.sign({ userId: admin.id });

    res.cookie("token", token);

    res.status(201).json({ message: "User created", token });
  } catch (error) {
    console.log(error.message);
  }
};


const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const findUser = await Users.findAll({
      where: { username },
      logging: false,
    });

    if (findUser.length < 1) {
      return res
        .status(404)
        .json({ message: "Invalid email or password provided for login" });
    }
    const compare = await compareHash(password, findUser[0].password);

    if (!compare) {
      return res
        .status(404)
        .json({ message: "Invalid password provided to login" });
    }
    console.log(findUser[0].id);
    const token = jwt.sign({ userId: findUser[0].id });

    res.cookie("token", token);

    res.status(201).json({ message: "Login successful", token: token });
  } catch (error) {
    console.log(error);
  }
};



const changePassword = async (req, res) => {
  try {
    const { password, newpass, renewpass } = req.body;
    const { token } = req.cookies;
    const decodedToken = jwt.verify(token, jwtSecretKey);
    const userId = decodedToken.userId;

    const user = await Users.findByPk(userId, { logging: false });
    const compare = await compareHash(password, user.password);

    if (!compare) {
      return res.status(404).json({ message: "Invalid password" });
    } else if ( newpass === renewpass) {
      const generate = await generateHash(newpass);
      user.password = generate;
      await user.save({ logging: false });
      res.status(201).json({ message: "Successfully changed password" });
    } else {
      res.status(403).json({
        message:
          "Error something email or new Password or return new Password ",
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  login,
  register,
  changePassword,
};
