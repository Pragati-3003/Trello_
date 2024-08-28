
import './App.css';
import Navbar from './components/Navbar/Navbar';
import SideBar from './components/SideBar/SideBar';
import Board from './components/Board/Board'
function App() {
  return(
    <>
    <Navbar/>
    <div className='flex  '> 
    <SideBar/>
    <Board/>
   
    </div>
  
   </>
  );
}

export default App;
