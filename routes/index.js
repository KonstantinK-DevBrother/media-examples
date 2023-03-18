var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express',
    videoPath: '19a91307-d5ab-47bd-a9ee-8f08abcd1229',
    // videoPath: '_2147421296',
  });
});

router.get('/s3', function (req, res, next) {
  res.render('s3',{
    title: 'S3',
    videoPath: '19a91307-d5ab-47bd-a9ee-8f08abcd1229',
  });
});

router.get('/preview', function (req, res, next) {
  res.render('video-preview', {
    title: 'Express',
    videoPath: '19a91307-d5ab-47bd-a9ee-8f08abcd1229',
  });
});

module.exports = router;
