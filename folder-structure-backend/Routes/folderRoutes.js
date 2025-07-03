const express = require('express');
const router = express.Router();
const folderController = require('../controllers/folderController');

router.post('/', folderController.createFolder);
router.get('/tree', folderController.getTree);
router.get('/specifictree', folderController.getSpecificTree);
router.get("/stats", folderController.getStats);


module.exports = router;
