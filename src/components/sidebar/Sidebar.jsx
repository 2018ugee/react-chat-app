import {
  Bookmark,
  Event,
  Group,
  HelpOutline,
  PlayCircleFilledOutlined,
  RssFeed,
  School,
  WorkOutline,
} from "@material-ui/icons";
import ChatIcon from "@material-ui/icons/Chat";
import CloseFriend from "../closeFriend/CloseFriend";
import "./sidebar.css";
import { Users } from "../../dummyData";
import { useHistory } from "react-router";
import { useState, useEffect } from "react";
import axios from "axios";

function Sidebar() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const CDN = process.env.REACT_APP_CDN_URL;
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const history = useHistory();
  const [otherUsers, setotherUsers] = useState([]);

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const res = await axios.get(
          "https://pandsocial.herokuapp.com/api/users/getAll/" + currentUser._id
        );
        res.data = res.data.filter(
          (other) => !currentUser.followings.includes(other._id)
        );
        setotherUsers(res.data);
      } catch (e) {
        console.log(e);
      }
    };
    getAllUsers();
  }, [currentUser._id]);

  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        {/* <ul className="sidebarList">
          <li
            className="sidebarListItem"
            onClick={() => {
              history.push("/");
            }}
          >
            <RssFeed className="sidebarIcon" />
            <span className="sidearListItemText">Feed</span>
          </li>
          <li
            className="sidebarListItem"
            onClick={() => {
              history.push("/messenger");
            }}
          >
            <ChatIcon className="sidebarIcon" />
            <span className="sidearListItemText">Chats</span>
          </li>
          <li className="sidebarListItem">
            <PlayCircleFilledOutlined className="sidebarIcon" />
            <span className="sidearListItemText">Videos</span>
          </li>
          <li className="sidebarListItem">
            <Group className="sidebarIcon" />
            <span className="sidearListItemText">Groups</span>
          </li>
          <li className="sidebarListItem">
            <Bookmark className="sidebarIcon" />
            <span className="sidearListItemText">Bookmarks</span>
          </li>
          <li className="sidebarListItem">
            <HelpOutline className="sidebarIcon" />
            <span className="sidearListItemText">Questions</span>
          </li>
          <li className="sidebarListItem">
            <WorkOutline className="sidebarIcon" />
            <span className="sidearListItemText">Jobs</span>
          </li>
          <li className="sidebarListItem">
            <Event className="sidebarIcon" />
            <span className="sidearListItemText">Events</span>
          </li>
          <li className="sidebarListItem">
            <School className="sidebarIcon" />
            <span className="sidearListItemText">Courses</span>
          </li>
        </ul>
        <button className="sidebarButton">Show More</button>
        <hr className="sidebarHr" />
        <ul className="sidebarFriendList">
          {Users.map((u) => (
            <CloseFriend key={u.id} user={u} />
          ))}
        </ul> */}
        <h4 className="rightbarTitle">Find Friends</h4>
        <hr style={{ marginBottom: "10px" }} />
        {!!otherUsers.length && (
          <ul className="rightbarFriendList">
            {otherUsers.map((user) => (
              <li
                key={user._id}
                className="rightbarFriend"
                onClick={() => {
                  history.push("/profile/" + user.username);
                }}
              >
                <div className="rightbarProfileImgContainer">
                  <img
                    src={
                      user.profilePicture
                        ? CDN + user.profilePicture
                        : PF + "person/noAvatar.png"
                    }
                    alt=""
                    className="rightbarProfileImg"
                  />
                </div>
                <span className="rightbarUsername">
                  {user.name || user.username}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
