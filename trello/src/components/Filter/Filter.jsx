import React,{useEffect,useState} from 'react'
import { MoreHorizontal, UserPlus, Edit2 } from 'react-feather'
import axios from 'axios'

const Filter = ({ boardId }) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [board, setBoard] = useState(null);
  const [name, setName] = React.useState( '');
  
  useEffect(() => {
    const fetchBoard = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }
      try {
        const response = await axios.get(`http://localhost:8000/api/boards/${boardId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setBoard(response.data);
        setName(response.data.name);
      } catch (err) {
        console.log("Error fetching board", err);
      }
    };
    fetchBoard();
  }, [boardId]);
  

  const handleNameClick = () => {
    setIsEditing(true);
  }
  const handleNameChange =(e)=>{
    setName(e.target.value);
  }
  const handleNameSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }
    try {
      const response = await axios.put(`http://localhost:8000/api/boards/${board._id}`, {
        name: name
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setName(response.data.name);
      setIsEditing(false);
    } catch (err) {
      console.log("Error updating board name", err);
    }
  };
   if (!board) {
    return <div className='p-3 bg-black flex justify-between w-full bg-opacity-50'>Board not found</div>;
  }
 

  return (
    
    <div className='mt-[-20px] top-[-20px] left-[-20px] ml-[-20px] right-[-20px] mr-[-20px] sticky  bg-black bg-opacity-50'>
      <div className='p-3  flex justify-between'>

        {isEditing ? (<form onSubmit={handleNameSubmit}>
         <input
          type='text'
          value={name}
          onChange={handleNameChange}
          onBlur={handleNameSubmit}
          autoFocus
          className='text-black font-bold text-[20px] px-2 py-1 rounded'
           
         />
        </form>) : (<h2 className='text-white font-bold text-[20px]'
          onClick={handleNameClick}
        >{name}</h2>)}

        <div className='flex items-center justify-center'>
          <button className='bg-gray-200 h-8 text-gray-800 px-2 py-1 mr-2 rounded flex justify-center items-center'>
            <UserPlus size={16} className='mr-2'></UserPlus>
            Share
          </button>
          <button className='hover:bg-gray-500 px-2 py-1 h-8 rounded'>
            <MoreHorizontal className='text-white font-extrabold' size={16}></MoreHorizontal>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Filter;