const express = require('express');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:adminRoutes');

const adminRouter = express.Router();

const books = [
    {
        title: 'El heredero',
        genre: 'Novela',
        author: 'Rafael Tarradas Bultó',
        read: false
    },
    {
        title: 'El largo camino a casa',
        genre: 'Ficción',
        author: 'Alan Hlad',
        read: true
    },
    {
        title: 'El mapa de los afectos',
        genre: 'Cuentos',
        author: 'Ana Merino',
        read: false
    },
    {
        title: 'Y Julia retó a los dioses',
        genre: 'Novela',
        author: 'Santiago Posteguillo',
        read: false
    },
];

function router() {
    adminRouter.route('/')
        .get((req, res) => {
            const url = 'mongodb://localhost:27017';
            const dbName = 'libraryApp';

            (async function mongo() {
                let client;
                try {
                    client = await MongoClient.connect(url);
                    debug('Connected correctly to the server');

                    const db = client.db(dbName);

                    const response = await db.collection('books').insertMany(books);
                    res.json(response);
                } catch (error) {
                    debug(error);
                }

                client.close();
            }());
        });

    return adminRouter;
}

module.exports = router;
