import express from 'express';
import {createBoard,getAllBoards,getBoardById,updateBoard,deleteBoard,copyBoard,reorderList,moveCard} from '../controllers/boardController.js'
const router = express.Router();


router.put('/boards/reorderlists',reorderList);
router.put('/boards/movecard',moveCard);
router.post('/boards',createBoard);
router.get('/boards',getAllBoards);

router.get('/boards/:id',getBoardById);
router.put('/boards/:id',updateBoard);
router.delete('/boards/:id',deleteBoard);
router.post('/boards/:id',copyBoard);


export default router