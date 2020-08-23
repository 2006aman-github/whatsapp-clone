import React, { useState, useEffect } from "react";
import "./sidebarchat.css";
import db from "../Firebase";
import { Link } from "react-router-dom";

function SidebarChat({ room_id, addNewChat, room_name }) {
  const [messageList, setMessageList] = useState([]);
  const avatar_list = [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSLCc_TOmmJsOZs0fuYYIstG3I2eSr6Of5-NA&usqp=CAU",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTRt6fi0w-E0pPWxJEKxLxuFHS1LAi9qD3thA&usqp=CAU",
    "https://pbs.twimg.com/media/D-cz5P5UcAAuv39.png",
    "https://www.mandysam.com/img/random.jpg",
  ];

  const createChat = () => {
    const roomName = prompt("Enter the Room name:");
    if (roomName) {
      // do some clever stuff
      db.collection("rooms").add({
        RoomName: roomName,
      });
    }
  };

  useEffect(() => {
    if (room_id) {
      db.collection("rooms")
        .doc(room_id)
        .collection("messages")
        .orderBy("timestamp", "desc")
        .onSnapshot((snap) =>
          setMessageList(snap.docs.map((doc) => doc.data()))
        );
    }
  }, [room_id]);

  return !addNewChat ? (
    <Link to={`/rooms/${room_id}`}>
      <div className="sidebarChat">
        <img
          src={avatar_list[Math.floor(Math.random() * avatar_list.length)]}
          alt=""
          className="sidebarchat__avatar"
        />
        <div className="sidebarchat__info">
          <h2>{room_name}</h2>
          <span>{messageList[0]?.message.slice(0, 15)}...</span>
        </div>
      </div>
    </Link>
  ) : (
    <div onClick={createChat} className="sidebarChat">
      <h2>Add new Chat</h2>
    </div>
  );
}

export default SidebarChat;
