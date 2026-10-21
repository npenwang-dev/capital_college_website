const express = require('express');
const router = express.Router();
const controller = require('../controllers/documentsController');

router.get('/', controller.getDocuments);
router.post('/upload', controller.uploadDocument);
router.get('/:id/download', controller.downloadDocument);
router.put('/:id', controller.updateDocument);
router.delete('/:id', controller.deleteDocument);

module.exports = router;
