import Board from '../models/Board.js';
import List from '../models/List.js';
import Card from '../models/Card.js';
import User from '../models/User.js';

// @desc  Create boards
const createBoard = async (req, res) => {
    try {
        const userId = req.user._id;
        const board = new Board({
            name: req.body.name,
            color: req.body?.color,
            user: userId
        });
        const createdBoard = await board.save();
        await User.findByIdAndUpdate(userId, { $push: { boards: createdBoard._id } });
        res.status(201).json(createdBoard);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Get all Boards for a specific user
const getAllBoards = async (req, res) => {
    try {
        const userId = req.user._id;
        const boards = await Board.find({ user: userId });
        res.status(200).json(boards);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc  Get a Board by ID
const getBoardById = async (req, res) => {
    try {
        const board = await Board.findById(req.params.id);
        if (board) {
            res.status(200).json(board);
        } else {
            res.status(404).json({ message: "Board not found" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc Update a Board by ID
const updateBoard = async (req, res) => {
    try {
        const board = await Board.findById(req.params.id);
        if (board) {
            board.name = req.body.name || board.name;
            board.color = req.body.color || board.color;
            const updatedBoard = await board.save();
            res.status(200).json(updatedBoard);
        } else {
            res.status(404).json({ message: "Board not found" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc Delete a Board by ID
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
                await User.findByIdAndUpdate(board.user, { $pull: { boards: board._id } });

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
};

// @desc Copy a board
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
            user: board.user,
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



// @desc Reorder lists within a board
const reorderList = async (req, res) => {
    const { boardId, sourceIndex, destinationIndex } = req.body;

    try {
        console.log('Request body:', req.body);

        const board = await Board.findById(boardId).populate('lists');
        if (!board) {
            console.error('Board not found', { boardId });
            return res.status(404).json({ message: 'Board not found' });
        }

        const lists = Array.from(board.lists);
        // console.log("Before reordering: lists", lists);

        if (sourceIndex < 0 || sourceIndex >= lists.length || destinationIndex < 0 || destinationIndex >= lists.length) {
            return res.status(400).json({ message: 'Invalid source or destination index' });
        }

        const [removed] = board.lists.splice(sourceIndex, 1); 
        board.lists.splice(destinationIndex, 0, removed); 


        board.lists.forEach((list, index) => {
            list.position = index;
            list.save();
          });
        
        await board.save();
         
        res.status(200).json(board);
    } catch (err) {
        console.error('Error reordering lists:', err);
        res.status(500).json({ message: 'Server Error' });
    }
};


const moveCard = async (req, res) => {
    const { sourceListId, destinationListId, sourceIndex, destinationIndex, cardId } = req.body;
  
    try {
      const sourceList = await List.findById(sourceListId).populate('cards');
      const destinationList = sourceListId === destinationListId 
        ? sourceList 
        : await List.findById(destinationListId).populate('cards');
  
      if (!sourceList || !destinationList) {
        return res.status(404).json({ message: 'Source or destination list not found' });
      }
  
      const sourceCards = Array.from(sourceList.cards);
      const [removedCard] = sourceCards.splice(sourceIndex, 1);
      if (sourceListId === destinationListId) {
        sourceCards.splice(destinationIndex, 0, removedCard);
        sourceList.cards = sourceCards.map(card => card._id);
        await sourceList.save();
      } else {
       const destinationCards = Array.from(destinationList.cards);
        destinationCards.splice(destinationIndex, 0, removedCard);
        sourceList.cards = sourceCards.map(card => card._id);
        destinationList.cards = destinationCards.map(card => card._id);
        await sourceList.save();
        await destinationList.save();
        const card = await Card.findById(cardId);
        card.listId = destinationListId;
        await card.save();
      }
  
      res.status(200).json({ sourceList, destinationList });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
export { createBoard, getAllBoards, getBoardById, updateBoard, deleteBoard, copyBoard, reorderList, moveCard };