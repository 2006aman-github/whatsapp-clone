import React, { useEffect, useState, useLayoutEffect } from "react";
import "./sidebar.css";
import SidebarChat from "./SidebarChat";
import db from "../Firebase";
import { useStateValue } from "../StateProvider";

function SideBar() {
  const [rooms, setRooms] = useState([]);
  const [{ user }, dispatch] = useStateValue();

  const unsubscribe = useEffect(() => {
    db.collection("rooms").onSnapshot((snapshot) =>
      setRooms(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      )
    );
    return () => {
      unsubscribe();
    };
  }, []);

  const openSidebar = () => {
    let sidebar = document.getElementById("side-bar");
    sidebar.style.width = "300px";
    sidebar.style.display = "flex";
    sidebar.style.flexDirection = "column";
    sidebar.style.transition = "0.5s";
    sidebar.style.height = "100%";
  };
  const closeSidebar = () => {
    let sidebar = document.getElementById("side-bar");
    let scr_wid = window.innerWidth;
    sidebar.style.transition = "0.5s";
    sidebar.style.display = "none";
  };

  return (
    <div className="sidebar">
      <i onClick={openSidebar} className="fas fa-sliders"></i>
      <div id="side-bar" className="sidebar__body">
        <span onClick={closeSidebar} className="close-nav-btn">
          &times;
        </span>
        <div className="sidebar__header">
          {/* <Avatar /> */}
          <img src={user?.photoURL} alt="hello" className="myAvatar" />
          <div className="headerIcons">
            <i className="fas fa-circle"></i>
            <i className="fas fa-comment-alt"></i>
            <i className="fas fa-ellipsis-v"></i>
          </div>
        </div>
        <div className="sidebar__searchBar">
          <div className="searchContainer">
            <i className="fas fa-search"></i>
            <input
              placeholder="Search or start new chat"
              type="text"
              name=""
              id=""
            />
          </div>
        </div>
        <div className="sidebar__chats">
          <SidebarChat addNewChat />
          {rooms.map((room) => (
            <SidebarChat
              key={room.id}
              room_id={room.id}
              room_name={room.data.RoomName}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default SideBar;
