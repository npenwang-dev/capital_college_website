const express = require('express');
const router = express.Router();
const controller = require('../controllers/announcementsController');

router.get('/', controller.getAnnouncements);
router.post('/', controller.createAnnouncement);
router.post('/settings', controller.updateBannerSettings);
router.post('/from-notice', controller.importFromNotice);
router.put('/:id', controller.updateAnnouncement);
router.patch('/:id/toggle', controller.toggleAnnouncement);
router.delete('/:id', controller.deleteAnnouncement);

module.exports = router;
