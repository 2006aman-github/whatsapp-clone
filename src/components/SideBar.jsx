import React, { useEffect, useState, useLayoutEffect } from "react";
import "./sidebar.css";
import SidebarChat from "./SidebarChat";
import db from "../Firebase";
import { useStateValue } from "../StateProvider";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import CommentIcon from "@material-ui/icons/Comment";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { Avatar, Drawer, IconButton } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import { actionTypes } from "../reducer";
import { getWindowDimensions } from "../utils";

function SideBar() {
  const [rooms, setRooms] = useState([]);
  const [{ user, hideSidebar }, dispatch] = useStateValue();

  // window.addEventListener("resize", handleResize);

  useEffect(() => {
    const { width } = getWindowDimensions();
    if (width <= 670) {
      dispatch({
        type: actionTypes.handleSidebarType,
        hideSidebar: {
          open: false,
        },
      });
    }
    window.addEventListener("resize", () => {
      let { width } = getWindowDimensions();
      if (width <= 670) {
        dispatch({
          type: actionTypes.handleSidebarType,
          hideSidebar: {
            open: false,
          },
        });
      } else {
        dispatch({
          type: actionTypes.handleSidebarType,
          hideSidebar: null,
        });
      }
    });

    // db stuff here
    const unsubscribe = db.collection("rooms").onSnapshot((snapshot) =>
      setRooms(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      )
    );
    return () => {
      unsubscribe();
      window.removeEventListener("resize", () => {
        getWindowDimensions();
      });
    };
  }, []);

  return (
    <>
      {hideSidebar ? (
        <Drawer
          anchor={"left"}
          open={hideSidebar?.open}
          onClose={() => {
            dispatch({
              type: actionTypes.handleSidebarType,
              hideSidebar: {
                open: false,
              },
            });
          }}
        >
          <div className="sidebar">
            <div id="side-bar" className="sidebar__body">
              <div className="sidebar__header">
                {/* <Avatar /> */}
                <Avatar src={user?.photoURL} alt="hello" />
                <div className="headerIcons">
                  <IconButton>
                    <DonutLargeIcon />
                  </IconButton>
                  <IconButton>
                    <CommentIcon />
                  </IconButton>
                  <IconButton>
                    <MoreVertIcon />
                  </IconButton>
                </div>
              </div>
              <div className="sidebar__searchBar">
                <div className="searchContainer">
                  <SearchIcon />
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
                    roomId={room.id}
                    roomName={room.data.RoomName}
                    roomDP={room?.data?.roomDP?.url}
                  ></SidebarChat>
                ))}
                {}
              </div>
            </div>
          </div>
        </Drawer>
      ) : (
        <div className="sidebar">
          <div id="side-bar" className="sidebar__body">
            <div className="sidebar__header">
              {/* <Avatar /> */}
              <Avatar src={user?.photoURL} alt="hello" />
              <div className="headerIcons">
                <IconButton>
                  <DonutLargeIcon />
                </IconButton>
                <IconButton>
                  <CommentIcon />
                </IconButton>
                <IconButton>
                  <MoreVertIcon />
                </IconButton>
              </div>
            </div>
            <div className="sidebar__searchBar">
              <div className="searchContainer">
                <SearchIcon />
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
                  roomId={room.id}
                  roomName={room.data.RoomName}
                  roomDP={room?.data?.roomDP?.url}
                ></SidebarChat>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SideBar;
