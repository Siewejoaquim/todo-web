// import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./Signup";
import Login from "./Login";
import Dashboard from "./Dashboard";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signup />} />         
        <Route path="/Login" element={<Login />} />
        <Route path="/Dash" element={<Dashboard />} />   

      </Routes>
    </BrowserRouter>
  );
}

export default App;