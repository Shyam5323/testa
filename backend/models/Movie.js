const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  director: String,
  genre: String,
  description: String,
  recommendedBy: String,
  status: {
    type: String,
    enum: ["recommended", "watched"],
    default: "recommended",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  comments: [
    {
      text: String,
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

movieSchema.index({ title: 1, status: 1 }, { unique: true });

const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;
