import { Button, Typography } from "@material-ui/core";
import React, { useState } from "react";
import { actionTypes } from "../reducer";
import { useStateValue } from "../StateProvider";
import { ReactComponent as WhatsappLogo } from "../svg/whatsapp.svg";
import { getWindowDimensions } from "../utils";

function Welcome() {
  const [state, dispatch] = useStateValue();
  const [showChatBtn, setShowChatBtn] = useState(false);

  React.useEffect(() => {
    const { width } = getWindowDimensions();
    if (width <= 670) {
      setShowChatBtn(true);
    }
    // window.addEventListener("resize", () => {
    //   let { width } = getWindowDimensions();
    //   if (width <= 670) {
    //     setShowChatBtn(true);
    //   } else {
    //     setShowChatBtn(false);
    //   }
    // });
    // return () => {
    //   window.removeEventListener("resize", () => {
    //     getWindowDimensions();
    //   });
    // };
  }, []);

  const handleOpenSidebar = () => {
    dispatch({
      type: actionTypes.handleSidebarType,
      hideSidebar: {
        open: true,
      },
    });
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#F8F9FA",
        // placeContent: "center",
        // border: "1px solid red",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography variant="h4">Welcome to WhatsApp</Typography>
      <WhatsappLogo
        width="250px"
        height="250px"
        // style={{ border: "1px solid red" }}
      />
      <br />
      {showChatBtn && (
        <Button
          onClick={handleOpenSidebar}
          style={{ backgroundColor: "#009688", color: "#fff" }}
        >
          start chatting
        </Button>
      )}
    </div>
  );
}

export default Welcome;
