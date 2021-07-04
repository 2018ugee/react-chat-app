import "./message.css";
import { format } from "timeago.js";

function Message({ own, message, userProfileUrl, otherProfileUrl }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const CDN = process.env.REACT_APP_CDN_URL;
  //   console.log(userProfile, otherProfile);
  // if (!userProfileU) {
  //   userProfile = "person/noAvatar.png";
  // }
  // if (!otherProfile) {
  //   otherProfile = "person/noAvatar.png";
  // }
  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        <img
          src={own ? userProfileUrl : otherProfileUrl}
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
