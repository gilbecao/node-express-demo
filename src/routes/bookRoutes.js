const express = require('express');

const { MongoClient, ObjectID } = require('mongodb');
const debug = require('debug')('app:bookRoutes');

const bookRouter = express.Router();

const url = 'mongodb://localhost:27017';
const dbName = 'libraryApp';

function router(nav) {
  bookRouter.route('/')
    .get((req, res) => {
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
      }());
    });

  bookRouter.route('/:id')
    .all((req, res, next) => {
      (async function query() {
        const { id } = req.params;
        let client;
        try {
          client = await MongoClient.connect(url);
          debug('Connected correctly to the server');

          const db = client.db(dbName);

          const collection = await db.collection('books');
          const book = await collection.findOne({ _id: ObjectID(id) });

          req.book = book;
          next();
        } catch (error) {
          debug(error);
        }
      }());
    })
    .get((req, res) => {
      res.render('bookView', {
        nav,
        title: 'Library',
        book: req.book
      });
    });

  return bookRouter;
}

module.exports = router;
