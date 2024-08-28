import express from 'express';
import {createBoard,getAllBoards,getBoardById,updateBoard,deleteBoard,copyBoard,reorderLists,reorderCards} from '../controllers/boardController.js'
const router = express.Router();

router.post('/boards',createBoard);
router.get('/boards',getAllBoards);
router.get('/boards/:id',getBoardById);
router.put('/boards/:id',updateBoard);
router.delete('/boards/:id',deleteBoard);
router.post('/boards/:id',copyBoard);
router.put('/boards/:boardId/reorder-lists', reorderLists);
router.put('/boards/:boardId/reorder-cards', reorderCards);

export default router