const express = require("express");
const router = express.Router();

const {
  getAllBooks,
  getAllMovies,
  getAllBooksOther,
  getAllMoviesOther,
} = require("../controllers/user");

router.route("/read_books").get(getAllBooks);
router.route("/watched_movies").get(getAllMovies);

router.route("/watched_movies/:id").get(getAllMoviesOther);
router.route("/read_books/:id").get(getAllBooksOther);

module.exports = router;
