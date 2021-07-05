import "./profile.css";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router";

function Profile() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER; //to append on photos path
  const CDN = process.env.REACT_APP_CDN_URL;
  const [user, setuser] = useState({});
  const username = useParams().username;
  // console.log(params,"useParams");

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `https://pandsocial.herokuapp.com/api/users?username=${username}`
        );
        setuser(res.data);
        console.log(res.data.profilePicture);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUser();
  }, [username]);

  return (
    <>
      <Topbar />
      <div className="profile">
        <Sidebar user={user} />
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              <img
                src={
                  user.coverPicture
                    ? CDN + user.coverPicture
                    : PF + "person/noCover.png"
                }
                alt=""
                className="profileCoverImg"
              />
              <img
                src={
                  user.profilePicture
                    ? CDN + user.profilePicture
                    : PF + "person/noAvatar.png"
                }
                alt=""
                className="profileUserImg"
              />
            </div>
          </div>
          <div className="profileInfo">
            <h4 className="profileInfoName">{user.name || user.username}</h4>
            <span className="profileInfoDesc">{user.desc}</span>
          </div>
          <div className="profileRightBottom">
            <Feed username={username} />
            <Rightbar user={user} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
