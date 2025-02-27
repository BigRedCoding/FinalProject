const router = require("express").Router();

const auth = require("../middlewares/auth");

const {
  getArticlesByLikes,
  getArticlesByFavorite,
  checkAndAddArticleWithLikes,
  checkAndAddArticleWithFavorite,
  checkAndRemoveArticleByLikes,
  checkAndRemoveArticleByFavorites,
} = require("../controllers/articles");

router.post("/articles-with-likes", auth, checkAndAddArticleWithLikes);
router.post("/articles-with-favorites", auth, checkAndAddArticleWithFavorite);

router.get("/get-by-likes", getArticlesByLikes);
router.get("/get-by-favorite", auth, getArticlesByFavorite);

router.delete("/articles-with-likes", auth, checkAndRemoveArticleByLikes);
router.delete(
  "/articles-with-favorite",
  auth,
  checkAndRemoveArticleByFavorites
);

module.exports = router;
