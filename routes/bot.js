/**
 * Created by A663945 on 03/07/2017.
 */
var express = require('express');
var router = express.Router();
var controller = require('../controllers/bot');

router.get('/start141', controller.startBot);
router.get('/hello', controller.hello);
module.exports = router;
