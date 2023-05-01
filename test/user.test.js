const assert = require('chai').assert;
const userController = require('../controllers/user.controller');



// TC-202-1 Toon alle gebruikers (minimaal 2)
describe('User Controller', function () {
  describe('#getAllUsers()', function () {
    it('should return all users with a minimum of 2 users', function (done) {
      const req = {
        query: {},
      };
      const res = {
        status: function (code) {
          assert.equal(code, 200);
          return this;
        },
        json: function (result) {
          assert.equal(result.statusCode, 200);
          assert.equal(result.message, 'User getAll endpoint');
          assert.isArray(result.data);
          assert.isAtLeast(result.data.length, 2);
          done();
        },
      };
      const next = function (err) {
        done(err);
      };

      userController.getAllUsers(req, res, next);
    });
  });
});
