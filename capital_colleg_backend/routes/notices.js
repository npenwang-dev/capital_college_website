const express = require('express');
const router = express.Router();
const controller = require('../controllers/noticesController');

router.get('/', controller.getNotices);
router.get('/:id', controller.getNoticeById);
router.post('/', controller.createNotice);
router.put('/:id', controller.updateNotice);
router.patch('/:id/toggle-featured', controller.toggleFeatured);
router.delete('/:id', controller.deleteNotice);

module.exports = router;

