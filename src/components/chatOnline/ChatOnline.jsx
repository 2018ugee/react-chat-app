import axios from "axios";
import { useEffect, useState } from "react";
import "./chatOnline.css";

function ChatOnline({ onlineUsers, currentId, setcurrentChat, conversations }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const CDN = process.env.REACT_APP_CDN_URL;
  const [friends, setfriends] = useState([]);
  const [onlineFriends, setonlineFriends] = useState([]);

  const handleClick = (user) => {
    setcurrentChat(
      conversations.find(
        (c) => c.members.includes(currentId) && c.members.includes(user._id)
      )
    );
  };

  useEffect(() => {
    const getFriends = async () => {
      try {
        const res = await axios.get(
          "https://pandsocial.herokuapp.com/api/users/friends/" + currentId
        );
        setfriends(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getFriends();
  }, [currentId]);

  useEffect(() => {
    setonlineFriends(friends.filter((f) => onlineUsers.includes(f._id)));
  }, [friends, onlineUsers]);

  return (
    <div className="chatOnline">
      <span className="onlineFriendsTop">Online Friends</span>
      <hr style={{ margin: "10px 0 20px 0" }} />
      {onlineFriends.map((f) => (
        <div
          className="chatOnlineFriend"
          onClick={() => {
            handleClick(f);
          }}
        >
          <div className="chatOnlineImgContainer">
            <img
              className="chatOnlineImg"
              src={
                f?.profilePicture
                  ? CDN + f.profilePicture
                  : PF + "person/noAvatar.png"
              }
              alt=""
            />
            <div className="chatOnlineBadge"></div>
          </div>
          <span className="chatOnlineName">{f.name || f.username}</span>
        </div>
      ))}
    </div>
  );
}

export default ChatOnline;
