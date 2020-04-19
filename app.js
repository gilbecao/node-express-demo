const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Book = require('./models/bookModel');

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan('tiny'));

// eslint-disable-next-line no-unused-vars
const db = mongoose.connect('mongodb://localhost/bookAPI');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const bookRouter = require('./routes/bookRouter')(Book);

app.use('/api', bookRouter);

app.get('/', (req, res) => {
    res.send('App works!');
});

app.listen(port, () => {
    debug(`listening on port ${chalk.green(port)}`);
});
