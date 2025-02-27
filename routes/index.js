const router = require("express").Router();
const articles = require("./articles");
const userRouter = require("./users");
const { login, createUser } = require("../controllers/users");

const {
  validateAuthentication,
  validateUserInfo,
} = require("../middlewares/validation");

router.use("/articles", articles);
router.use("/users", userRouter);

router.post("/signin", validateAuthentication, login);
router.post("/signup", validateUserInfo, createUser);

module.exports = router;
