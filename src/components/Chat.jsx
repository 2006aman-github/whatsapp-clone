import React, { useState, useEffect, useRef } from "react";
import "./chat.css";
import { useParams } from "react-router-dom";
import db from "../Firebase";
import { useStateValue } from "../StateProvider";
import firebase from "firebase";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import SearchIcon from "@material-ui/icons/Search";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { Avatar, IconButton } from "@material-ui/core";
import SentimentVerySatisfiedIcon from "@material-ui/icons/SentimentVerySatisfied";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import MicIcon from "@material-ui/icons/Mic";
import Pusher from "pusher-js";
import MenuIcon from "@material-ui/icons/Menu";
import { actionTypes } from "../reducer";
import SendIcon from "@material-ui/icons/Send";

const pusher = new Pusher("6e680cc260da21859000", {
  cluster: "ap2",
  authEndpoint: "/",
});

function Chat() {
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState(null);
  const { roomId } = useParams();
  const messagesEndRef = useRef(null);
  const [roomMessages, setRoomMessages] = useState([]);
  const [{ user }, dispatch] = useStateValue();

  useEffect(() => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  });

  useEffect(() => {
    const recieveMessageAudio = new Audio(
      require("../audio/whatsappnotify.mp3")
    );
    if (roomId) {
      db.collection("rooms")
        .doc(roomId)
        .onSnapshot((snap) => {
          setRoom(snap.data());
        });
      db.collection("rooms")
        .doc(roomId)
        .collection("messages")
        .orderBy("timestamp", "asc")
        .onSnapshot((snap) => {
          setRoomMessages(snap.docs.map((doc) => doc.data()));
          recieveMessageAudio.play();
        });
    }
  }, [roomId]);

  const sendMessage = (e) => {
    e.preventDefault();
    db.collection("rooms").doc(roomId).collection("messages").add({
      message: message,
      name: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      UserId: user.uid,
    });
    setMessage("");
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
  };
  const handleOpenSidebar = () => {
    dispatch({
      type: actionTypes.handleSidebarType,
      hideSidebar: {
        open: true,
      },
    });
  };

  return (
    <div className="chat">
      <div className="chat__header">
        <IconButton className="sidebar__menu__icon" size="small">
          <MenuIcon onClick={handleOpenSidebar} />
        </IconButton>
        <Avatar src={room?.roomDP?.url} alt="" />
        <div className="chat__header__info">
          <h3>{room?.RoomName}</h3>
          <span>
            Last Activity..
            <small>
              {roomMessages
                ? new Date(
                    roomMessages[roomMessages.length - 1]?.timestamp?.toDate()
                  ).toUTCString()
                : "..."}
            </small>
          </span>
        </div>
        <div className="chat__headerRight">
          <IconButton className="desktop__only__icon">
            <SearchIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>
      <div className="chat__body">
        {roomMessages.map((message) => (
          <p
            className={`chat__message ${
              message.UserId === user.uid && "chat__sender"
            }`}
          >
            <span className="message__sender">{message.name}</span>
            {message.message}
            <span className="chat__timestamp">
              {new Date(message.timestamp?.toDate()).toUTCString()}
            </span>
          </p>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat__footer">
        <SentimentVerySatisfiedIcon
          className="very__small__mobile__hide"
          style={{ cursor: "pointer", margin: "0px 10px" }}
        />
        <AttachFileIcon
          className="very__small__mobile__hide"
          style={{ margin: "0px 10px" }}
        />
        <form onSubmit={sendMessage} className="message__form">
          <input
            value={message}
            onChange={handleTyping}
            placeholder="Type a message"
            type="text"
            style={{ fontSize: "15px", color: "#3e3e3e", margin: "0px 5px" }}
          />
        </form>
        {message ? (
          <IconButton
            onClick={sendMessage}
            style={{
              margin: "0 5px",

              backgroundColor: "#009688",
              color: "white",
            }}
          >
            <SendIcon />
          </IconButton>
        ) : (
          <IconButton
            style={{
              margin: "0 5px",
              backgroundColor: "#009688",
              color: "white",
            }}
          >
            <MicIcon />
          </IconButton>
        )}
      </div>
    </div>
  );
}

export default Chat;
