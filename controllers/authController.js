const db = require("../dbconfig");
const { isEmail, isEmpty } = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const checkEmail = (email) => {
  let valid = true;
  if (isEmpty(email) || !isEmail(email)) {
    valid = false;
  }
  return valid;
};

const handleErrors = (err) => {
  if (err.code === "23505") return "User already exist";
};

const checkUserDetails = (details) => {
  let message = { email: "", name: "", password: "" };
  if (!isEmail(details.email)) {
    if (isEmpty(details.email)) {
      message.email = "Email cannot be empty";
    } else {
      message.email = `${details.email} is not a valid email`;
    }
  }
  if (isEmpty(details.name)) message.name = `Name cannot be empty`;
  if (isEmpty(details.password)) message.password = `Password cannot be empty`;
  return message;
};

const maxAge = 3 * 24 * 60 * 60;
const createToken = (obj) => {
  //returns a token with a signature and headers are automatically applied
  return jwt.sign(obj, "been working since the jump", {
    expiresIn: maxAge,
  });
};
module.exports.signup = (req, res) => {
  const { name, user, email, password, num } = req.body;
  console.log("req body", req.body);
  const msg = checkUserDetails({ name, email, password });
  if (msg.name !== "" || msg.email !== "" || msg.password !== "") {
    res.status(400).json({ msg });
  } else {
    bcrypt
      .hash(password, saltRounds)
      .then((hash) => {
        console.log("hash", hash);
        db("users")
          .returning("*")
          .insert({
            email,
            username: user,
            name,
            pwd: hash,
            joined: new Date(),
            login: new Date(),
            accbal: 0,
            depos: 0,
            lastdepos: 0,
            earnings: 0,
            pdgwdl: 0,
            admin: 0,
            lastwdl: 0,
            active: 0,
            pend: 0,
            num: "",
            ref: 0,
            aref: 0,
          })
          .then((user) => {
            console.log("user", user);
            const token = createToken({ email, admin: false });
            //httpOnly: we can access it from the console (via js)
            // res.cookie('jwt',token, {httpOnly: true, maxAge: maxAge * 1000})
            res.status(201).json({ email, token });
          })
          .catch((err) => {
            console.log(err);
            res.json({ exists: handleErrors(err) });
          }); //db
      })
      .catch(console.log);
  }
};

module.exports.user = async (req, res) => {
  const { email } = req.body;
  const users = await db.select("*").from("users").where({ email });
  const user = { ...users[0], pwd: "" };
  res.json(user);
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  const msg = checkUserDetails({ name: "", email, password });
  if (msg.email !== "" || msg.password !== "") {
    res.status(400).json({ msg });
  } else {
    //look for user with email in db

    db.select("*")
      .from("users")
      .where({ email })
      .then(async (user) => {
        if (user.length === 0) {
          res.status(400).json({ error: "Incorrect email or password" });
        } else {
          //compare

          const match = await bcrypt.compare(password, user[0].pwd);
          if (match) {
            const token = createToken({
              email: user[0].email,
              admin: user[0].admin,
            });

            db.select("*")
              .from("users")
              .where({ email })
              .update({
                login: new Date(),
              })
              .then((res) => console.log(res));
            // res.cookie('jwt',token, {httpOnly: true, maxAge: maxAge * 1000})
            res.status(201).json({ token, email, admin: user[0].admin });
            //create a jwt and send that as response in a cookie
          } else {
            res.status(400).json({ error: "Incorect email or password" });
          }
        }
      })
      .catch((err) => {
        res.status(400).json({ error: "Cannot login at this time" });
      });
  }
};

module.exports.logout = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.json("logout");
};

module.exports.withdraw = async (req, res) => {
  const { email, pdgwdl, add } = req.body;

  if (checkEmail(email)) {
    try {
      //returns 1 if done
      const isDone = await db("users")
        .where({ email })
        .update({ pdgwdl, wallet: add });
      res.json(isDone);
    } catch (err) {
      res.json({ err: "try again later?" });
    }
  } else {
    res.json({ err: "invalid email" });
  }
};

module.exports.deposit = async (req, res) => {
  const { email, depos } = req.body;

  if (checkEmail(email)) {
    try {
      //returns 1 if done
      const isDone = await db("users").where({ email }).update({ depos });
      res.json(isDone);
    } catch (err) {
      res.json({ err: "try again later?" });
    }
  } else {
    res.json({ err: "invalid email" });
  }
};

module.exports.purchase = async (req, res) => {
  const { email, purchase } = req.body;
  console.log("email, pur", email, purchase);
  try {
    //returns 1 if done
    const user = await db("users").where({ email });

    const active = parseInt(user[0].active) + parseInt(purchase);
    const accbal = parseInt(user[0].accbal) - parseInt(purchase);
    console.log("here", active, accbal);
    const isDone = await db("users")
      .where({ email })
      .update({ active, accbal });
    res.json(isDone);
  } catch (err) {
    res.json({ err });
  }
};

module.exports.profile = async (req, res) => {
  const { email, name, wallet } = req.body;

  if (checkEmail(email)) {
    try {
      //returns 1 if done
      const isDone = await db("users")
        .where({ email })
        .update({ name, wallet });
      res.json(isDone);
    } catch (err) {
      res.json({ err });
    }
  } else {
    res.json({ err: "invalid email" });
  }
};
