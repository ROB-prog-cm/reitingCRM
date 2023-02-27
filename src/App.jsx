import {useEffect} from 'react'
import './App.css'
import {accessToken, refreshToken} from "./store/store.js";
import Table from "./page/Table.jsx";
import Header from "./components/Header.jsx";
import Sales from "./components/Sales.jsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Work from "./components/Work.jsx";
import History from "./components/History.jsx";

function App() {

  useEffect(() => {
    const requestOptions = {
      method: 'POST',
      body: JSON.stringify({
        "username": "79629001036",
        "password": "123456"
      }),
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRFToken': 'yiz6fHHDhaN6qcxZxaCGVXUHeiNvBMEb5fV2Pvt17RanWKWSHiEhliOMPxU5SM9X'
      }
    };

    fetch(`http://ovz18.j90211046.px7zm.vps.myjino.ru/api/login/`, requestOptions)
      .then(response => response.json())
      .then(data => {
        console.log('data-login', data)
        accessToken(data.access);
        refreshToken(data.refresh)
      })
  }, []);


  return (
    <BrowserRouter>
      <Header/>
      <Sales/>
      <Routes>
        <Route path="/" element={<Table/>}/>
        <Route path="/work" element={<Work/>}/>
        <Route path="/history" element={<History/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
