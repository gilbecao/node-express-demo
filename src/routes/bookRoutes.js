const express = require('express');

const bookRouter = express.Router();
const sql = require('mssql');

function router(nav) {
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

  bookRouter.route('/')
    .get((req, res) => {
      (async function query() {
        const request = new sql.Request();
        const { recordset } = await request.query('select * from books');

        res.render('bookListView', {
          nav,
          title: 'Library',
          books: recordset
        });
      }());
    });

  bookRouter.route('/:id')
    .all((req, res, next) => {
      (async function query() {
        const { id } = req.params;
        const request = new sql.Request();
        const { recordset } = await request.input('id', sql.Int, id)
          .query('select * from books where id = @id');
        [req.book] = recordset;
        next();
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
