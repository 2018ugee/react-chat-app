import Post from "../post/Post";
import Share from "../share/Share";
import "./feed.css";
// import {Posts} from '../../dummyData'
import axios from "axios";
import { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import EditRoundedIcon from "@material-ui/icons/EditRounded";
import ImageIcon from "@material-ui/icons/Image";
import PanoramaIcon from "@material-ui/icons/Panorama";
import { Button, Modal, Fade, Backdrop } from "@material-ui/core";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";

function Feed({ username }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const [posts, setposts] = useState([]);
  const name = useRef();
  const email = useRef();
  const password = useRef();
  const desc = useRef();
  const city = useRef();
  const from = useRef();
  const relationship = useRef();
  //   const { user } = useContext(AuthContext);

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const res = username
        ? await axios.get("http://localhost:4000/api/posts/profile/" + username)
        : await axios.get(
            "http://localhost:4000/api/posts/timeline/" + user._id
          );
      setposts(
        res.data.sort((p1, p2) => {
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        })
      );
      //   console.log(res);
    };
    fetchPosts();
    // console.log("feed rendered");
  }, [username, user._id]);

  //uploads profile & cover pic
  const handleUpload = async (file, changeTypeKey) => {
    console.log("called");
    if (file) {
      console.log("update pic");
      const data = new FormData();
      const fileName = Date.now() + file.name;
      data.append("name", fileName);
      data.append("file", file);
      //update profilePicture in database & localstorage
      if (changeTypeKey === "profilePicture") user.profilePicture = fileName;
      else user.coverPicture = fileName;
      localStorage.removeItem("user");
      localStorage.setItem("user", JSON.stringify(user));
      try {
        await axios.put("http://localhost:4000/api/users/" + user._id, {
          [changeTypeKey]: fileName,
          userId: user._id,
        });
        await axios.post("http://localhost:4000/api/upload", data);
        window.location.reload();
      } catch (err) {
        console.log(err);
      }
    }
  };

  //update details of user
  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(name.current);
    // console.log(name.current.value.length);
    // console.log(email.current);
    // console.log(email.current.value.length);
    const data = {
      userId: user._id,
      ...(name.current.value.length && { name: name.current.value }),
      ...(email.current.value.length && { email: email.current.value }),
      ...(password.current.value.length && {
        password: password.current.value,
      }),
      ...(desc.current.value.length && { desc: desc.current.value }),
      ...(city.current.value.length && { city: city.current.value }),
      ...(from.current.value.length && { from: from.current.value }),
      ...(relationship.current.value.length && {
        relationship: relationship.current.value,
      }),
    };

    let newuser = { ...user, ...data };
    const { userId, ...others } = newuser;
    localStorage.removeItem("user");
    localStorage.setItem("user", JSON.stringify(others));
    try {
      await axios.put("http://localhost:4000/api/users/" + user._id, data);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="feed">
      <div className="feedWrapper">
        {username === user.username && (
          <div className="updatebar">
            <div className="updatebarItem">
              <Button
                variant="contained"
                style={{ backgroundColor: "#1872f2", textTransform: "none" }}
                onClick={handleOpen}
                className="updatebarIcon"
              >
                <EditRoundedIcon /> Update Details
              </Button>
            </div>

            <div className="updatebarItem">
              <Button
                variant="contained"
                style={{ backgroundColor: "#1872f2", textTransform: "none" }}
                // onClick={handleOpen}
                className="updatebarIcon"
              >
                <label htmlFor="file1" className="shareOption">
                  <ImageIcon />
                  Update Profile Pic
                  <input
                    style={{ display: "none" }}
                    type="file"
                    id="file1"
                    accept=".png,.jpg,.jpeg"
                    onChange={(e) => {
                      //   setfile(
                      //     (prev) => e.target.files[0],
                      //     (s) => {
                      //       handleUpload("profilePicture");
                      //     }
                      //   );
                      handleUpload(e.target.files[0], "profilePicture");
                    }}
                  />
                </label>
              </Button>
            </div>

            <div className="updatebarItem">
              <Button
                variant="contained"
                style={{ backgroundColor: "#1872f2", textTransform: "none" }}
                // onClick={handleOpen}
                className="updatebarIcon"
              >
                <label htmlFor="file2" className="shareOption">
                  <ImageIcon />
                  Update Cover Pic
                  <input
                    style={{ display: "none" }}
                    type="file"
                    id="file2"
                    accept=".png,.jpg,.jpeg"
                    onChange={(e) => {
                      //   setfile(
                      //     (prev) => e.target.files[0],
                      //     (s) => {
                      //       handleUpload("coverPicture");
                      //     }
                      //   );
                      handleUpload(e.target.files[0], "coverPicture");
                    }}
                  />
                </label>
              </Button>
            </div>
          </div>
        )}
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open}>
            <div className="updateBox" onClick={handleClose}>
              <form
                className="updateForm"
                onClick={(e) => {
                  e.stopPropagation();
                }}
                onSubmit={(e) => handleSubmit(e)}
              >
                <span style={{ display: "flex", alignItems: "center" }}>
                  <ErrorOutlineIcon htmlColor="red" /> Fill only fields to be
                  updated :
                </span>
                <input
                  ref={name}
                  type="text"
                  placeholder="Name"
                  className="updateInput"
                />
                <input
                  ref={email}
                  type="email"
                  placeholder="Email"
                  className="updateInput"
                />
                <input
                  ref={password}
                  type="password"
                  placeholder="Password"
                  className="updateInput"
                />
                <input
                  ref={desc}
                  type="text"
                  placeholder="Description"
                  className="updateInput"
                />
                <input
                  ref={city}
                  type="text"
                  placeholder="City"
                  className="updateInput"
                />
                <input
                  ref={from}
                  type="text"
                  placeholder="From"
                  className="updateInput"
                />
                <input
                  ref={relationship}
                  type="number"
                  placeholder="Relationship (1 or 2)"
                  className="updateInput"
                />
                <button type="submit" className="updateButton">
                  Update Profile
                </button>
              </form>
            </div>
          </Fade>
        </Modal>

        {(!username || username === user.username) && <Share />}
        {posts.map((p) => {
          return <Post key={p._id} post={p} />;
        })}
        {posts.length === 0 ? (
          user.followings.length === 0 ? (
            <span className="noPostsText">
              Follow others to see their posts.
            </span>
          ) : (
            ""
          )
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default Feed;
