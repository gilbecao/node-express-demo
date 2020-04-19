const passport = require('passport');
const { MongoClient } = require('mongodb');
const { Strategy } = require('passport-local');
const debug = require('debug')('app:local.strategy');

module.exports = function localStrategy() {
    passport.use(new Strategy(
        {
            usernameField: 'username',
            passwordField: 'password'
        }, (username, password, done) => {
            const url = 'mongodb://localhost:27017';
            const dbName = 'libraryApp';

            (async function addUser() {
                let client;

                try {
                    client = await MongoClient.connect(url);
                    debug('Connected correctly to the server');

                    const db = client.db(dbName);

                    const collection = await db.collection('users');
                    const user = await collection.findOne({ username });

                    if (user && user.password === password) {
                        done(null, user);
                    } else {
                        done(null, false);
                    }
                } catch (error) {
                    debug(error);
                }

                client.close();
            }());
        }
    ));
};
