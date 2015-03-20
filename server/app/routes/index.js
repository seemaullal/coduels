'use strict';
var router = require('express').Router();
module.exports = router;

router.use('/tutorial', require('./tutorial'));
router.use('/members', require('./members'));

// Make sure this is after all of
// the registered routes!
router.use(function (req, res) {
    res.status(404).end();
});

// router.get('/arena', function(req, res, next) {
//   res.render('arena.html');
// });

router.get('/arena/iframe', function(req, res, next) {
  res.send('hello')
  var testText = "describe('add', function() {it(\"adds two numbers\", function() { var result = add(2, 3); expect(result).to.equal(5); }); });"
  // res.render('../../../browser/js/arena/iframe.html', {test: testText});
  next();
});

