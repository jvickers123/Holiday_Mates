import React, { useEffect } from 'react'
import axios from 'axios'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NavigationBar from './components/NavigationBar'

function App() {
  useEffect(() => {
    const getData = async () => {
      const { data } = await axios.get('/api/holidays/') // * <-- replace with your endpoint
      console.log(data)
    }
    getData()
  })

  return (
    <>
      <BrowserRouter>
        <NavigationBar />

        <Routes>
          <Route />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App