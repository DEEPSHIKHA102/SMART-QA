const express = require('express');
const { body } = require('express-validator');
const roomController = require('../controllers/roomController');
const { authenticateUser, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.post(
  '/',
  body('createdBy').notEmpty().withMessage('createdBy is required'),
  roomController.createRoom
);
router.get('/:code', roomController.getByRoomCode);
router.post(
  '/:code/question',
  [body('content').notEmpty(), body('createdBy').notEmpty()],
  roomController.createQuestion
);
router.get('/:code/question', roomController.getQuestion);
router.get('/:code/top-question', roomController.generateTopQuestions);
router.delete('/:code', authenticateUser, authorizeRoles('admin'), roomController.deleteRoom);
router.delete('/:code/question/:id', authenticateUser, authorizeRoles('admin'), roomController.deleteQuestion);

module.exports = router;
