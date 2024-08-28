import Board from '../models/Board.js';
import List from '../models/List.js';
import Card from '../models/Card.js';

// @desc  Create boards
const createBoard = async (req, res) => {
    try {
        const board = new Board({
            name: req.body.name,
            color: req.body?.color
        })
        const createdBoard = await board.save();
        res.status(201).json(createdBoard);

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server Error" })

    }
}

// @desc    Get all Boards 
const getAllBoards = async (req, res) => {
    try {
        const boards = await Board.find();
        res.status(200).json(boards);

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server Error" })
    }
}

// @desc  Get a Board by ID
const getBoardById = async (req, res) => {
    try {
        const board = await Board.findById(req.params.id)
        if (board) {
            res.status(200).json(board)
        } else {
            res.status(404).json({ message: "Board not found" })
        }

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server Error" })
    }
}

// @desc Update a Board by ID
const updateBoard = async (req, res) => {
    try {
        const board = await Board.findById(req.params.id)
        if (board) {
            board.name = req.body.name || board.name
            board.color = req.body.color || board.color
            const updatedBoard = await board.save()
            res.status(200).json(updatedBoard)
        } else {
            res.status(404).json({ message: "Board not found" })
        }

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server Error" })
    }
}

//@desc Delete a Board by ID
const deleteBoard = async (req, res) => {
    try {
        const board = await Board.findById(req.params.id);
        if (board) {
            const lists = await List.find({ boardId: req.params.id });
            if (lists) {
                for (const list of lists) {
                    await Card.deleteMany({ listId: list._id });
                    await list.deleteOne();
                }
                await board.deleteOne();
                res.status(200).json({ message: "Board removed" });
            } else {
                res.status(404).json({ message: "Lists not found" });
            }
        } else {
            res.status(404).json({ message: "Board not found" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
}

//@desc Copy  a board
const copyBoard = async (req, res) => {
    try {
        const board = await Board.findById(req.params.id).populate('lists');
        if (!board) {
            return res.status(404).json({ message: "Board not found" });
        }
        const copies = await Board.find({ name: new RegExp(`^${board.name} \\(copy \\d+\\)$`) });
        const copyCount = copies.length + 1;
        const newBoard = new Board({
            name: `${board.name} (copy ${copyCount})`,
            color: board.color,
            lists: []
        });
        await newBoard.save();
        for (const listId of board.lists) {
            const originalList = await List.findById(listId).populate('cards');
            const newList = new List({
                name: originalList.name,
                boardId: newBoard._id,
                cards: []
            });
            await newList.save();
            for (const cardId of originalList.cards) {
                const originalCard = await Card.findById(cardId);
                const newCard = new Card({
                    name: originalCard.name,
                    description: originalCard.description,
                    listId: newList._id,
                    boardId: newBoard._id
                });
                await newCard.save();
                newList.cards.push(newCard._id);
            }
            await newList.save();
            newBoard.lists.push(newList._id);
        }
        await newBoard.save();

        res.status(201).json(newBoard);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
};

const reorderLists = async (req, res) => {
    try {
        const { sourceIndex, destinationIndex } = req.body;
        
        // Validate indexes
        if (sourceIndex === undefined || destinationIndex === undefined) {
            return res.status(400).json({ message: "Source and destination indices are required" });
        }

        const board = await Board.findById(req.params.boardId);
        const list = await List.find({ boardId: req.params.boardId });
        if (!board) {
            return res.status(404).json({ message: "Board not found" });
        }

        if (sourceIndex < 0 || sourceIndex >= board.lists.length || destinationIndex < 0 || destinationIndex >= board.lists.length) {
            return res.status(400).json({ message: "Invalid source or destination index" });
        }

        const [removedList] = list.splice(sourceIndex, 1);
        list.splice(destinationIndex, 0, removedList);
        await list.save()
        await board.save();
        res.status(200).json(board);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};


const reorderCards = async (req, res) => {
    try {
        const { source, destination } = req.body;
        const board = await Board.findById(req.params.boardId).populate({
            path: 'lists',
            populate: { path: 'cards' }
        });

        if (!board) {
            return res.status(404).json({ message: "Board not found" });
        }

        const sourceList = board.lists.id(source.droppableId);
        const destinationList = board.lists.id(destination.droppableId);

        if (!sourceList || !destinationList) {
            return res.status(400).json({ message: "Invalid source or destination list" });
        }

        const [movedCard] = sourceList.cards.splice(source.index, 1);
        destinationList.cards.splice(destination.index, 0, movedCard);

        await sourceList.save();
        await destinationList.save();
        await board.save();

        return res.status(200).json({ message: "Cards reordered successfully" });
    } catch (err) {
        console.error('Error reordering cards:', err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export { createBoard, getAllBoards, getBoardById, updateBoard, deleteBoard, copyBoard ,reorderLists,reorderCards} 