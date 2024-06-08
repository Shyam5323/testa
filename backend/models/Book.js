const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    index: true,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  genre: String,
  description: String,
  recommendedBy: String,
  status: {
    type: String,
    index: true,
    enum: ["recommended", "read"],
    default: "recommended",
  },
  whereToRead: String,
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
bookSchema.index({ title: 1, status: 1 }, { unique: true });

const Book = mongoose.model("Book", bookSchema);
Book.createIndexes();

module.exports = Book;
