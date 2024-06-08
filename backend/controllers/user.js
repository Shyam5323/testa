const Book = require("../models/Book");
const Movie = require("../models/Movie");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const getAllBooks = async (req, res) => {
  try {
    let query = { status: "recommended" };
    const userId = req.user.userId;
    if (!userId) {
      throw new BadRequestError(
        "Username is required when fetching read books."
      );
    }

    query = { status: "read", createdBy: userId };
    const books = await Book.find(query).sort("createdAt");
    res.status(StatusCodes.OK).json({ books, count: books.length });
  } catch (error) {
    throw new BadRequestError(error.message);
  }
};

const getAllMovies = async (req, res) => {
  try {
    let query = { status: "recommended" };
    const userId = req.user.userId;
    if (!userId) {
      throw new BadRequestError(
        "User ID is required when fetching watched movie."
      );
    }
    query = { status: "watched", createdBy: userId };

    const movies = await Movie.find(query).sort("createdAt");
    res.status(StatusCodes.OK).json({ movies, count: movies.length });
  } catch (error) {
    throw new BadRequestError(error.message);
  }
};

const getAllMoviesOther = async (req, res) => {
  try {
    const { id: userId } = req.params;
    const movies = await Movie.find({
      status: "watched",
      createdBy: userId,
    }).sort("createdAt");
    res.status(StatusCodes.OK).json({ movies, count: movies.length });
  } catch (error) {
    throw new BadRequestError(error.message);
  }
};

const getAllBooksOther = async (req, res) => {
  try {
    const { id: userId } = req.params;
    const books = await Book.find({ status: "read", createdBy: userId }).sort(
      "createdAt"
    );
    res.status(StatusCodes.OK).json({ books, count: books.length });
  } catch (error) {
    throw new BadRequestError(error.message);
  }
};

module.exports = {
  getAllBooks,
  getAllMovies,
  getAllBooksOther,
  getAllMoviesOther,
};
