import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import Chat from './components/Chat';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Main from "./components/Main";

export default function BasicExample() {
  return (
    <Router>
        <Switch>
          {/* <Route exact path="/signup">
            <SignUp />
          </Route>
          <Route exact path="/login">
            <Login />
          </Route> */}
          <Route exact path="/">
            <Main />
          </Route>
        </Switch>
    </Router>
  );
}
