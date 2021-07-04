import React, { useContext } from "react";
import "./topbar.css";
import {
  Search,
  Person,
  Chat,
  Notifications,
  ExitToApp,
} from "@material-ui/icons";
import HomeRoundedIcon from "@material-ui/icons/HomeRounded";
import TimelineRoundedIcon from "@material-ui/icons/TimelineRounded";
import { Link, useHistory } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

function Topbar() {
  //   const { user } = useContext(AuthContext);
  const user = JSON.parse(localStorage.getItem("user"));
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const CDN = process.env.REACT_APP_CDN_URL;
  const history = useHistory();

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        {/* <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">PnuSocial</span>
        </Link> */}
        <span
          className="logo"
          onClick={() => {
            history.push("/");
          }}
        >
          P&Social
        </span>
      </div>
      <div className="topbarCenter">
        <div className="searchbar">
          <Search className="searchIcon" />
          <input
            placeholder="Search for friends, post or video"
            className="searchInput"
          />
        </div>
      </div>
      <div className="topbarRight">
        <div className="topbarLinks"></div>
        <div className="topbarIcons">
          <div
            className="topbarIconItem"
            onClick={() => {
              history.push("/");
            }}
          >
            <HomeRoundedIcon />
          </div>
          <div
            className="topbarIconItem"
            onClick={() => {
              history.push("/messenger");
            }}
          >
            <Chat />
            {/* <span className="topbarIconBadge">1</span> */}
          </div>
          <div
            className="topbarIconItem"
            onClick={() => {
              history.push(`/profile/${user.username}`);
            }}
          >
            {/* Timeline */}
            <TimelineRoundedIcon />
          </div>
          <div className="topbarIconItem">
            <Person />
            {/* <span className="topbarIconBadge">1</span> */}
          </div>
          <div className="topbarIconItem">
            <Notifications />
            {/* <span className="topbarIconBadge">1</span> */}
          </div>
        </div>
        {/* <Link to={`/profile/${user.username}`}>
          <img
            src={
              user.profilePicture
                ? PF + user.profilePicture
                : PF + "/person/noAvatar.png"
            }
            alt=""
            className="topbarImg"
          />
        </Link> */}
        <img
          src={
            user?.profilePicture
              ? CDN + user.profilePicture
              : PF + "/person/noAvatar.png"
          }
          alt=""
          className="topbarImg"
          onClick={() => {
            history.push(`/profile/${user.username}`);
          }}
        />
        <ExitToApp
          onClick={() => {
            handleLogout();
          }}
          style={{ cursor: "pointer", marginRight: "20px" }}
        />
      </div>
    </div>
  );
}

export default Topbar;
