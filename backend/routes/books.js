const express = require("express");
const router = express.Router();

const {
  createBook,
  getAllBooks,
  getBook,
  updateBook,
  deleteBook,
  addCommentToBook,
  getAllCommentsForBook,
  changeCommentForBook,
  deleteCommentForBook,
} = require("../controllers/book");

router.route("/").post(createBook).get(getAllBooks);
router.route("/:id").get(getBook).delete(deleteBook).patch(updateBook);
router
  .route("/:bookId/comments")
  .post(addCommentToBook)
  .get(getAllCommentsForBook);
router
  .route("/:bookId/comments/:commentId")
  .patch(changeCommentForBook)
  .delete(deleteCommentForBook);

module.exports = router;
