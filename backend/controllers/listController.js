import List from '../models/List.js'
import Board from '../models/Board.js'
import Card from '../models/Card.js'

//@desc Create a new list
const createList = async (req, res) => {
    const { name, boardId } = req.body
    try {

        const board = await Board
            .findById(boardId)
            .populate('lists')
        if (!board) {
            return res.status(404).json({ message: 'Board not found' })
        }
        const list = new List({ name, boardId })
        await list.save()
        board.lists.push(list)
        await board.save()
        const updatedBoard = await Board.findById(boardId).populate('lists');

        res.status(201).json(updatedBoard)

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

//@desc Get all lists
const getAllLists = async (req, res) => {
    try {
        const lists = await List.find()
        res.status(200).json(lists)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

//@desc get a lists from a specific board
const getListsByBoardId = async (req, res) => {
    const { boardId } = req.params;
    if (!boardId) {
        return res.status(400).json({ message: 'Board ID is required' });
    }
    try {
        const lists = await List.find({ boardId }).sort({position:1});
        if (!lists) {
            return res.status(404).json({ message: 'No lists found for this board ID' });
        }
        res.status(200).json(lists);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//@desc Update a list
const updateList = async (req, res) => {
    const { name } = req.body
    const { id } = req.params
    try {
        const list = await List.findById(id)
        if (!list) {
            return res.status(404).json({ message: 'List not found' })
        }
        list.name = name || list.name
        await list.save()
        res.status(200).json(list)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

//@desc Delete a list
const deleteList = async (req, res) => {
    const { id } = req.params
    try {
        const list = await List.findById(id);
        if (!list)
            return res.status(404).json({ message: 'List Not found' });
        await Card.deleteMany({ listId: id });
        await Board.findByIdAndUpdate(list.boardId, { $pull: { lists: id } });
        await list.deleteOne();
        res.status(200).json({ message: 'List deleted successfully' });


    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
}

//@desc Copy a List
const copyList = async (req, res) => {
    try {
        const { id } = req.params;
        const list = await List.findById(id);
        if (!list) {
            return res.status(404).json({ message: 'List not found' });
        }
        const copies = await List.find({ name: new RegExp(`^${list.name} \\(copy \\d+\\)$`) });
        const copyCount = copies.length + 1;
        const newList = new List({
            name: `${list.name} (copy ${copyCount})`,
            boardId: list.boardId,
            cards: []
        });
        await newList.save();

        for (const cardId of list.cards) {
            const card = await Card.findById(cardId);
            const newCard = new Card({
                name: card.name,
                description: card.description || '',
                listId: newList._id,
                boardId: card.boardId
            });
            await newCard.save();
            newList.cards.push(newCard._id);
        }
        await newList.save();
        await Board.findByIdAndUpdate(list.boardId, { $push: { lists: newList._id } });
        res.status(201).json(newList);
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.error(error);
    }
};



export { createList, getAllLists, getListsByBoardId, updateList, deleteList, copyList};
