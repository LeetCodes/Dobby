/**
 * Project : 141Tops
 * Package :
 * @author Alexandre CAZALA <alexandre.cazala@gmail.com>
 * @date 25/08/2017
 */
const express = require('express');
const router = express.Router();
const auth = require('../configurations/auth');
const users = require('../controllers/user');
const session = require('../controllers/session');

/*** User routes ***/
router.post('/users', users.create);
router.get('/users/:userId', users.show);

router.put('/users', users.updateUserInfo);
router.put('/users/:id', auth.ensureAuthenticated,users.updateUserInfo);

router.get('/check_username/:username', users.exists);

/*** Session routes ***/
router.get('/session', session.session);
router.post('/session', session.login);
router.delete('/session', session.logout);

module.exports = router;
