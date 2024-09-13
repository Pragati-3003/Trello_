import React, { useEffect, useState } from 'react';
import { ChevronRight, X, ChevronLeft, Plus } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveBoard } from '../../store/boardSlice';
import axios from 'axios';

const SideBar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [showPop, setShowPop] = useState(false);
  const [boardName, setBoardName] = useState('');
  const [boardColor, setBoardColor] = useState('');
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [optionsVisible, setOptionsVisible] = useState(null); 
  const dispatch = useDispatch();
  const [boards, setBoards] = useState([]);
  const activeBoardId = useSelector(state => state.boardSlice.activeBoardId);

  useEffect(() => {
    const fetchBoards = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }
      try {
        const response = await axios.get('http://localhost:8000/api/boards',{
          headers: {
            'Authorization' : `Bearer ${token}`
          }
        });
        setBoards(response.data);
      } catch (err) {
        console.error("Error fetching boards", err);
      }
    }
    fetchBoards()
  }, [boards])

  const handleBoardClick = (boardId) => {
    dispatch(setActiveBoard(boardId));
  };

  const handleUpdateBoardModal = (board) => {
    setSelectedBoard(board._id === selectedBoard ? null : board._id);
    setBoardName(board.name);
    setBoardColor(board.color);
    setOptionsVisible(null)
  };

  const handleUpdateBoard = async (e, boardId) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }
    try {
      await axios.put(`http://localhost:8000/api/boards/${boardId}`, {
        name: boardName,
        color: boardColor
      },{
        headers: {
          'Authorization' : `Bearer ${token}`
        }
      })
      setBoards((Boards) => {
        return Boards.map((board) => {
          return board._id === boardId ? { ...board, name: boardName, color: boardColor } : board
        })
      })
      // console.log("Board updated successfully");
      setSelectedBoard(null);
    } catch (err) {
      console.error("Error updating board", err);
    }
  };

  const handleCreateBoard = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }
    try {
      await axios.post('http://localhost:8000/api/boards', {
        name: boardName,
        color: boardColor || '#0079bf'
      },{
        headers: {
          'Authorization' : `Bearer ${token}`
        }
      })
      setBoards([...boards, { name: boardName, color: boardColor }])
      setBoardName('');
      setBoardColor('');
      setShowPop(false);
      console.log("Board created successfully");
    } catch (err) {
      console.error("Error creating board", err);
    }

  };

  const handleDeleteBoard = async (boardId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }
    try {
    if (window.confirm("Are you sure you want to delete this board?")) {
        await axios.delete(`http://localhost:8000/api/boards/${boardId}`,{
          headers: {
            'Authorization' : `Bearer ${token}`
          }
        })
        setBoards((Boards) => {
          return Boards.filter((board) => {
            return board._id !== boardId
          })
        })
        setOptionsVisible(null);
        console.log("Board deleted successfully");
      } 
    }catch (err) {
      console.error("Error deleting board", err)
    }
  };
  const handleCopyBoard = async (board) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }
  
    try {
      const response = await axios.post(`http://localhost:8000/api/boards/${board._id}`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setBoards((prevBoards) => [...prevBoards, response.data]);
      setOptionsVisible(null);
      console.log("Board copied successfully");
    } catch (err) {
      console.error("Error copying board", err);
    }
  };


  return (
    <div 
    style={{scrollbarColor: '#4B5563 #1F2937' }}
    className={`bg-[#1d2125]  overflow-y-scroll h-[92vh] text-gray-200 transition-all linear duration-500 flex-shrink-0 ${collapsed ? 'w-[42px]' : 'w-[280px]'}`}>
      {collapsed && (
        <div className='p-2'>
          <button onClick={() => setCollapsed(!collapsed)} className='hover:bg-zinc-700 rounded-sm p-1'>
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {!collapsed && (
        <div>
          <div className='p-3 hover:cursor-pointer flex justify-between border-b border-b-[#3a4149]'>
            <h4>My Workspace</h4>
            <button onClick={() => setCollapsed(!collapsed)} className='hover:bg-zinc-700 rounded-sm p-1'>
              <ChevronLeft size={18} />
            </button>
          </div>

          <div className="boardList">
            <div className="flex justify-between p-3">
              <h6>Your Boards</h6>
              <button onClick={() => setShowPop(!showPop)} className={`${!showPop ? '' : 'hover:bg-slate-300'} rounded-sm p-1`}>
                {!showPop && <Plus className='hover:bg-zinc-700' size={18} />}
              </button>

              {showPop && (
                <form onSubmit={handleCreateBoard} className='p-3'>
                  <div className='mb-2'>
                    <label htmlFor='boardName' className='block text-sm font-medium text-gray-700'>Board Name</label>
                    <input
                      type='text'
                      id='boardName'
                      value={boardName}
                      onChange={(e) => setBoardName(e.target.value)}
                      className='mt-1 block w-full p-2 bg-zinc-700 text-gray-300 rounded-md'
                      required
                    />
                  </div>
                  <div className='mb-2'>
                    <label htmlFor='boardColor' className='block text-sm font-medium text-gray-700'>Board Color</label>
                    <input
                      type='color'
                      id='boardColor'
                      value={boardColor}
                      onChange={(e) => setBoardColor(e.target.value)}
                      className='mt-1 bg-zinc-700 text-gray-300 h-10 block w-full p-2 rounded-md'
                      required
                    />
                  </div>
                  <button onClick={() => setShowPop(!showPop)} className='mt-2 p-2 hover:bg-zinc-700 rounded-md'>Cancel</button>
                  <button type='submit' className='mt-2 p-2 bg-blue-500 text-white rounded-md'>Save</button>
                </form>
              )}
            </div>
          </div>

          {boards.map((board) => (
            <ul key={board._id}>
              <li className='hover:bg-zinc-700'>
                <button onClick={() => handleBoardClick(board._id)} key={board._id}
                  className='px-3 py-2 w-full text-sm flex justify-start'>
                  <span className='w-6 h-max rounded-sm mr-2' style={{ backgroundColor: board.color }}>&nbsp;</span>
                  <div className="flex w-full items-center justify-between">
                    <span>{board.name}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOptionsVisible(board._id === optionsVisible ? null : board._id);
                      }}
                      title="Edit Board"
                      className="text-gray-300 m-0 mt-[-5px] p-0 text-lg float-right font-extrabold"
                    >
                      ...
                    </button>
                  </div>
                </button>

                {optionsVisible === board._id && (
                  <div className="options-menu p-2 bg-zinc-800 rounded-md shadow-md">
                    <button onClick={() => handleUpdateBoardModal(board)} className="block w-full text-left p-1 text-sm text-gray-300 hover:bg-zinc-700 rounded-md">Update Board</button>
                    <button onClick={() => handleCopyBoard(board)} className="block w-full text-left p-1 text-sm text-gray-300 hover:bg-zinc-700 rounded-md">Copy Board</button>

                    <button onClick={() => handleDeleteBoard(board._id)} className="block w-full text-left p-1 text-sm text-red-500 hover:bg-zinc-700 rounded-md">Delete Board</button>
                  </div>
                )}

                {selectedBoard === board._id && (
                  <form onSubmit={(e) => handleUpdateBoard(e, board._id)}
                    className='p-3 hover:bg-zinc-800'>
                    <div className='mb-2'>
                      <label htmlFor={`boardName-${board._id}`} className='block text-sm font-medium text-gray-500 p-1'>Board Name</label>
                      <input
                        type='text'
                        id={`boardName-${board._id}`}
                        value={boardName}
                        onChange={(e) => setBoardName(e.target.value)}
                        className='mt-1 block w-full p-2 bg-zinc-700 text-gray-200 rounded-md'
                        required
                      />
                    </div>
                    <div className='mb-2'>
                      <label htmlFor={`boardColor-${board._id}`} className='block text-sm font-medium text-gray-500 p-1'>Board Color</label>
                      <input
                        type='color'
                        id={`boardColor-${board._id}`}
                        value={boardColor}
                        onChange={(e) => setBoardColor(e.target.value)}
                        className='mt-1 bg-zinc-700 text-gray-300 h-10 block w-full p-2 rounded-md'
                        required
                      />
                    </div>
                    <button type='button' onClick={() => setSelectedBoard(null)} className='mt-2 p-2 hover:bg-zinc-700 rounded-md'>Cancel</button>
                    <button type='submit' className='mt-2 p-2 bg-blue-500 text-white rounded-md'>Update</button>
                  </form>
                )}
              </li>
            </ul>
          ))}
        </div>
      )}
    </div>
  );
};

export default SideBar;
