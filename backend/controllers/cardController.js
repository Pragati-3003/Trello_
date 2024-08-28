import List from "../models/List.js"
import Card from "../models/Card.js"
import Board from '../models/Board.js'
// @desc create a list

const createCard = async (req, res) => {
    try {
        const { name, listId, boardId } = req.body;
        const board =  await Board.findById(boardId);
        const list = await List.findById(listId);
        if(!board)
            return res.status(404).json({message:"Board not found"});
        if (!list)
            return res.status(404).json({ message: "List not found" });
        const card = new Card({
            name,
            listId,
            boardId: list.boardId
        })
        const createdCard = await card.save();
        list.cards.push(createdCard);
        await list.save();
        res.status(201).json(createdCard);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
        console.log(error);

    }
}

//@desc get all cards
const getAllCards = async (req, res) => {
    try {
        const cards = await Card.find({});
        res.json(cards);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
        console.log(error);
    }
}

//@desc get card by id
const getCardById = async (req, res) => {
    try {
        const card = await Card.findById(req.params.id);
        if (!card)
            return res.status(404).json({ message: "Card not found" });
        res.json(card);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
        console.log(error);
    }
}

//@desc get all cards of a specific list
const getCardsByListId = async (req, res) => {
    try {
        const cards = await Card.find({ listId: req.params.listId });
        res.json(cards);

    } catch (error) {
        res.status(500).json({ message: "Server Error" });
        console.log(error);
    }
}


// @desc update a card
const updateCard = async (req, res) => {
    try {
        const card = await Card.findById(req.params.id);
        if (!card)
            return res.status(404).json({ message: "Card not found" });
        const { name, description } = req.body;
        card.name = name || card.name;
        card.description = description || card.description;
        const updatedCard = await card.save();
        res.json(updatedCard);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
        console.log(error);
    }
}

//@desc delete a card
const deleteCard = async (req, res) => {
    try {
        const card = await Card.findById(req.params.id);
        if (!card)
            return res.status(404).json({ message: "Card not found" });
      const listcard =  await List.findById(card.listId);
        listcard.cards = listcard.cards.filter((c) => c.toString() !== card._id.toString());
        await listcard.save();
        
        await card.deleteOne();
        res.json({ message: "Card removed" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
        console.log(error);
    }
}

//@desc copy  a card
const copyCard = async (req, res) => {
    try {
        const card = await Card.findById(req.params.id);
        if (!card)
            return res.status(404).json({ message: "Card not found" });

        const copies = await Card.find({ name: new RegExp(`^${card.name} \\(copy \\d+\\)$`) });
        const copyCount = copies.length + 1;

        const newCard = new Card({
            name: `${card.name} (copy ${copyCount})`,
            description: card.description,
            listId: card.listId,
            boardId: card.boardId
        });

        const createdCard = await newCard.save();
        await List.findByIdAndUpdate(card.listId,
            { $push: { cards: createdCard._id } });

        res.status(201).json(createdCard);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
        console.error(error);
    }
};

export { createCard, getAllCards, getCardById, getCardsByListId, updateCard, deleteCard, copyCard };