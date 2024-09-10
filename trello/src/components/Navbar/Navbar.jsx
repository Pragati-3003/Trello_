import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faCaretRight, faCircleInfo, faCaretDown, faMagnifyingGlass, faBell, faUser } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { addBoard, setActiveBoard } from '../../store/boardSlice';
import { useNavigate } from 'react-router';

const Navbar = () => {
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const [visibleSublist, setVisibleSublist] = useState(null);
    const [showPop, setShowPop] = useState(false);
    const [boardName, setBoardName] = useState('');
    const [boardColor, setBoardColor] = useState('');
    const navigate = useNavigate();

    const toggleDropdown = () => {
        setDropdownVisible(!isDropdownVisible);
    };

    const toggleSublist = (listName) => {
        setVisibleSublist(visibleSublist === listName ? null : listName);
    };

    const dispatch = useDispatch();
    const boards = useSelector(state => state.boardSlice.boards);
    const activeBoardId = useSelector(state => state.boardSlice.activeBoardId);
    const activeBoard = boards.find(board => board.id === activeBoardId);

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
                color: boardColor
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setBoardName('');
            setBoardColor('');
            setShowPop(false);
            console.log("Board created successfully");
        } catch (err) {
            console.error("Error creating board", err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
       
        navigate('/login');
         window.location.reload();
    };

    return (
        <div className='w-full z-10 relative text-gray-300 bg-[#1d2125] '>
            <div className='border-b border-[#2f343b] h-14 w-full flex items-center justify-between p-4'>

                <div className='flex items-center'>

                    <div>
                        <h1 className='font-sans tracking-widest text-xl font-bold text-gray-300'>Trello</h1>
                    </div>
                    <ul className=' relative hidden md:flex space-x-4 ml-8 z-30'>
                        <li className=' z-30 decoration-transparent font-semibold hover:underline cursor-pointer' onClick={() => toggleSublist('Workshop')}>
                            Workshop <FontAwesomeIcon icon={faCaretDown} />
                            {visibleSublist === 'Workshop' && (
                                <ul className=' z-30 absolute mt-2 bg-[#3a4149] shadow-lg p-2 rounded-lg w-52'>
                                    <li className='py-1 z-30 px-2 cursor-pointer hover:bg-[#747f8d]'>Subitem 1</li>
                                    <li className='py-1 z-30 px-2 cursor-pointer hover:bg-[#747f8d]'>Subitem 2</li>
                                </ul>
                            )}
                        </li>
                        <li className='relative z-30 decoration-transparent font-semibold hover:underline cursor-pointer' onClick={() => toggleSublist('Recent')}>
                            Recent <FontAwesomeIcon icon={faCaretDown} />
                            {visibleSublist === 'Recent' && (
                                <ul className='absolute z-30 mt-2 bg-[#3a4149] shadow-lg p-2 rounded-lg w-52'>
                                    <li className='py-1 z-30 px-2 cursor-pointer hover:bg-[#747f8d]'>Subitem 1</li>
                                    <li className='py-1 z-30 px-2 cursor-pointer hover:bg-[#747f8d]'>Subitem 2</li>
                                </ul>
                            )}
                        </li>
                        <li className='decoration-transparent font-semibold hover:underline cursor-pointer' onClick={() => toggleSublist('Starred')}>
                            Starred <FontAwesomeIcon icon={faCaretDown} />
                            {visibleSublist === 'Starred' && (
                                <ul className='absolute mt-2 bg-[#3a4149] shadow-lg p-2 rounded-lg w-52'>
                                    <li className='py-1 px-2 cursor-pointer hover:bg-[#747f8d]'>Subitem 1</li>
                                    <li className='py-1 px-2 cursor-pointer hover:bg-[#747f8d]'>Subitem 2</li>
                                </ul>
                            )}
                        </li>
                        <li className='decoration-transparent font-semibold hover:underline cursor-pointer' onClick={() => toggleSublist('Templates')}>
                            Templates <FontAwesomeIcon icon={faCaretDown} />
                            {visibleSublist === 'Templates' && (
                                <ul className='absolute mt-2 bg-[#3a4149] shadow-lg p-2 rounded-lg w-52'>
                                    <li className='py-1 px-2 cursor-pointer hover:bg-[#747f8d]'>Subitem 1</li>
                                    <li className='py-1 px-2 cursor-pointer hover:bg-[#747f8d]'>Subitem 2</li>
                                </ul>
                            )}
                        </li>
                    </ul>
                    <div className='hidden md:flex pl-3'>
                        <button onClick={() => setShowPop(!showPop)} className='h-9 w-20 ml-4 bg-blue-600 text-white rounded-md'>Create</button>
                    </div>
                    {showPop && (
                        <form onSubmit={handleCreateBoard} className='bg-black mt-52 p-3 text-gray-200 rounded-md '>
                            <div className='mb-2 '>
                                <label htmlFor='boardName' className='block text-sm font-medium text-gray-400'>Board Name</label>
                                <input
                                    type='text'
                                    id='boardName'
                                    value={boardName}
                                    onChange={(e) => setBoardName(e.target.value)}
                                    className='mt-1 block w-full p-2  bg-zinc-700  text-gray-300 rounded-md'
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
                                    className='mt-1  bg-zinc-700   text-gray-300  h-10 block w-full p-2  rounded-md'
                                    required
                                />
                            </div>
                            <button onClick={() => setShowPop(!showPop)} className='mt-2 p-2 hover:bg-zinc-700 rounded-md'>Cancel</button>
                            <button type='submit' className='mt-2 p-2 bg-blue-500 text-white rounded-md'>Save</button>
                        </form>
                    )}
                    <div className='relative md:hidden flex items-center ml-4 text-lg font-semibold'>
                        <div onClick={toggleDropdown} className='flex items-center cursor-pointer pr-1'>
                            More
                            <button className='p-1'>
                                <FontAwesomeIcon icon={faCaretDown} />
                            </button>
                        </div>
                        {isDropdownVisible && (
                            <div className='absolute top-12 bg-[#3a4149] shadow-lg p-2 rounded-lg w-52'>
                                <ul>
                                    <li className='py-1 px-2 cursor-pointer hover:bg-[#747f8d]' onClick={() => toggleSublist('Workspaces')}>
                                        Workspaces <FontAwesomeIcon icon={faCaretRight} />
                                        {visibleSublist === 'Workspaces' && (
                                            <ul className='mt-2 bg-[#3a4149] shadow-lg p-2 rounded-lg w-52'>
                                                <li className='py-1 px-2 cursor-pointer hover:bg-[#747f8d]'>Subitem 1</li>
                                                <li className='py-1 px-2 cursor-pointer hover:bg-[#747f8d]'>Subitem 2</li>
                                            </ul>
                                        )}
                                    </li>
                                    <li className='py-1 px-2 cursor-pointer hover:bg-[#747f8d]' onClick={() => toggleSublist('Recent Boards')}>
                                        Recent Boards <FontAwesomeIcon icon={faCaretRight} />
                                        {visibleSublist === 'Recent Boards' && (
                                            <ul className='mt-2 bg-[#3a4149] shadow-lg p-2 rounded-lg w-52'>
                                                <li className='py-1 px-2 cursor-pointer hover:bg-[#747f8d]'>Subitem 1</li>
                                                <li className='py-1 px-2 cursor-pointer hover:bg-[#747f8d]'>Subitem 2</li>
                                            </ul>
                                        )}
                                    </li>
                                    <li className='py-1 px-2 cursor-pointer hover:bg-[#747f8d]' onClick={() => toggleSublist('Starred Boards')}>
                                        Starred Boards <FontAwesomeIcon icon={faCaretRight} />
                                        {visibleSublist === 'Starred Boards' && (
                                            <ul className='mt-2 bg-[#3a4149] shadow-lg p-2 rounded-lg w-52'>
                                                <li className='py-1 px-2 cursor-pointer hover:bg-[#747f8d]'>Subitem 1</li>
                                                <li className='py-1 px-2 cursor-pointer hover:bg-[#747f8d]'>Subitem 2</li>
                                            </ul>
                                        )}
                                    </li>
                                    <li className='py-1 px-2 cursor-pointer hover:bg-[#747f8d]' onClick={() => toggleSublist('Template')}>
                                        Template <FontAwesomeIcon icon={faCaretRight} />
                                        {visibleSublist === 'Template' && (
                                            <ul className='mt-2 bg-[#3a4149] shadow-lg p-2 rounded-lg w-52'>
                                                <li className='py-1 px-2 cursor-pointer hover:bg-[#747f8d]'>Subitem 1</li>
                                                <li className='py-1 px-2 cursor-pointer hover:bg-[#747f8d]'>Subitem 2</li>
                                            </ul>
                                        )}
                                    </li>
                                </ul>
                            </div>
                        )}
                        <div className='pl-3'>
                            <button onClick={() => setShowPop(!showPop)} className='text-2xl h-8 w-8 bg-blue-600 text-white rounded-md'>+</button>
                        </div>
                        {showPop && (
                            <form onSubmit={handleCreateBoard} className='p-3 hidden mt-7 z-30 '>
                                <div className='mb-2'>
                                    <label htmlFor='boardName' className='block text-sm font-medium text-gray-700'>Board Name</label>
                                    <input
                                        type='text'
                                        id='boardName'
                                        value={boardName}
                                        onChange={(e) => setBoardName(e.target.value)}
                                        className='mt-1 block w-full p-2  bg-zinc-700  text-gray-300 rounded-md'
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
                                        className='mt-1  bg-zinc-700   text-gray-300  h-10 block w-full p-2  rounded-md'
                                        required
                                    />
                                </div>
                                <button onClick={() => setShowPop(!showPop)} className='mt-2 p-2 hover:bg-zinc-700 rounded-md'>Cancel</button>
                                <button type='submit' className='mt-2 p-2 bg-blue-500 text-white rounded-md'>Save</button>
                            </form>
                        )}
                    </div>
                </div>
                {/* right side */}
                <div className='flex ml-auto items-center'>
                    <ul className='flex space-x-4 px-2'>
                        <li><FontAwesomeIcon icon={faMagnifyingGlass} /></li>
                        <li><FontAwesomeIcon icon={faBell} /></li>
                        <li><FontAwesomeIcon icon={faCircleInfo} /></li>
                        <li><FontAwesomeIcon icon={faUser} /></li>
                        <li>
                            <button onClick={handleLogout} className='text-white font-bold'>
                                Logout
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Navbar;