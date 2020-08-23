import React, { useState, useEffect } from "react";
import "./chat.css";
import { useParams } from "react-router-dom";
import db from "../Firebase";
import { useStateValue } from "../StateProvider";
import firebase from "firebase";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";

function Chat() {
  const [message, setMessage] = useState("");
  const [roomName, setRoomName] = useState("");
  const { roomId } = useParams();
  const [roomMessages, setRoomMessages] = useState([]);
  const [{ user }, dispatch] = useStateValue();
  const [showPicker, setShowPicker] = useState(false);
  const [openSidebar, setOpenSideBar] = useState(false);
  const avatar_list = [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSLCc_TOmmJsOZs0fuYYIstG3I2eSr6Of5-NA&usqp=CAU",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTRt6fi0w-E0pPWxJEKxLxuFHS1LAi9qD3thA&usqp=CAU",
    "https://pbs.twimg.com/media/D-cz5P5UcAAuv39.png",
    "https://www.mandysam.com/img/random.jpg",
  ];

  const on_Click = () => {
    {
      showPicker ? setShowPicker(false) : setShowPicker(true);
    }
  };

  useEffect(() => {
    if (roomId) {
      db.collection("rooms")
        .doc(roomId)
        .onSnapshot((snap) => setRoomName(snap.data().RoomName));
      db.collection("rooms")
        .doc(roomId)
        .collection("messages")
        .orderBy("timestamp", "asc")
        .onSnapshot((snap) =>
          setRoomMessages(snap.docs.map((doc) => doc.data()))
        );
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
  const addEmoji = (e) => {
    setMessage(message + e.native);
  };
  return (
    <div className="chat">
      <div className="chat__header">
        <img
          src={avatar_list[Math.floor(Math.random() * avatar_list.length)]}
          alt=""
          className="chat__avatar"
        />
        <div className="chat__header__info">
          <h3>{roomName}</h3>
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
          <i className="fas fa-search"></i>
          <i className="fas fa-paperclip"></i>
          <i className="fas fa-ellipsis-v"></i>
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
      </div>
      <div className="chat__footer">
        {showPicker ? (
          <Picker
            style={{ position: "absolute", top: "15%", width: "280px" }}
            onSelect={addEmoji}
          />
        ) : null}
        <i
          onClick={on_Click}
          className="far fa-grin-beam"
          aria-hidden="true"
        ></i>
        <form className="message__form">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message"
            type="text"
          />
          <button onClick={sendMessage}>Send Message</button>
        </form>
        <i className="fas fa-microphone"></i>
      </div>
    </div>
  );
}

export default Chat;
