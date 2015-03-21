'use strict';
var router = require('express').Router();
module.exports = router;

// iframe route that serves up test specs from the database / NEED TO LINK UP TO DATABASE
router.get('/arena/iframe', function(req, res) {
    var testText = "describe('add', function() {it(\"adds two numbers\", function() { var result = add(2, 3); expect(result).to.equal(5); }); it(\"adds two numbers\", function() { var result = add(3, 3); expect(result).to.equal(6); }); });";
    res.render('iframe', {
        test: testText
    });
});


// Make sure this is after all of
// the registered routes!
router.use(function(req, res) {
    res.status(404).end();
});
