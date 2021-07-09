import React from "react";
import "./login.css";
import { auth, provider } from "../Firebase";
import { useStateValue } from "../StateProvider";
import { actionTypes } from "../reducer";
import { Button, Card, Typography } from "@material-ui/core";

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
      <Card
        style={{
          maxHeight: "90vh",
          minHeight: "40vh",
          display: "flex",
          padding: "20px 10px",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          width: "300px",
        }}
      >
        <img
          src="https://i.pinimg.com/originals/79/dc/31/79dc31280371b8ffbe56ec656418e122.png"
          alt=""
          style={{ marginBottom: "10px" }}
          width="100px"
        />
        <div className="login__text">
          <Typography variant="h5" style={{ margin: "20px" }}>
            Login to Whatsapp
          </Typography>
        </div>
        <Button
          variant="contained"
          style={{ backgroundColor: "#25D366", color: "white" }}
          onClick={SignIn}
        >
          Login With Google
        </Button>
      </Card>
    </div>
  );
}

export default Login;
