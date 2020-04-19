require('should');

const request = require('supertest');
const mongoose = require('mongoose');

process.env.ENV = 'Test';

const app = require('../app');

const Book = mongoose.model('Book');
const agent = request.agent(app);

describe('Book Crud Test', () => {
    it('should allow a book to be posted and return read and _it', (done) => {
        const bookPost = {
            read: false,
            title: 'Sandokan',
            genre: 'Aventura',
            author: 'Emilio Salgari'
        };

        agent.post('/api/books')
            .send(bookPost)
            .expect(200, 'Post response code should be 200')
            .end((error, results) => {
                results.body.read.should.not.equal('false');
                results.body.should.have.property('_id');
                done();
            });
    });

    afterEach((done) => {
        Book.deleteMany({}).exec();
        done();
    });

    after((done) => {
        mongoose.connection.close();
        app.server.close(done());
    });
});
