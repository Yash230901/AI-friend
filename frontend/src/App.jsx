import React from "react";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./context/AuthProvider";
const App = () => {
  const [authUser] = useAuth();
  console.log(authUser)

  return (
    <>
      <Routes>
        <Route path="/" element={authUser ? <Home /> : <Navigate to={"/login"} />} />
        <Route path="/login" element={authUser ? <Navigate to={"/"} /> : <Login />} />
        <Route path="/Signup" element={authUser ? <Navigate to={"/Home"} /> : <Signup />} />
      </Routes>
    </>
  )
}
export default App;