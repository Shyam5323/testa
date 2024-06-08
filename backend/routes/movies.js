const express = require("express");
const router = express.Router();

const {
  createMovie,
  getAllMovies,
  getMovie,
  updateMovie,
  deleteMovie,
  addCommentToMovie,
  getAllCommentsForMovie,
  changeCommentForMovie,
  deleteCommentForMovie,
} = require("../controllers/movie");

router.route("/").post(createMovie).get(getAllMovies);
router.route("/:id").get(getMovie).delete(deleteMovie).patch(updateMovie);

router
  .route("/:movieId/comments")
  .post(addCommentToMovie)
  .get(getAllCommentsForMovie);
router
  .route("/:movieId/comments/:commentId")
  .patch(changeCommentForMovie)
  .delete(deleteCommentForMovie);

module.exports = router;
