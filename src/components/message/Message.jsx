import "./message.css";
import { format } from "timeago.js";

function Message({ own, message, userProfile, otherProfile }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  //   console.log(userProfile, otherProfile);
  if (!userProfile) {
    userProfile = "person/noAvatar.png";
  }
  if (!otherProfile) {
    otherProfile = "person/noAvatar.png";
  }
  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        <img
          src={own ? PF + userProfile : PF + otherProfile}
          alt=""
          className="messageImg"
        />
        <p className="messageText">{message.text}</p>
      </div>
      <div className="messageBottom">{format(message.createdAt)}</div>
    </div>
  );
}

export default Message;
