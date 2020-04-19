const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan('tiny'));

const db = mongoose.connect('mongodb://localhost/bookAPI');
const Book = require('./models/bookModel');

const bookRouter = express.Router();
bookRouter.route('/books')
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
app.use('/api', bookRouter);

app.get('/', (req, res) => {
    res.send('App works!');
});

app.listen(port, () => {
    debug(`listening on port ${chalk.green(port)}`);
});
