const axios = require('axios');
const xml2js = require('xml2js');
const debug = require('debug')('app:goodreadsService');

const parser = xml2js.Parser({ explicitArray: false });

function goodReadService() {
    function getBookById(bookId) {
        return new Promise((resolve, reject) => {
            axios.get(`https://www.goodreads.com/book/show/${bookId}.xml?key=zKzkMqd1kHDsQK578U3w`)
                .then((response) => {
                    parser.parseString(response.data, (error, result) => {
                        if (error) {
                            debug(error);
                        } else {
                            resolve(result.GoodreadsResponse.book);
                        }
                    });
                })
                .catch((error) => {
                    reject(error);
                    debug(error);
                });
        });
    }

    return {
        getBookById
    };
}

module.exports = goodReadService();
