import axios from "axios";
import { useEffect, useState } from "react";
import "./conversation.css";

function Conversation({ conversation, currentUser }) {
  const [user, setuser] = useState(null); //friend with conversation
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const CDN = process.env.REACT_APP_CDN_URL;

  useEffect(() => {
    const friendId = conversation.members.find((m) => m !== currentUser._id);
    const getUser = async () => {
      try {
        const res = await axios.get(
          "https://pandsocial.herokuapp.com/api/users?userId=" + friendId
        );
        setuser(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [conversation.members, currentUser]);

  return (
    <div className="conversation">
      <img
        src={
          user?.profilePicture
            ? CDN + user.profilePicture
            : PF + "person/noAvatar.png"
        }
        alt=""
        className="conversationImg"
      />
      <span className="conversationName">{user?.name || user?.username}</span>
    </div>
  );
}

export default Conversation;
