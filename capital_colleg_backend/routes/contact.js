const express = require('express');
const router = express.Router();
const controller = require('../controllers/contactController');

router.post('/', controller.submitInquiry);
router.get('/', controller.getInquiries);
router.post('/test-mail', controller.testEmail);
router.get('/mail-status', controller.getMailStatus);
router.put('/:id', controller.updateInquiryStatus);
router.delete('/:id', controller.deleteInquiry);

module.exports = router;

