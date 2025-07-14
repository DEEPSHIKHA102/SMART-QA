const express = require('express');
const roomController = require('../controllers/roomController');
const router = express.Router();

router.post('/',roomController.createRoom);
router.get('/:code',roomController.getByRoomCode);
router.post('/:code/question',roomController.createQuestion);
router.get('/:code/question',roomController.getQuestion);

module.exports = router;