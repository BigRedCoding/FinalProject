const articles = require("../models/articles.js");
const HttpError = require("../utils/errors");

const addArticle = (req, res, next) => {
  const {
    author,
    title,
    description,
    imageUrl,
    url,
    source,
    date,
    favorites,
    likes,
  } = req.body;

  articles
    .create({
      author,
      title,
      description,
      imageUrl,
      url,
      source,
      date,
      favorites,
      likes,
    })
    .then(() => {
      res.status(201).send({ message: "article added successfully" });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(
          HttpError.BadRequestError("Articles schema validation error")
        );
      }
      return next(HttpError.ServerError());
    });
};

const getArticlesByLikes = (req, res, next) => {
  articles
    .find({ "likes.0": { $exists: true } })
    .then((foundArticles) => {
      if (foundArticles.length === 0) {
        return res.status(200).send({ data: [] });
      }

      res.status(200).send({ data: foundArticles });
    })
    .catch(() => next(HttpError.ServerError()));
};

const getArticlesByFavorite = (req, res, next) => {
  articles
    .find({ favorites: req.user._id })
    .then((articles) => {
      res.status(200).send({ data: articles });
    })
    .catch(() => {
      if (!articles || articles.length === 0) {
        return next(HttpError.NotFoundError("No articles found for this user"));
      }
      return next(
        HttpError.ServerError("An error occurred while retrieving articles")
      );
    });
};

const checkAndAddArticleWithLikes = (req, res, next) => {
  const { author, title, imageUrl, url, source, date } = req.body;

  articles
    .findOne({ author, title, imageUrl, url, source, date })
    .then((existingArticle) => {
      if (existingArticle) {
        if (existingArticle.likes.includes(req.user._id)) {
          return;
        }
        existingArticle.likes.push(req.user._id);
        return existingArticle.save().then((updatedArticle) => {
          res.status(200).send({ data: updatedArticle });
        });
      }
      if (!existingArticle) {
        let {
          author,
          title,
          description,
          imageUrl,
          url,
          source,
          date,
          favorites = [],
          likes = [],
        } = req.body;

        likes = [req.user._id];

        req.body = {
          author,
          title,
          description,
          imageUrl,
          url,
          source,
          date,
          favorites,
          likes,
        };
        return addArticle(req, res, next);
      }
    })
    .catch(() => {
      let {
        author,
        title,
        description,
        imageUrl,
        url,
        source,
        date,
        favorites = [],
        likes = [],
      } = req.body;

      likes = [req.user._id];

      req.body = {
        author,
        title,
        description,
        imageUrl,
        url,
        source,
        date,
        favorites,
        likes,
      };

      return addArticle(req, res, next);
    });
};

const checkAndAddArticleWithFavorite = (req, res, next) => {
  const { author, title, imageUrl, url, source, date } = req.body;

  articles
    .findOne({ author, title, imageUrl, url, source, date })
    .then((existingArticle) => {
      if (existingArticle) {
        if (existingArticle.favorites.includes(req.user._id)) {
          return;
        }
        existingArticle.favorites.push(req.user._id);
        return existingArticle.save().then((updatedArticle) => {
          res.status(200).send({ data: updatedArticle });
        });
      }
      if (!existingArticle) {
        let {
          author,
          title,
          description,
          imageUrl,
          url,
          source,
          date,
          favorites = [],
          likes = [],
        } = req.body;

        favorites = [req.user._id];

        req.body = {
          author,
          title,
          description,
          imageUrl,
          url,
          source,
          date,
          favorites,
          likes,
        };
        return addArticle(req, res, next);
      }
    })
    .catch(() => {
      let {
        author,
        title,
        description,
        imageUrl,
        url,
        source,
        date,
        favorites = [],
        likes = [],
      } = req.body;

      favorites = [req.user._id];

      req.body = {
        author,
        title,
        description,
        imageUrl,
        url,
        source,
        date,
        favorites,
        likes,
      };

      return addArticle(req, res, next);
    });
};

const checkAndRemoveArticleByLikes = (req, res, next) => {
  const { author, title, imageUrl, url, source, date } = req.body;

  articles
    .findOne({ author, title, imageUrl, url, source, date })
    .then((existingArticle) => {
      if (existingArticle) {
        const articleID = existingArticle._id;

        if (existingArticle.likes.includes(req.user._id)) {
          existingArticle.likes.pull(req.user._id);

          if (
            existingArticle.favorites.length < 1 &&
            existingArticle.likes.length < 1
          ) {
            return articles.findByIdAndDelete(articleID).then(() => {
              res.status(200).send({
                shouldDelete: true,
                message: "Article successfully removed",
              });
            });
          }

          return existingArticle.save().then((updatedArticle) => {
            res.status(200).send({
              shouldDelete: false,
              data: updatedArticle,
              message: "Article like removed",
            });
          });
        } else {
          res.status(400).send({ message: "User has not liked this article" });
        }
      } else {
        next(HttpError.NotFoundError("Article not found"));
      }
    })
    .catch(next);
};

const checkAndRemoveArticleByFavorites = (req, res, next) => {
  const { author, title, imageUrl, url, source, date } = req.body;

  articles
    .findOne({ author, title, imageUrl, url, source, date })
    .then((existingArticle) => {
      if (existingArticle) {
        const articleID = existingArticle._id;

        if (existingArticle.favorites.includes(req.user._id)) {
          existingArticle.favorites.pull(req.user._id);

          if (
            existingArticle.favorites.length < 1 &&
            existingArticle.likes.length < 1
          ) {
            return articles.findByIdAndDelete(articleID).then(() => {
              res.status(200).send({
                shouldDelete: true,
                message: "Article successfully removed",
              });
            });
          }

          return existingArticle.save().then((updatedArticle) => {
            res.status(200).send({
              shouldDelete: false,
              data: updatedArticle,
              message: "Article like removed",
            });
          });
        } else {
          res.status(400).send({ message: "User has not liked this article" });
        }
      } else {
        next(HttpError.NotFoundError("Article not found"));
      }
    })
    .catch(next);
};

module.exports = {
  getArticlesByLikes,
  getArticlesByFavorite,
  checkAndAddArticleWithLikes,
  checkAndAddArticleWithFavorite,
  checkAndRemoveArticleByLikes,
  checkAndRemoveArticleByFavorites,
};
