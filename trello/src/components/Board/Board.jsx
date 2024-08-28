import React, { useEffect, useState } from 'react';
import List from '../List/List';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import Filter from "../Filter/Filter";
const Board = () => {
  const [boards, setBoards] = useState([]);
  const [activeBoard, setActiveBoard] = useState(null);
  const activeBoardId = useSelector(state => state.boardSlice.activeBoardId)
  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/boards`);
        setBoards(response.data);
        const currentBoard = response.data.find(board => board._id === activeBoardId);
        setActiveBoard(currentBoard);
      } catch (err) {
        console.error("Error in fetching boards", err);
      }
    }
    fetchBoards();
  }, [activeBoardId])

  if (!activeBoard) {
    return <div className='items-center text-gray-300 font-bold text-lg bg-zinc-700 w-full  flex align-middle  justify-center'> <h1> No active board</h1></div>;
  }

  return (

    <div
      style={{ backgroundColor: activeBoard.color || 'gray', scrollbarColor: '#4B5563 #1F2937' }}
      className='w-full h-[92vh] flex flex-col p-5 overflow-auto'
    >
      <Filter />
      <div className='w-full flex flex-wrap flex-grow'>
        {activeBoard && <List />}
      </div>
    </div>

  );
};

export default Board;
