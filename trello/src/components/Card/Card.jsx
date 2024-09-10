import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Card = ({ cardInfo, index }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [name, setName] = useState(cardInfo.name);
  const [description, setDescription] = useState(cardInfo.description || '');

  useEffect(() => {
    const fetchCard = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }
      try {
        const res = await axios.get(`http://localhost:8000/api/cards/${cardInfo.cardId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setName(res.data.name);
        setDescription(res.data.description || " ");
      } catch (err) {
        console.log("Error fetching card", err);
      }
    };
    fetchCard();
  }, [cardInfo.listId, cardInfo.cardId]);

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
    setIsOptionsOpen(false);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }
    try {
      await axios.put(`http://localhost:8000/api/cards/${cardInfo.cardId}`, { name, description }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      handleDialogClose();
    } catch (err) {
      console.log("Error updating/saving card", err);
    }
  };

  const handleOptionsToggle = () => {
    setIsOptionsOpen(!isOptionsOpen);
  };

  const handleDeleteCard = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }
    try {
      if (window.confirm("Are you sure you want to delete this card?")) {
        await axios.delete(`http://localhost:8000/api/cards/${cardInfo.cardId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setIsOptionsOpen(false);
      }
    } catch (err) {
      console.log("Error deleting card", err);
    }
  };

  const handleCopyCard = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }
    try {
      await axios.post(`http://localhost:8000/api/cards/${cardInfo.cardId}`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setIsOptionsOpen(false);
    } catch (err) {
      console.log('Unable to copy a card', err);
    }
  };

  return (

    <div
      className='text-gray-300 z-10 bg-zinc-700 hover:bg-gray-500 p-2 mt-2 shadow-md rounded-md'
    >
      <div className='flex justify-between items-center'>
        <button onClick={handleDialogOpen} className='text-left'>
          {name}
        </button>
        <button
          onClick={handleOptionsToggle}
          title="Card Options"
          className="text-gray-300 h-7 w-7 mt-[-10px] font-extrabold"
        >
          ...
        </button>
      </div>
      {isOptionsOpen && (
        <div className="relative mt-2 bg-zinc-800 text-white p-2 rounded-md shadow-lg">
          <button
            onClick={handleCopyCard}
            className="block w-full text-left p-2 hover:bg-zinc-600"
          >
            Copy Card
          </button>
          <button
            onClick={handleDeleteCard}
            className="block w-full text-left p-2 hover:bg-zinc-600 text-red-500"
          >
            Delete Card
          </button>
          <button
            onClick={handleDialogOpen}
            className="block w-full text-left p-2 hover:bg-zinc-600"
          >
            Update Card
          </button>
        </div>
      )}
      {isDialogOpen && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-15 z-50'>
          <div className='bg-zinc-800 text-gray-300 p-4 rounded shadow-md max-w-md w-full'>
            <h2 className='text-lg font-bold mb-2'>Edit Card</h2>
            <input
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='bg-zinc-700 hover:bg-zinc-500 hover:font-bold hover:text-black p-2 rounded w-full mb-2'
              placeholder='Card Name'
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className='bg-zinc-700 hover:bg-zinc-500 hover:font-bold hover:text-black p-2 rounded w-full mb-2'
              placeholder='Card Description'
              rows="4"
            />
            <div className='flex justify-end'>
              <button
                onClick={handleDialogClose}
                className='bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-2'
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded'
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>

  );
};

export default Card;