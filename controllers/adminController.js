const db = require("../dbconfig");
const { isEmail, isEmpty } = require("validator");
const Knex = require("knex");
const nodemailer = require("nodemailer");

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
    res.json(users.filter((user) => user.email != "support@zahamax.com"));
  } catch (err) {
    // console.log("errrg", err);
  }
};

const withdrwal = async (req, res) => {
  const users = await db("users");
  res.json(
    users.filter(
      (user) => user.pdgwdl > 0 && user.name != "support@zahamax.com"
    )
  );
};

const deposited = async (req, res) => {
  const users = await db("users");
  res.json(
    users.filter((user) => user.depos > 0 && user.name != "ad@test.com")
  );
};

const approve = async (req, res) => {
  const { email, depos } = req.body;
  try {
    const user = await db("users").where({ email });
    const done = await db("users").where({ email }).update({ depos: 0 });
    const accbal = parseInt(user[0].accbal) + parseInt(depos);
    await db("users").where({ email }).update({ accbal });
    let msg = `Your deposit of ${depos}USD has been approved. Login to access your profile. 
For further assistance, you can reach out to support.\n

\nRegards, 
\nZaha Technologies`;
    let html = `Your deposit of ${depos}USD has been approved. Login to access your profile. 
For further assistance, you can reach out to support.\n

<div style="padding-top:70px">Regards,<div/>
<div>Zaha Technologies<div/>`;
    sendMailx(msg, email, "Update on deposit status.", html);
    res.json({ done });
  } catch (err) {
    console.log("approve er", err);
    res.json({ err: "cant approve deposit at this time" });
  }
};

const wapprove = async (req, res) => {
  const { email, pdgwdl } = req.body;
  try {
    const user = await db("users").where({ email });
    const done = await db("users").where({ email }).update({ pdgwdl: 0 });
    const accbal = parseInt(user[0].accbal) - parseInt(pdgwdl);
    await db("users").where({ email }).update({ accbal });
    let msg = `Your withdrawal of ${pdgwdl}USD has been approved. Login to access your profile. 
For further assistance, you can reach out to support.\n

\nRegards, 
\nZaha Technologies`;
    let html = `Your withdrawal of${pdgwdl}USD has been approved. Login to access your profile. 
For further assistance, you can reach out to support.\n

<div style="padding-top:70px">Regards,<div/>
<div>Zaha Technologies<div/>`;
    sendMailx(msg, email, "Update on withdrawal status.", html);
    res.json({ done });
  } catch (err) {
    console.log("approve er", err);
    res.json({ err: "cant approve deposit at this time" });
  }
};

const decline = async (req, res) => {
  const { email, depos } = req.body;
  try {
    const done = await db("users").where({ email }).update({ depos: 0 });
    let msg = `Your deposit of ${depos}USD has been declined. Login to access your profile. 
For further assistance, you can reach out to support.\n

\nRegards, 
\nZaha Technologies`;
    let html = `Your deposit of ${depos}USD has been declined. Login to access your profile. 
For further assistance, you can reach out to support.\n

<div style="padding-top:70px">Regards,<div/>
<div>Zaha Technologies<div/>`;
    sendMailx(msg, email, "Update on deposit status.", html);
    res.json({ done });
    h;
  } catch (err) {
    res.json({ err: "cant approve deposit at this time" });
  }
};

const wdecline = async (req, res) => {
  const { email, pdgwdl } = req.body;
  try {
    const done = await db("users").where({ email }).update({ pdgwdl: 0 });
    let msg = `Your withdrawal of ${pdgwdl}USD has been declined. Login to access your profile. 
For further assistance, you can reach out to support.\n

\nRegards, 
\nZaha Technologies`;
    let html = `Your withdrawal of ${pdgwdl}USD has been declined. Login to access your profile. 
For further assistance, you can reach out to support.\n

<div style="padding-top:70px">Regards,<div/>
<div>Zaha Technologies<div/>`;
    sendMailx(msg, email, "Update on withdrawal status.", html);
    res.json({ done });
    h;
  } catch (err) {
    res.json({ err: "cant approve deposit at this time" });
  }
};

const deleted = async (req, res) => {
  const { email } = req.body;
  try {
    const done = await db("users").where({ email }).update({ depos: 0 });
    let msg = ``;
    res.json({ done });
  } catch (err) {
    res.json({ err: "cant approve deposit at this time" });
  }
};

const wdeleted = async (req, res) => {
  const { email } = req.body;
  try {
    const done = await db("users").where({ email }).update({ pdgwdl: 0 });
    let msg = ``;
    res.json({ done });
  } catch (err) {
    res.json({ err: "cant approve deposit at this time" });
  }
};

const editUser = async (req, res) => {
  const {
    email,
    accbal,
    admin,
    pend,
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
    active,
    ref,
    aref,
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
        pend,
        // joined,
        lastdepos,
        lastwdl,
        // // login,
        // name,
        pdgwdl,
        totalwdl,
        username,
        wallet,
        active,
        ref,
        aref,
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

const sendMailx = async (output, email, s, h) => {
  try {
    let transporter = nodemailer.createTransport({
      host: "zahamax.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: "support@zahamax.com",
        pass: "subdomainsupport", // generated ethereal password
      },
    });

    let info = await transporter.sendMail({
      from: '"Zaha" <support@zahamax.com>', // sender address
      to: email, // list of receivers
      subject: s, // Subject line
      text: output, // plain text body
      html: h, // html body
    });
  } catch (err) {
    console.log(err);
  }
};
module.exports = {
  allUsers,
  editUser,
  del,
  withdrwal,
  address,
  getAddress,
  deposited,
  approve,
  decline,
  deleted,
  wapprove,
  wdecline,
  wdeleted,
};
