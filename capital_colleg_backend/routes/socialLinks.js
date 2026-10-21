const express = require('express');
const router = express.Router();
const controller = require('../controllers/socialLinksController');

router.get('/', controller.getSocialLinks);
router.post('/', controller.createSocialLink);
router.put('/:id', controller.updateSocialLink);
router.patch('/:id/toggle', controller.toggleSocialLink);
router.delete('/:id', controller.deleteSocialLink);

module.exports = router;
