const express = require('express');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:authRoutes');
const passport = require('passport');

const authRouter = express.Router();

function router(nav) {
    authRouter.route('/signIn')
        .get((req, res) => {
            res.render('signin', {
                nav,
                title: 'Sign In'
            });
        })
        .post(passport.authenticate('local', {
            successRedirect: '/auth/profile',
            failureRedirect: '/'
        }));

    authRouter.route('/signUp')
        .get((req, res) => {
            res.render('signup', {
                nav,
                title: 'Register'
            });
        })
        .post((req, res) => {
            const { username, password } = req.body;
            const url = 'mongodb://localhost:27017';
            const dbName = 'libraryApp';

            (async function addUser() {
                let client;

                try {
                    client = await MongoClient.connect(url);
                    debug('Connected correctly to the server');

                    const db = client.db(dbName);

                    const collection = await db.collection('users');
                    const user = { username, password };
                    const results = await collection.insertOne(user);

                    req.logIn(results.ops[0], () => {
                        res.redirect('/auth/profile');
                    });
                } catch (error) {
                    debug(error);
                }

                client.close();
            }());
        });

    authRouter.route('/signOut')
        .get((req, res) => {
            req.logOut();
            res.redirect('/');
        });

    authRouter.route('/profile')
        .all((req, res, next) => {
            if (req.user) {
                next();
            } else {
                res.redirect('/');
            }
        })
        .get((req, res) => {
            res.render('profile', {
                nav,
                title: 'Profile',
                user: req.user
            });
        });

    return authRouter;
}

module.exports = router;
