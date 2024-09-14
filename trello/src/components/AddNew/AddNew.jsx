import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { Plus } from 'react-feather';

const AddNew = ({ type, parentId }) => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const forminput = useRef(null);
  const activeBoardId = useSelector(state => state.boardSlice.activeBoardId);
  const submitHandler = async (e) => {
    e.preventDefault();
    if (!inputValue) {
      forminput.current.focus();
      return;
    }
 
    
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }


    try {
      if (type) {
        const res = await axios.post('https://trello-backend-mcaz.onrender.com/api/cards',
          { name: inputValue, listId: parentId, boardId: activeBoardId },{
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
        setInputValue("");
        setIsFormVisible(!isFormVisible)
      } else {
        const res = await axios.post('https://trello-backend-mcaz.onrender.com/api/lists',
          { name: inputValue, boardId: activeBoardId },{
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
        setInputValue("");
        setIsFormVisible(!isFormVisible)
      }

    } catch (err) {
      console.error("Error in creating card/list", err);
    }
  }
  return (
    <div>
      <button className='flex ' onClick={() => setIsFormVisible(!isFormVisible)}>   <Plus className='mt-1 mr-2' size={16}></Plus>  Add {type ? " a card" : "another list"} </button>
      {isFormVisible &&
        <form onSubmit={submitHandler} className='mt-3'>
          <input
            value={inputValue}
            ref={forminput}
            onChange={(e) => setInputValue(e.target.value)}
            className='w-full h-10 mb-1 bg-zinc-700 text-gray-200 border-zinc-900 p-2 shadow-sm'
            type="text" placeholder={`Add new ${type ? "card" : "list"}`} />
          <div className="mt-3">
            <button type="button" onClick={() => setIsFormVisible(!isFormVisible)} className="mr-3 ">
              Cancel
            </button>
            <button type="submit" className="px-3 py-1 bg-blue-500 text-white">
              Save
            </button>
          </div>
        </form>
      }
    </div>
  )
}

export default AddNew