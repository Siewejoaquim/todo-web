// import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./Signup";
import Login from "./Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signup />} />         
        <Route path="/Login" element={<Login />} />   
      </Routes>
    </BrowserRouter>
  );
}

export default App;