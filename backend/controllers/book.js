const Book = require("../models/Book");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
} = require("../errors");

const createBook = async (req, res) => {
  const {
    title,
    author,
    genre,
    description,
    recommendedBy,
    whereToRead,
    status,
  } = req.body;
  const createdBy = req.user.userId;
  if (!createdBy) {
    throw new BadRequestError("No username");
  }
  const newBook = new Book({
    title,
    author,
    genre,
    description,
    status,
    recommendedBy,
    whereToRead,
    createdBy,
  });
  await newBook.save();
  res.status(StatusCodes.CREATED).json(newBook);
};
const getAllBooks = async (req, res) => {
  const books = await Book.find({
    status: "recommended",
  }).sort("createdAt");
  res.status(StatusCodes.OK).json({ books, count: books.length });
};
const getBook = async (req, res) => {
  const {
    params: { id: bookId },
  } = req;
  const book = await Book.findOne({
    _id: bookId,
  });
  if (!book) {
    throw NotFoundError("Book Not Found");
  }
  res.status(StatusCodes.OK).json({ book });
};
const updateBook = async (req, res) => {
  try {
    const {
      params: { id: bookId },
      body: { title, author, genre, description, recommendedBy, whereToRead },
    } = req;

    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      {
        title,
        author,
        genre,
        description,
        recommendedBy,
        whereToRead,
      },
      { new: true }
    );

    if (!updatedBook) {
      throw new NotFoundError("Book Not Found");
    }

    res.status(StatusCodes.OK).json({ book: updatedBook });
  } catch (error) {
    throw new BadRequestError(error.message);
  }
};

const deleteBook = async (req, res) => {
  try {
    const {
      params: { id: bookId },
    } = req;

    const deletedBook = await Book.findByIdAndDelete(bookId);

    if (!deletedBook) {
      throw new NotFoundError("Book Not Found");
    }

    res.status(StatusCodes.OK).json({ message: "Book deleted successfully" });
  } catch (error) {
    throw new BadRequestError(error.message);
  }
};

//Comments
const addCommentToBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { text } = req.body;
    const userId = req.user.userId;

    const book = await Book.findById(bookId);
    if (!book) {
      throw new NotFoundError("Book not found");
    }

    book.comments.push({ text, author: userId });
    await book.save();

    res.status(StatusCodes.CREATED).json(book.comments);
  } catch (error) {
    throw new BadRequestError(error.message);
  }
};

const getAllCommentsForBook = async (req, res) => {
  const { bookId } = req.params;

  const book = await Book.findById(bookId);
  if (!book) {
    throw new NotFoundError("Book not found");
  }

  res.status(StatusCodes.OK).json(book.comments);
};

const changeCommentForBook = async (req, res) => {
  const { bookId, commentId } = req.params;
  const { text } = req.body;

  const book = await Book.findById(bookId);
  if (!book) {
    throw new NotFoundError("Book not found");
  }

  const comment = book.comments.find(
    (comment) => comment._id.toString() === commentId
  );

  if (!comment) {
    throw new NotFoundError("Comment not found");
  }

  comment.text = text;
  await book.save();

  res.status(StatusCodes.OK).json(comment);
};

const deleteCommentForBook = async (req, res) => {
  try {
    const { bookId, commentId } = req.params;

    const book = await Book.findById(bookId);
    if (!book) {
      throw new NotFoundError("Book not found");
    }

    const commentIndex = book.comments.findIndex(
      (comment) => comment._id.toString() === commentId
    );
    if (commentIndex === -1) {
      throw new NotFoundError("Comment not found");
    }

    book.comments.splice(commentIndex, 1);
    await book.save();

    res.status(StatusCodes.NO_CONTENT).send("Deleted Success");
  } catch (error) {
    throw new BadRequestError(error.message);
  }
};

module.exports = {
  createBook,
  getAllBooks,
  getBook,
  updateBook,
  deleteBook,
  getAllCommentsForBook,
  deleteCommentForBook,
  changeCommentForBook,
  addCommentToBook,
};
