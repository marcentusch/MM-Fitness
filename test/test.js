var expect  = require('chai').expect;
var request = require('request');

describe("Main app route", () => {
    it('Should give status 200', function(done) {
        request('http://localhost:8080' , function(error, response, body) {
            expect(response.statusCode).to.equal(200);
            done();
        });
    });
})