const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan('tiny'));

const bookRouter = express.Router();
bookRouter.route('/books')
    .get((req, res) => {
        const response = { hello: 'This is my API' };

        res.json(response);
    });

app.use('/api', bookRouter);

app.get('/', (req, res) => {
    res.send('App works!');
});

app.listen(port, () => {
    debug(`listening on port ${chalk.green(port)}`);
});
