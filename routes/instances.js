/**
 * Project : 141Tops
 * Package :
 * @author Alexandre CAZALA <alexandre.cazala@gmail.com>
 * @date 25/08/2017
 */
const express = require('express');
const router = express.Router();
const controller = require('../controllers/instance');

router.get('/', controller.getInstances);
router.get('/:id', controller.getInstance);
router.post('/', controller.createInstance);
router.put('/:id', controller.updateInstance);

module.exports = router;

