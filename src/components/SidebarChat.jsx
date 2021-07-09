import React, { useState, useEffect } from "react";
import "./sidebarchat.css";
import db from "../Firebase";
import { Link } from "react-router-dom";
import { Avatar, IconButton, Typography } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import CreateGroup from "./CreateGroup";
import { actionTypes } from "../reducer";
import { useStateValue } from "../StateProvider";

function SidebarChat({ roomId, addNewChat, roomName, roomDP }) {
  const [messageList, setMessageList] = useState([]);
  const [openGroupDialog, setOpenGroupDialog] = useState(false);
  const [{ hideSidebar }, dispatch] = useStateValue();

  const createGroup = () => {
    setOpenGroupDialog(true);
  };

  const closeCreateGroup = () => {
    setOpenGroupDialog(false);
  };

  useEffect(() => {
    if (roomId) {
      db.collection("rooms")
        .doc(roomId)
        .collection("messages")
        .orderBy("timestamp", "desc")
        .onSnapshot((snap) =>
          setMessageList(snap.docs.map((doc) => doc.data()))
        );
    }
  }, [roomId]);

  const handlCloseSidebar = () => {
    if (hideSidebar) {
      dispatch({
        type: actionTypes.handleSidebarType,
        hideSidebar: {
          open: false,
        },
      });
    }
  };

  return (
    <>
      {!addNewChat ? (
        <Link onClick={handlCloseSidebar} to={`/rooms/${roomId}`}>
          <div className="sidebarChat">
            <Avatar src={roomDP} alt="" className="sidebarchat__avatar" />
            <div className="sidebarchat__info">
              <h2>{roomName}</h2>
              <span>{messageList[0]?.message.slice(0, 15)}...</span>
            </div>
          </div>
        </Link>
      ) : (
        <div onClick={createGroup} className="sidebarChat">
          <Typography variant="h6">Start New Chat</Typography>
          <IconButton>
            <AddIcon />
          </IconButton>
        </div>
      )}

      <CreateGroup open={openGroupDialog} handleClose={closeCreateGroup} />
    </>
  );
}

export default SidebarChat;
