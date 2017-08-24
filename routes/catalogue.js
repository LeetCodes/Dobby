/**
 * Project : 141Tops
 * Package :
 * @author Alexandre CAZALA <alexandre.cazala@gmail.com>
 * @date 13/07/2017
 */
var express = require('express');
var router = express.Router();
var controller = require('../controllers/catalogue');

router.get('/', controller.getCatalogue);
router.get('/actionCount', controller.getCatalogueLength);
router.put('/:name/state', controller.switchState);
module.exports = router;
