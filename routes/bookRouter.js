const express = require('express');

function router(Book) {
    const bookRouter = express.Router();

    bookRouter.route('/books')
        .post((req, res) => {
            const book = new Book(req.body);
            book.save();
            return res.status(201).json(book);
        })
        .get((req, res) => {
            const query = {};
            if (req.query.genre) {
                query.genre = req.query.genre;
            }
            Book.find(query, (error, books) => {
                if (error) {
                    return res.send(error);
                }
                return res.send(books);
            });
        });

    bookRouter.route('/books/:bookId')
        .get((req, res) => {
            const { bookId } = req.params;
            Book.findById(bookId, (error, book) => {
                if (error) {
                    return res.send(error);
                }
                return res.send(book);
            });
        });

    return bookRouter;
}

module.exports = router;
