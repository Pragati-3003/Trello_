import React,{useEffect} from 'react'
import { MoreHorizontal, UserPlus, Edit2 } from 'react-feather'
import { useDispatch, useSelector } from 'react-redux'
import { updateBoard } from '../../store/boardSlice'
import axios from 'axios'

const Filter = () => {
  const dispatch = useDispatch();
  const activeBoardId = useSelector(state => state.boardSlice.activeBoardId);
  const [isEditing, setIsEditing] = React.useState(false);
  const [activeBoard, setActiveBoard] = React.useState(null);
  const [name, setName] = React.useState(activeBoard?.name || '');
  
  useEffect(()=>{
    const fetchBoard=async()=>{
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

         try{
          const response = await axios.get(`http://localhost:8000/api/boards`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
           const currentBoard = response.data.find(board => board._id === activeBoardId);
              setActiveBoard(currentBoard);
              setName(currentBoard.name);
         }catch(err){
            console.error("Error in fetching boards",err);
          }
    }
    fetchBoard();
  },[])

  useEffect(() => {
    const updateBoardName =async()=>{
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }
      if (activeBoard) {
    
        const response = await axios.put(`http://localhost:8000/api/boards/${activeBoardId}`, {
          name: name
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
       console.log(response.data);
           setName(activeBoard.name);
    }
    }
    updateBoardName()
  }, [activeBoard,setName]);

  const handleNameClick = () => {
    setIsEditing(true);
  }
  const handleNameChange =(e)=>{
    setName(e.target.value);
  }
  const handleNameSubmit = (e) => {
    e.preventDefault();
    setIsEditing(false);
    dispatch(updateBoard({ boardId: activeBoardId, name }));
  }
   if (!activeBoard) {
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
        >{activeBoard.name}</h2>)}

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