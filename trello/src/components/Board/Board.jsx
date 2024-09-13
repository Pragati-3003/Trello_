import React, { useEffect, useState } from 'react';
import List from '../List/List';
import axios from 'axios';
import { useSelector, useDispatch, Provider } from 'react-redux';
import Filter from "../Filter/Filter";
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

const Board = () => {
  const [boards, setBoards] = useState([]);
  const [activeBoard, setActiveBoard] = useState(null);
  const [allLists, setAllLists] = useState([]);
  const activeBoardId = useSelector(state => state.boardSlice.activeBoardId)
  useEffect(() => {
    const fetchBoards = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }
      try {
        const response = await axios.get(`http://localhost:8000/api/boards`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setBoards(response.data);
        const currentBoard = response.data.find(board => board._id === activeBoardId);
        setActiveBoard(currentBoard);
      } catch (err) {
        console.error("Error in fetching boards", err);
      }
    };

    const fetchLists = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }
      try {
        const response = await axios.get(`http://localhost:8000/api/lists/${activeBoard._id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setAllLists(response.data);
      } catch (err) {
        console.error("Error in fetching lists", err);
      }
    };
    fetchBoards();
    fetchLists();
  }, [activeBoardId])


  const fetchAllLists = async (board) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }
    try {
      console.log("response in fetch list ", board.lists)
      setAllLists(board.lists);
      console.log("fetched lsit", allLists);

    } catch (err) {
      console.error("Error in fetching lists", err);
    }
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId, type } = result;
    if (!destination) {
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    if (type === 'list') {
      try {
        const response = await axios.put('http://localhost:8000/api/boards/reorderlists', {
          boardId: activeBoard._id,
          sourceIndex: source.index,
          destinationIndex: destination.index
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.status === 200) {
          const updatedBoardResponse = await axios.get(`http://localhost:8000/api/boards/${activeBoard._id}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const updatedBoard = updatedBoardResponse.data;
          setActiveBoard(updatedBoard);
          setAllLists(updatedBoard.lists);
        } else {
          console.error('Failed to reorder lists:', response.data.message);
        }
      } catch (error) {
        console.error('Error reordering lists:', error.message);
      }
    } else {
      try {
        await axios.put('http://localhost:8000/api/boards/movecard', {
          sourceListId: source.droppableId,
          destinationListId: destination.droppableId,
          sourceIndex: source.index,
          destinationIndex: destination.index,
          cardId: draggableId
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const updatedBoard = await axios.get(`http://localhost:8000/api/boards/${activeBoard._id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setActiveBoard(updatedBoard.data);
        setAllLists(updatedBoard.data.lists)
      } catch (error) {
        console.error('Error moving card:', error.response?.data || error.message);
      }
    }
  };

  if (!activeBoard) {
    return <div className='items-center text-gray-300 font-bold text-lg bg-zinc-700 w-full  flex align-middle  justify-center'> <h1> No active board</h1></div>;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId='board' type='list' direction='horizontal' >
        {(provided) => (
          <div
            style={{ backgroundColor: activeBoard.color || 'gray', scrollbarColor: '#4B5563 #1F2937' }}
            className='w-full h-[92vh] flex flex-col p-5 overflow-auto'
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            <Filter boardId={activeBoard._id}/>
            <div className='w-full flex flex-wrap flex-grow'>
              {activeBoard && <List boardId={activeBoard._id} />}
            </div>
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default Board;
