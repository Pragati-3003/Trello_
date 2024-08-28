import express from 'express'
import {
    createList, getAllLists, getListsByBoardId,
    updateList, deleteList, copyList
} from '../controllers/listController.js'

const router = express.Router()
router.get('/lists/:boardId', getListsByBoardId);
router.post('/lists', createList);
router.get('/lists', getAllLists);
router.put('/lists/:id', updateList);
router.delete('/lists/:id', deleteList);
router.post('/lists/:id', copyList);


export default router