const Movie = require("../models/Movie");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
} = require("../errors");

const createMovie = async (req, res) => {
  const {
    title,
    director,
    genre,
    description,
    recommendedBy,
    whereToWatch,
    status,
  } = req.body;
  const createdBy = req.user.userId;
  const newMovie = new Movie({
    title,
    director,
    genre,
    description,
    recommendedBy,
    whereToWatch,
    createdBy,
    status,
  });
  await newMovie.save();
  res.status(StatusCodes.CREATED).json(newMovie);
};
const getAllMovies = async (req, res) => {
  const Movies = await Movie.find({
    status: "recommended",
  }).sort("createdAt");
  res.status(StatusCodes.OK).json({ Movies, count: Movies.length });
};
const getMovie = async (req, res) => {
  const {
    params: { id: MovieId },
  } = req;
  const movie = await Movie.findOne({
    _id: MovieId,
  });
  if (!movie) {
    throw NotFoundError("Movie Not Found");
  }
  res.status(StatusCodes.OK).json({ movie });
};
const updateMovie = async (req, res) => {
  try {
    const {
      params: { id: MovieId },
      body: { title, author, genre, description, recommendedBy, whereToRead },
    } = req;

    const updatedMovie = await Movie.findByIdAndUpdate(
      MovieId,
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

    if (!updatedMovie) {
      throw new NotFoundError("Movie Not Found");
    }

    res.status(StatusCodes.OK).json({ Movie: updatedMovie });
  } catch (error) {
    throw new BadRequestError(error.message);
  }
};

const deleteMovie = async (req, res) => {
  try {
    const {
      params: { id: movieId },
    } = req;

    const deletedMovie = await Movie.findByIdAndDelete(movieId);

    if (!deletedMovie) {
      throw new NotFoundError("Movie Not Found");
    }

    res.status(StatusCodes.OK).json({ message: "Movie deleted successfully" });
  } catch (error) {
    throw new BadRequestError(error.message);
  }
};

//Comments
const addCommentToMovie = async (req, res) => {
  try {
    const { movieId } = req.params;
    const { text } = req.body;
    const userId = req.user.userId;

    const movie = await Movie.findById(movieId);
    if (!movie) {
      throw new NotFoundError("Movie not found");
    }

    movie.comments.push({ text, author: userId });
    await movie.save();

    res.status(StatusCodes.CREATED).json(movie.comments);
  } catch (error) {
    throw new BadRequestError(error.message);
  }
};

const getAllCommentsForMovie = async (req, res) => {
  const { movieId } = req.params;

  const movie = await Movie.findById(movieId);
  if (!movie) {
    throw new NotFoundError("Movie not found");
  }

  res.status(StatusCodes.OK).json(movie.comments);
};

const changeCommentForMovie = async (req, res) => {
  const { movieId, commentId } = req.params;
  const { text } = req.body;

  const movie = await Movie.findById(movieId);
  if (!movie) {
    throw new NotFoundError("Movie not found");
  }

  const comment = movie.comments.find(
    (comment) => comment._id.toString() === commentId
  );

  if (!comment) {
    throw new NotFoundError("Comment not found");
  }

  comment.text = text;
  await movie.save();

  res.status(StatusCodes.OK).json(comment);
};

const deleteCommentForMovie = async (req, res) => {
  try {
    const { movieId, commentId } = req.params;

    const movie = await Movie.findById(movieId);
    if (!movie) {
      throw new NotFoundError("Movie not found");
    }

    const commentIndex = movie.comments.findIndex(
      (comment) => comment._id.toString() === commentId
    );
    if (commentIndex === -1) {
      throw new NotFoundError("Comment not found");
    }

    movie.comments.splice(commentIndex, 1);
    await movie.save();

    res.status(StatusCodes.NO_CONTENT).send("Deleted Success");
  } catch (error) {
    throw new BadRequestError(error.message);
  }
};

module.exports = {
  createMovie,
  getAllMovies,
  getMovie,
  updateMovie,
  deleteMovie,
  addCommentToMovie,
  getAllCommentsForMovie,
  changeCommentForMovie,
  deleteCommentForMovie,
};
