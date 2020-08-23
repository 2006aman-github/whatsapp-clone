import React from "react";
import "./login.css";
import { auth, provider } from "../Firebase";
import { useStateValue } from "../StateProvider";
import { actionTypes } from "../reducer";

function Login() {
  const [{}, dispatch] = useStateValue();

  const SignIn = () => {
    auth
      .signInWithPopup(provider)
      .then((result) => {
        dispatch({
          type: actionTypes.SET_USER,
          user: result.user,
        });
      })
      .catch((error) => alert(error.message));
  };
  return (
    <div className="login">
      <div className="login__container">
        <img
          src="https://i.pinimg.com/originals/79/dc/31/79dc31280371b8ffbe56ec656418e122.png"
          alt=""
        />
        <div className="login__text">
          <h2>Login to Whatsapp</h2>
        </div>
        <button onClick={SignIn}>Login With Google</button>
      </div>
    </div>
  );
}

export default Login;
