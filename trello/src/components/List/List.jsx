import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddNew from '../AddNew/AddNew';
import { useSelector } from 'react-redux';
import Card from '../Card/Card';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { MoreHorizontal } from 'react-feather';

const List = () => {
  const [showOptions, setShowOptions] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [editingListId, setEditingListId] = useState(null);
  const [newListName, setNewListName] = useState('');
  const [boardLists, setBoardLists] = useState([]);
  const activeBoardId = useSelector(state => state.boardSlice.activeBoardId);

  useEffect(() => {
    const fetchlists = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }
      try {
        const response = await axios.get(`https://trello-backend-mcaz.onrender.com/api/lists/${activeBoardId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setBoardLists(response.data)
      } catch (error) {
        console.log('error fetching lists', error)
      }
    }
    fetchlists()
  }, [boardLists,activeBoardId])

  const handleCopyList = async (listId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    try {
      const response = await axios.post(`https://trello-backend-mcaz.onrender.com/api/lists/${listId}`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setBoardLists([...boardLists, response.data]);
      setShowOptions(null)
    } catch (err) {
      console.log('error copying list', err);
    }
  };

  const handleDeleteList = async (listId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }
    if (window.confirm("Are you sure you want to delete this board?")) {
      try {
        const response = await axios.delete(`https://trello-backend-mcaz.onrender.com/api/lists/${listId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log('list deleted', response.data);
        setBoardLists(boardLists.filter(list => list._id !== listId));
        setShowDeleteConfirmation(false);
        setShowOptions(null);
      } catch (err) {
        console.log('error deleting list', err);
      }
    }
  };


  const handleEditListName = (listId, name) => {
    setEditingListId(listId);
    setNewListName(name);
  };

  const handleListNameChange = (e) => {
    setNewListName(e.target.value);
  };

  const handleListNameUpdate = async (listId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }
    try {
      const response = await axios.put(`https://trello-backend-mcaz.onrender.com/api/lists/${listId}`, { name: newListName }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      // console.log('list name updated', response.data);
      setBoardLists(boardLists.map(list => list._id === listId ? { ...list, name: newListName } : list));
      setEditingListId(null);

    } catch (err) {
      console.log('error updating list name', err);
    }
  };
  const handleCardDelete = (listId, cardId) => {
    setBoardLists(boardLists.map(list =>
      list._id === listId ? {
        ...list,
        cards: list.cards.filter(card => card._id !== cardId)
      } : list
    ));
  };

  return (
    <div className='flex flex-grow'>
     
      {boardLists.map((list, index) => (
     
        <Draggable draggableId={list._id} index={index} key={list._id}>
      
          {(provided) => (
            
            <div
              className="p-3 w-[300px]"
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              <div className="rounded-lg p-3 text-gray-100 bg-black max-h-[80vh] overflow-y-auto">
                <div className="mb-4 font-medium flex justify-between items-center">
                  {editingListId === list._id ? (
                    <input
                      type="text"
                      value={newListName}
                      onChange={handleListNameChange}
                      onBlur={() => handleListNameUpdate(list._id)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleListNameUpdate(list._id);
                        }
                      }}
                      className="bg-gray-800 text-white p-1 rounded"
                      autoFocus
                    />
                  ) : (
                    <span
                      onClick={() => handleEditListName(list._id, list.name)}
                      className="cursor-pointer"
                    >
                      {list.name}
                    </span>
                  )}
                  <button
                    onClick={() => setShowOptions(showOptions === list._id ? null : list._id)}
                    title="List Options"
                    className="text-gray-300 text-lg rounded-md h-7 w-7 hover:bg-zinc-600"
                  >
                    <MoreHorizontal />
                  </button>
                </div>

                {showOptions === list._id && (
                  <div className="  bg-zinc-800 text-white p-2 rounded-md shadow-lg">
                    <button
                      onClick={() => handleCopyList(list._id)}
                      className="block w-full text-left p-2 hover:bg-zinc-600"
                    >
                      Copy List
                    </button>
                    <button
                      onClick={() => handleDeleteList(list._id)}
                      className="block w-full text-left p-2 hover:bg-zinc-600 text-red-500"
                    >
                      Delete List
                    </button>

                  </div>
                )}

                <Droppable droppableId={list._id} type='card'>
                  {(provided) => (
               
                    
                    <div key={list._id} ref={provided.innerRef} {...provided.droppableProps}>
                       {list?.cards?.length > 0 &&
                        list.cards.map((card, cardIndex) => (
                          <div
                            className="card-container" key={card}
                          > 
                          {/* {console.log(card)} */}
                            <Card
                              cardInfo={{ ...card, listId: list._id, cardId: card, boardId: activeBoardId }}
                              index={cardIndex}
                              key={card}
                              onCardDelete={handleCardDelete}
                              provided={provided} 
                            />
                          </div>
                        ))}
                      {provided.placeholder}
                    </div>

                  )}
                </Droppable>
                <div className="mt-3">
                  <AddNew type="card" parentId={list._id} boardId={activeBoardId} />
                </div>
              </div>
              </div>
          )}
            </Draggable>
          ))}

          <div className='rounded-sm m-2 mt-4 w-[300px]'>
            <div className='p-3 bg-black text-gray-100 rounded-md'>
              <AddNew />
            </div>
          </div>
        </div>
      );
};

      export default List;