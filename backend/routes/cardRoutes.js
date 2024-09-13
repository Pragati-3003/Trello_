import express from 'express';

import { createCard ,getAllCards,getCardById,getCardsByListId,updateCard,deleteCard,copyCard} from '../controllers/cardController.js';

const router = express.Router();


router.post('/cards',createCard);
router.get('/cards',getAllCards);
router.get('/cards/:id',getCardById);
router.get('/cards/card/:listId',getCardsByListId);
router.put('/cards/:id',updateCard);
router.delete('/cards/:id',deleteCard);
router.post('/cards/:id/copy',copyCard);


export default router