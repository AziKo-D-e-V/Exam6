const bcrypt = require("bcrypt");
const jwt = require("../libs/jwt");
const { generateHash, compareHash } = require("../libs/bcrypt");
const { jwtSecretKey } = require("../../config");
const { promisify } = require("util");
const Redis = require("ioredis");
const nodemailer = require("nodemailer");
const Student = require("../models/student.model");

const redis = new Redis({
  port: 6379,
  host: "127.0.0.1",
  password: "aziz0107",
  db: 0,
});

const register = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    const generate = await generateHash(password);

    const findStudent = await Student.findAll(
      { where: { email: email } },
      { logging: false }
    );

    console.log(findStudent.email);

    if (findStudent.length > 0) {
      return res.status(404).json({ message: "Student already exists" });
    } 
    else {
      redis.get("code", async (err, data) => {
        if (data) {
          return res.json(data);
        } else {
          let verifyCode = Math.floor(Math.random() * 900000) + 100000;

          console.log(verifyCode);

          await redis.set("code", JSON.stringify(verifyCode), "EX", 120);
          await redis.set("generate", JSON.stringify(generate), "EX", 120);
          await redis.set("email", JSON.stringify(email), "EX", 120);
          await redis.set("first_name", JSON.stringify(first_name), "EX", 120);
          await redis.set("last_name", JSON.stringify(last_name), "EX", 120);

          const transporter = nodemailer.createTransport({
            port: 465, // true for 465, false for other ports
            host: "smtp.gmail.com",
            auth: {
              student: "nasirullayevo7@gmail.com",
              pass: "smenmggcgonbqmwl",
            },
            secure: true,
          });
          const mailData = {
            from: "nasirullayevo7@gmail.com",
            to: email,
            subject: "Verification code",
            text: `Verification code`,
            html: `Login code:  <b>${verifyCode}</b><br> Do not give this code to anyone, even if they say they are from our Site<br/>`,
          };
          //   await transporter.sendMail(mailData);

          res.status(200).json({
            message:
              "Successfully verifacation password sent. Please show your email code and You will send me...",
          });
        }
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const checkCode = async (req, res) => {
  try {
    const { code } = req.body;

    const storedCode = await new Promise((resolve, reject) => {
      redis.get("code", (err, data) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(data);
        }
      });
    });

    if (code !== storedCode) {
      return res.status(500).json({ message: "Invalid code" });
    }

    const [generate, email, first_name, last_name] = await Promise.all([
      promisify(redis.get).bind(redis)("generate"),
      promisify(redis.get).bind(redis)("email"),
      promisify(redis.get).bind(redis)("first_name"),
      promisify(redis.get).bind(redis)("last_name"),
    ]);
    const newStudent = await Student.create(
      {
        first_name: JSON.parse(first_name),
        last_name: JSON.parse(last_name),
        email: JSON.parse(email),
        password: JSON.parse(generate),
      },
      { logging: false }
    );

    const token = jwt.sign({ studentId: newStudent.id });
    res.cookie("token", token);

    res.status(201).json({ message: "Student created", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
    console.log(req.body);

  const student = await Student.findAll({where: { email: email}});

  if (student.length < 1) {
    return res
      .status(404)
      .json({ message: "Invalid email or password provided for login" });
  }
  const compare = await compareHash(password, student[0].password);

  if (!compare) {
    return res
      .status(404)
      .json({ message: "Invalid password provided to login" });
  }
  console.log(student[0].id);
  const token = jwt.sign({ studentId: student[0].id });

  res.cookie("token", token);

  res.status(201).json({ message: "Login successful", token: token });
};

const changePassword = async (req, res) => {
  try {
    const { password, newpass, renewpass } = req.body;
    const { token } = req.cookies;
    const decodedToken = jwt.verify(token, jwtSecretKey);
    const studentId = decodedToken.userId;
    
    const student = await Student.findByPk(studentId, { logging: false });
    
    const compare = await compareHash(password, student.password);

    if (!compare) {
      return res.status(404).json({ message: "Invalid password" });
    } else if ( newpass === renewpass) {
      const generate = await generateHash(newpass);
      student.password = generate;
      await student.save({ logging: false });
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
  register,
  login,
  checkCode,
  changePassword,
};
