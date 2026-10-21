const express = require('express');
const router = express.Router();
const governingBodyController = require('../controllers/governingBodyController');

router.get('/', governingBodyController.getGoverningBody);
router.post('/', governingBodyController.createGoverningBodyMember);
router.put('/:id', governingBodyController.updateGoverningBodyMember);
router.delete('/:id', governingBodyController.deleteGoverningBodyMember);

module.exports = router;
