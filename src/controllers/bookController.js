const { MongoClient, ObjectID } = require('mongodb');
const debug = require('debug')('app:bookController');

const url = 'mongodb://localhost:27017';
const dbName = 'libraryApp';

function bookController(bookService, nav) {
    function getIndex(req, res) {
        (async function query() {
            let client;
            try {
                client = await MongoClient.connect(url);
                debug('Connected correctly to the server');

                const db = client.db(dbName);

                const collection = await db.collection('books');
                const books = await collection.find().toArray();

                res.render('bookListView', {
                    nav,
                    title: 'Library',
                    books
                });
            } catch (error) {
                debug(error);
            }

            client.close();
        }());
    }

    function getById(req, res) {
        (async function query() {
            const { id } = req.params;
            let client;
            try {
                client = await MongoClient.connect(url);
                debug('Connected correctly to the server');

                const db = client.db(dbName);

                const collection = await db.collection('books');
                const book = await collection.findOne({ _id: ObjectID(id) });

                book.details = await bookService.getBookById(book.bookId);

                res.render('bookView', {
                    nav,
                    title: 'Library',
                    book
                });
            } catch (error) {
                debug(error);
            }

            client.close();
        }());
    }

    function middleware(req, res, next) {
        if (req.user) {
            next();
        } else {
            res.redirect('/');
        }
    }

    return {
        getIndex,
        getById,
        middleware
    };
}

module.exports = bookController;
