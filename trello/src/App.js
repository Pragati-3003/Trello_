
import './App.css';
import Navbar from './components/Navbar/Navbar';
import SideBar from './components/SideBar/SideBar';
import Board from './components/Board/Board';
import Register from './components/Authentication/Register';
import Login from './components/Authentication/Login';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setIsAuthenticated(true)
    }
  }, [])
  return (
    <Router>
      <>
        {isAuthenticated ? (
          <>
            <Navbar />
            <div className='flex  '>
              <SideBar />
              <Board />
            </div>
          </>
        ) : (
          <Routes>
          <Route path='/' element={<Navigate to='/register' />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login onLogin={() => setIsAuthenticated(true)} />} />
         </Routes>
        )}
      </>
    </Router>
  );
}

export default App;
