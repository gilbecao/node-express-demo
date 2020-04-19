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

    bookRouter.use('/books/:bookId', (req, res, next) => {
        const { bookId } = req.params;
        Book.findById(bookId, (error, book) => {
            if (error) {
                return res.send(error);
            }
            if (book) {
                req.book = book;
                return next();
            }
            return res.sendStatus(404);
        });
    });
    bookRouter.route('/books/:bookId')
        .get((req, res) => res.send(req.book))
        .put((req, res) => {
            const { book } = req;
            book.title = req.body.title;
            book.author = req.body.author;
            book.genre = req.body.genre;
            book.read = req.body.rea;

            req.book.save((error) => {
                if (error) {
                    return res.send(error);
                }
                return res.send(book);
            });
        })
        .patch((req, res) => {
            const { book } = req;

            /* eslint-disable no-underscore-dangle */
            if (req.body._id) {
                delete req.body._id;
            }
            /* eslint-enable no-underscore-dangle */

            Object.entries(req.body).forEach((item) => {
                const key = item[0];
                const value = item[1];
                book[key] = value;
            });

            req.book.save((error) => {
                if (error) {
                    return res.send(error);
                }
                return res.send(book);
            });
        });

    return bookRouter;
}

module.exports = router;
