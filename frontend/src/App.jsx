import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import HomePage from './components/HomePage'
import AddItem from './components/AddItem'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<HomePage />}/>
            <Route path="/addItem" element={<AddItem />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
