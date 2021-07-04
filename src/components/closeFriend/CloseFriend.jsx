import "./closeFriend.css";

function CloseFriend({ user }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER; //to append on photos path
  const CDN = process.env.REACT_APP_CDN_URL;
  return (
    <li className="sidebarFriend">
      <img
        src={CDN + user.profilePicture}
        alt=""
        className="sidebarFriendImg"
      />
      <span className="sidebarFriendName">{user.name || user.username}</span>
    </li>
  );
}

export default CloseFriend;
