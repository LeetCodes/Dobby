/**
 * Project : 141Tops
 * Package :
 * @author Alexandre CAZALA <alexandre.cazala@gmail.com>
 * @date 13/07/2017
 */
var express = require('express');
var router = express.Router();
var controller = require('../controllers/bot');

router.get('/start', controller.startBot);
router.get('/stop', controller.stopBot);
router.get('/status', controller.getStatus);
router.get('/herokuHack', controller.herokuHack);

module.exports = router;
