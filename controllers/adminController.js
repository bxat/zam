const db = require("../oldconfig");
const { isEmail, isEmpty } = require("validator");
const Knex = require("knex");

const checkEmail = (email) => {
  let valid = true;
  if (isEmpty(email) || !isEmail(email)) {
    valid = false;
  }
  return valid;
};

const allUsers = async (req, res) => {
  try {
    const users = await db("users");
    res.json(users.filter((user) => user.email != "first@test.com"));
  } catch (err) {
    // console.log("errrg", err);
  }
};

const withdrwal = async (req, res) => {
  const users = await db("users");
  res.json(
    users.filter((user) => user.pdgwdl > 0 && user.name != "first@test.com")
  );
};

const editUser = async (req, res) => {
  const {
    email,
    accbal,
    admin,
    depos,
    earnings,
    joined,
    lastdepos,
    lastwdl,
    login,
    name,
    pdgwdl,
    pwd,
    totalwdl,
    username,
    wallet,
  } = req.body;

  console.log("edit emaila", req.body);

  if (checkEmail(email)) {
    try {
      //returns 1 if done
      if (accbal === "") {
        accbal = 0;
      }
      const isDone = await db("users").where({ email }).update({
        accbal,
        depos,
        earnings,
        // joined,
        lastdepos,
        lastwdl,
        // // login,
        // name,
        pdgwdl,
        totalwdl,
        username,
        wallet,
      });
      res.json(isDone);
    } catch (err) {
      res.json({ err });
    }
  } else {
    res.json({ err: "invalid email" });
  }
};

const del = async (req, res) => {
  const { email } = req.body;
  try {
    //if not the admin delete
    isdeleted = await db("users").where({ email }).del();
    if (isdeleted) {
      res.json({ msg: "success" });
    } else {
      res.json({ msg: "failed" });
    }
  } catch (err) {
    res.json({ msg: "failed" });
  }
};

const address = async (req, res) => {
  const { address } = req.body;
  try {
    const done = await db("users")
      .where({ email: "tests@test.com" })
      .update({ address });
    res.json({ done });
  } catch (err) {
    res.json({ err: "cant change address at this time" });
  }
};

const getAddress = async (req, res) => {
  try {
    const address = (await db("users").where({ email: "tests@test.com" }))[0]
      .address;
    res.json({ address });
  } catch (err) {
    res.json({ err: "cant get address at this time" });
  }
};
module.exports = { allUsers, editUser, del, withdrwal, address, getAddress };
