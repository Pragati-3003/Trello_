import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from 'uuid';

const boardSlice = createSlice({
    name: "boardSlice",
    initialState: {
        boards: [],
        activeBoardId: null,
    },
    reducers: {
        addBoard: (state, action) => {
            state.boards.push({
                id: action.payload.id,
                name: action.payload.name,
                color: action.payload.color,
                lists: [],
            });
        },
        updateBoard: (state, action) => {
            const { boardId, name, color } = action.payload;
            const board = state.boards.find(board => board.id === boardId)
            if (board) {
                if (name)
                    board.name = name;
                if (color) {
                    board.color = color;
                }
            }
            else
                console.error(`Board with ID ${boardId} not found.`)
        },
        deleteBoard: (state, action) => {

            const boardId = action.payload;
            const boardIndex = state.boards.findIndex(board => board.id === boardId);

            if (boardIndex !== -1) {
                if (boardIndex === state.activeBoardId) {
                    state.activeBoardId = null;
                }
                state.boards
                    .splice(boardIndex, 1);
            }
            else {
                console.error(`Board with ID ${boardId} not found.`);
            }
        },
        setActiveBoard: (state, action) => {
            state.activeBoardId = action.payload;
        },
        addList: (state, action) => {
            const board = state.boards.find(board => board.id === action.payload.boardId);
            if (board) {
                board.lists.push({
                    id: action.payload.id,
                    name: action.payload.name,
                    cards: [],
                });
            }
        },

        updateList: (state, action) => {
            const { boardId, listId, name } = action.payload;
            const board = state.boards.find(board => board.id === boardId);
            if (board) {
                const list = board.lists.find(list => list.id === listId);
                if (list) {
                    list.name = name;
                }
                else
                    console.log("list not found");

            }
            else {
                console.log('board not found');

            }
        },
        deleteList: (state, action) => {
            const { boardId, listId } = action.payload;
            const board = state.boards.find(board => board.id === boardId);
            if (board) {
                board.lists = board.lists.filter(list => list.id !== listId);
            }
        },
        addCard: (state, action) => {
            const board = state.boards.find(board => board.id === action.payload.boardId);
            if (board) {
                const list = board.lists.find(list => list.id === action.payload.listId);
                if (list) {
                    list.cards.push({
                        id: action.payload.id,
                        name: action.payload.name,
                        description: "",
                    });
                } else {
                    console.error(`List with ID ${action.payload.listId} not found.`);
                }
            } else {
                console.error(`Board with ID ${action.payload.boardId} not found.`);
            }
        },
        updateCard: (state, action) => {
            const { cardId, listId, name, description } = action.payload;
            const board = state.boards.find(board => board.id === state.activeBoardId);
            if (board) {
                const list = board.lists.find(list => list.id === listId);
                if (list) {
                    const card = list.cards.find(card => card.id === cardId);
                    if (card) {
                        card.name = name;
                        card.description = description;
                    }
                }
            }
        },
        deleteCard: (state, action) => {
            const { cardId, listId } = action.payload;
            const board = state.boards.find(board => board.lists.some(list => list.id === listId));
            if (board) {
                const list = board.lists.find(list => list.id === listId);
                if (list) {
                    list.cards = list.cards.filter(card => card.id !== cardId);
                }
            }
        },
        reorderLists: (state, action) => {
            const { sourceIndex, destinationIndex } = action.payload;
            const board = state.boards.find(board => board.id === state.activeBoardId);
            if (board) {
                const [removed] = board.lists.splice(sourceIndex, 1);
                board.lists.splice(destinationIndex, 0, removed);
            }
        },

        reorderCards: (state, action) => {
            const { source, destination } = action.payload;
            const board = state.boards.find(board => board.id === state.activeBoardId);
            if (board) {
                const sourceList = board.lists.find(list => list.id === source.droppableId);
                const destinationList = board.lists.find(list => list.id === destination.droppableId);
                if (sourceList && destinationList) {
                    const [movedCard] = sourceList.cards.splice(source.index, 1);
                    destinationList.cards.splice(destination.index, 0, movedCard);
                }
            }
        },
        copyList: (state, action) => {
            const { boardId, listId } = action.payload;
            const board = state.boards.find(board => board.id === boardId);
            if (board) {
                const list = board.lists.find(list => list.id === listId);
                if (list) {
                    const newList = {
                        ...list,
                        id: uuidv4(),
                        name: `${list.name} (Copy)`,
                    };
                    board.lists.push(newList);

                    console.log("Copied list:", newList);
                    console.error("List not found.");
                }
            } else {
                console.error("Board not found.");
            }
        },

        copyCard: (state, action) => {
            const { cardId, listId } = action.payload;
            const board = state.boards.find(board => board.lists.some(list => list.id === listId));
            if (board) {
                const list = board.lists.find(list => list.id === listId);
                if (list) {
                    const card = list.cards.find(card => card.id === cardId);
                    if (card) {
                        const newCard = {
                            ...card,
                            id: uuidv4(),
                            name: `${card.name} (Copy)`,
                        };
                        list.cards.push(newCard);
                    }
                }
            }
        },
        copyBoard: (state, action) => {
            const { boardId } = action.payload;
            const board = state.boards.find(board => board.id === boardId);
            if (board) {
                const newBoard = {
                    ...board,
                    id: uuidv4(),
                    name: `${board.name} (Copy)`,
                };
                state.boards.push(newBoard);
                console.log("Copied board:", newBoard);
            } else {
                console.error("Board not found.");
            }
        },
    },
});

export const { addBoard, addList, addCard,
    setActiveBoard, reorderLists, reorderCards, updateCard
    , updateBoard, deleteBoard, updateList,
    deleteList, deleteCard, copyCard, copyList, copyBoard } = boardSlice.actions;
export default boardSlice.reducer;
