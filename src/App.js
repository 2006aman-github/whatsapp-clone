import React, { useState, useEffect } from "react";
// import logo from './logo.svg';
import "./App.css";
import SideBar from "./components/SideBar";
import Chat from "./components/Chat";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./components/Login";
import { useStateValue } from "./StateProvider";
import { auth } from "./Firebase";
import Welcome from "./components/Welcome";
import { actionTypes } from "./reducer";
import { LinearProgress, Typography } from "@material-ui/core";
import { ReactComponent as WhatsappLogo } from "./svg/whatsapp.svg";

function App() {
  const [{ user, isAppLoading }, dispatch] = useStateValue();

  useEffect(() => {
    dispatch({
      type: actionTypes.handleAppLoading,
      isAppLoading: true,
    });
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        // user is logged in
        dispatch({
          type: "SET_USER",
          user: authUser,
        });
        dispatch({
          type: actionTypes.handleAppLoading,
          isAppLoading: false,
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <>
      {isAppLoading ? (
        <div className="loading__overlay">
          <WhatsappLogo width="200px" height="200px" />
          <br />
          <LinearProgress color="secondary" />
          <br />

          <Typography variant="h5">Loading</Typography>
        </div>
      ) : (
        <div className="App">
          <section className="bg__bar"></section>
          {!user ? (
            <Login />
          ) : (
            <div className="app__body">
              <Router>
                <SideBar />
                <Switch>
                  <Route path="/rooms/:roomId">
                    {/* chat  */}
                    <Chat />
                  </Route>
                  <Route exact path="/">
                    <Welcome />
                  </Route>
                </Switch>
              </Router>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default App;
