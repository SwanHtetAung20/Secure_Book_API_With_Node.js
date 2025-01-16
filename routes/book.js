const {
  createBook,
  updateBook,
  deleteBook,
  getAllBooks,
  getSingleBook,
} = require("../controllers/book");
const express = require("express");
const router = express.Router();

router.route("/").get(getAllBooks).post(createBook);
router.route("/:id").get(getSingleBook).patch(updateBook).delete(deleteBook);

module.exports = router;
