import "./rightbar.css";
import { Users } from "../../dummyData";
import Online from "../online/Online";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Add, Remove } from "@material-ui/icons";
import { CircularProgress } from "@material-ui/core";

function Rightbar({ user }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER; //to append on photos path
  const CDN = process.env.REACT_APP_CDN_URL;
  // const [friends,setfriends] = useState([]);
  //   const { user: currentUser, dispatch } = useContext(AuthContext);
  const { dispatch } = useContext(AuthContext);
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const history = useHistory();

  const HomeRightbar = () => {
    // const [otherUsers, setotherUsers] = useState([]);
    const [friends, setfriends] = useState([]);
    useEffect(() => {
      //   const getAllUsers = async () => {
      //     try {
      //       const res = await axios.get("/users/getAll/" + currentUser._id);
      //       res.data = res.data.filter(
      //         (other) => !currentUser.followings.includes(other._id)
      //       );
      //       setotherUsers(res.data);
      //     } catch (e) {
      //       console.log(e);
      //     }
      //   };
      const getFriends = async () => {
        try {
          const friendList = await axios.get(
            "https://pandsocial.herokuapp.com/api/users/friends/" +
              currentUser._id
          );
          setfriends(friendList.data);
        } catch (err) {
          console.log(err);
        }
      };
      getFriends();
      //   getAllUsers();
    }, [currentUser._id]);

    return (
      <>
        {/* <div className="birthdayContainer">
          <img src={`${PF}gift.png`} alt="" className="birthdayImg" />
          <span className="birthdayText">
            <b>Pola Foster</b> and <b>3 others </b>have birthday today
          </span>
        </div> */}
        {/* <img src={`${PF}ad.jpg`} alt="" className="rightbarAd" /> */}

        <h4 className="rightbarTitle">Friends</h4>
        <hr style={{ marginBottom: "10px" }} />
        {!!friends.length && (
          <ul className="rightbarFriendList">
            {/* {Users.map((u) => (
              <Online key={u.id} user={u} />
            ))} */}
            {friends.map((user) => (
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

        {/* <hr style={{ margin: "20px 0" }} /> */}

        {/* {!!otherUsers.length && <h4 className="rightbarTitle">Find Friends</h4>}
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
                        ? PF + user.profilePicture
                        : PF + "person/noAvatar.png"
                    }
                    alt=""
                    className="rightbarProfileImg"
                  />
                </div>
                <span className="rightbarUsername">{user.username}</span>
              </li>
            ))}
          </ul>
        )} */}
      </>
    );
  };
  const ProfileRightbar = () => {
    // console.log(user,"rightBar user");
    const [friends, setfriends] = useState([]);
    const [followed, setfollowed] = useState(
      currentUser.followings.includes(user._id)
    );
    const [isFetching, setisFetching] = useState(false);

    useEffect(() => {
      const getFriends = async () => {
        try {
          const friendList = await axios.get(
            "https://pandsocial.herokuapp.com/api/users/friends/" + user._id
          );
          setfriends(friendList.data);
        } catch (err) {
          console.log(err);
        }
      };
      getFriends();
    }, []);

    const handleClick = async () => {
      setisFetching(true);
      try {
        if (followed) {
          await axios.put(
            "https://pandsocial.herokuapp.com/api/users/" +
              user._id +
              "/unfollow",
            {
              userId: currentUser._id,
            }
          );

          currentUser.followings = currentUser.followings.filter(
            (id) => id !== user._id
          );
          localStorage.removeItem("user");
          localStorage.setItem("user", JSON.stringify(currentUser));
          //as state is refreshed so don't dispatch
          //   dispatch({ type: "UNFOLLOW", payload: user._id });
        } else {
          await axios.put(
            "https://pandsocial.herokuapp.com/api/users/" +
              user._id +
              "/follow",
            {
              userId: currentUser._id,
            }
          );

          //make new conversation if already not b/w these users
          let res = null;
          try {
            res = await axios.post(
              "https://pandsocial.herokuapp.com/api/conversation",
              {
                senderId: currentUser._id,
                recieverId: user._id,
              }
            );
          } catch (err) {
            console.log(err, "error in creating new conversation after follow");
            console.log(res);
          }

          currentUser.followings.push(user._id);
          localStorage.removeItem("user");
          localStorage.setItem("user", JSON.stringify(currentUser));
          //as state is refreshed so don't dispatch
          //   dispatch({ type: "FOLLOW", payload: user._id });
        }
        setfollowed(!followed);
      } catch (err) {
        console.log(err);
      }
      setisFetching(false);
      // setfollowed(!followed);
    };
    return (
      <>
        {user.username !== currentUser.username && (
          <button className="rightbarFollowButton" onClick={handleClick}>
            {isFetching ? (
              <CircularProgress color="white" size="20px" />
            ) : followed ? (
              "Unfollow"
            ) : (
              "Follow"
            )}
            {followed ? <Remove /> : <Add />}
          </button>
        )}
        <h4 className="rightbarTitle">User Information</h4>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">City:</span>
            <span className="rightbarInfoValue">{user.city}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">From:</span>
            <span className="rightbarInfoValue">{user.from}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Relationship:</span>
            <span className="rightbarInfoValue">
              {user.relationship === 1
                ? "Single"
                : user.relationship === 2
                ? "Married"
                : ""}
            </span>
          </div>
        </div>
        {!!friends.length && <h4 className="rightbarTitle">User Friends</h4>}
        <div className="rightbarFollowings">
          {friends.map((friend) => {
            return (
              <>
                {/* <Link to={"/profile/"+friend.username}style={{textDecoration:"none"}}>
                        <div key={friend._id} className="rightbarFollowing">
                            <img src={friend.profilePicture ? PF+friend.profilePicture : PF+"person/noAvatar.png"} alt="" className="rightbarFollowingImg" />
                            <span className="rightbarFollowingName">{friend.username}</span>
                        </div>
                    </Link> */}
                <div
                  key={friend._id}
                  className="rightbarFollowing"
                  onClick={() => {
                    history.push("/profile/" + friend.username);
                  }}
                >
                  <img
                    src={
                      friend.profilePicture
                        ? CDN + friend.profilePicture
                        : PF + "person/noAvatar.png"
                    }
                    alt=""
                    className="rightbarFollowingImg"
                  />
                  <span className="rightbarFollowingName">
                    {friend.name || friend.username}
                  </span>
                </div>
              </>
            );
          })}
        </div>
      </>
    );
  };
  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {user ? <ProfileRightbar /> : <HomeRightbar />}
      </div>
    </div>
  );
}

export default Rightbar;
