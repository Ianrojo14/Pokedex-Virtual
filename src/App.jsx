import './App.css'
import { NextUIProvider } from '@nextui-org/react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Index from './pages/index';
import Pokedex from './pages/pokedex';
import Contact from './pages/contact';
import Creator from './pages/creator';

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Index/>}/>
        <Route path='/pokedex' element={<Pokedex/>}/>
        <Route path='/contact' element={<Contact/>}/>
        <Route path='/creator' element={<Creator/>}/>
      </Routes>
    </Router>
  )
}

export default App
