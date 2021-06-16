import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Profile from "./pages/profile/Profile";
import Register from "./pages/register/Register";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Messenger from "./pages/messenger/Messenger";
import { useState, useEffect } from "react";
// import "antd/dist/antd.css";

function App() {
  // const { user } = useContext(AuthContext);
  //take user from local storage
  // console.log(localStorage.getItem("user"), "storage user");
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          {user ? <Home /> : <Redirect to="/login" />}
        </Route>
        <Route path="/login">{user ? <Redirect to="/" /> : <Login />}</Route>
        <Route path="/register">
          {user ? <Redirect to="/" /> : <Register />}
        </Route>
        <Route path="/profile/:username">
          {user ? <Profile /> : <Redirect to="/" />}
        </Route>
        <Route path="/messenger">
          {!user ? <Redirect to="/" /> : <Messenger />}
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
