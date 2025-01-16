const Book = require("../models/Book");
const { BadRequest, NotFound } = require("../errors");
const { StatusCodes } = require("http-status-codes");

const createBook = async (req, res) => {
  req.body.createdBy = req.user.userId;

  const book = await Book.create({ ...req.body });
  res.status(StatusCodes.CREATED).json({ book });
};

const getAllBooks = async (req, res) => {
  const books = await Book.find({ createdBy: req.user.userId }).sort(
    "createdAt"
  );
  res.status(StatusCodes.OK).json({ count: books.length, books });
};

const getSingleBook = async (req, res) => {
  const {
    user: { userId },
    params: { id: bookId },
  } = req;
  const book = await Book.findOne({ _id: bookId, createdBy: userId });
  if (!book) {
    throw new NotFound(`No book with id : ${bookId}`);
  }
  res.status(StatusCodes.OK).json({ book });
};

const updateBook = async (req, res) => {
  const {
    user: { userId },
    params: { id: bookId },
  } = req;
  const book = await Book.findOneAndUpdate(
    { _id: bookId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!book) {
    throw new NotFound(`No book with id : ${bookId}`);
  }

  res.status(StatusCodes.OK).json({ book });
};

const deleteBook = async (req, res) => {
  const {
    user: { userId },
    params: { id: bookId },
  } = req;
  const book = await Book.findOneAndDelete({ _id: bookId, createdBy: userId });
  if (!book) {
    throw new NotFound(`No book with id : ${bookId}`);
  }
  res.status(StatusCodes.OK).json({ msg: "successfully deleted.!" });
};

module.exports = {
  createBook,
  updateBook,
  getAllBooks,
  getSingleBook,
  deleteBook,
};
