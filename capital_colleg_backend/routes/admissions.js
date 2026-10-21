const express = require('express');
const router = express.Router();
const controller = require('../controllers/admissionsController');

router.post('/', controller.submitApplication);
router.get('/', controller.getApplications);
router.get('/status', controller.getAdmissionStatus);
router.patch('/status', controller.updateAdmissionStatus);
router.post('/status', controller.updateAdmissionStatus);
router.get('/track', controller.trackApplication);
router.get('/track/:appNo', controller.trackApplication);
router.get('/:id', controller.getApplicationById);
router.patch('/:id/status', controller.updateApplicationStatus);
router.delete('/:id', controller.deleteApplication);

module.exports = router;

