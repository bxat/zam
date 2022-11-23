const { Router } = require("express");
const router = Router();
const {
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
} = require("../controllers/adminController");
const { requireA } = require("../middleware/AdminMiddleware");

// router.use(requireA)
router.post("/all", requireA, allUsers);

router.post("/withdrawal", requireA, withdrwal);
router.post("/deposited", requireA, deposited);
router.post("/approve", approve);
router.post("/decline", decline);
router.post("/deleted", deleted);
router.post("/wapprove", wapprove);
router.post("/wdecline", wdecline);
router.post("/wdeleted", wdeleted);
router.post("/delete", del);
router.post("/editUser", editUser);

router.post("/delete", del);

router.post("/address", address);

router.get("/getAddress", getAddress);
// router.post("/mailto", sendMailx);

module.exports = router;
