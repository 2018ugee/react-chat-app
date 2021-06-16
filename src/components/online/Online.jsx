import "./online.css";

function Online({ user }) {
  // console.log(user,"@@");
  const PF = process.env.REACT_APP_PUBLIC_FOLDER; //to append on photos path
  return (
    <li className="rightbarFriend">
      <div className="rightbarProfileImgContainer">
        <img
          src={PF + user.profilePicture}
          alt=""
          className="rightbarProfileImg"
        />
        <span className="RightbarOnline"></span>
      </div>
      <span className="rightbarUsername">{user.name || user.username}</span>
    </li>
  );
}

export default Online;
