import "./share.css";
import PermMediaIcon from "@material-ui/icons/PermMedia";
import { Label, Room, EmojiEmotions, Cancel } from "@material-ui/icons";
import { Button } from "@material-ui/core";
import { useContext, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { CircularProgress } from "@material-ui/core";

function Share() {
  // const {user} = useContext(AuthContext);
  const user = JSON.parse(localStorage.getItem("user"));
  //   console.log(user, "storage");
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const CDN = process.env.REACT_APP_CDN_URL;
  const desc = useRef();
  const [file, setfile] = useState(null);
  const [isPosting, setisPosting] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setisPosting(true);
    const newPost = {
      userId: user._id,
      desc: desc.current.value,
    };
    if (file) {
      const data = new FormData();
      const fileName = Date.now() + file.name;
      data.append("name", fileName);
      data.append("file", file);
      // newPost.img = fileName;
      try {
        // upload to cdn from api and returns new url of image
        const res = await axios.post(
          "https://pandsocial.herokuapp.com/api/upload",
          data
        );
        newPost.img = res.data;
      } catch (err) {
        console.log(err);
        alert("Failed to upload image. Try again!");
        setisPosting(false);
        return;
      }
    }

    try {
      await axios.post("https://pandsocial.herokuapp.com/api/posts", newPost);
      window.location.reload();
    } catch (err) {
      console.log(err);
      alert("Failed to upload post. Try again!");
    }
    setisPosting(false);
  };

  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <img
            src={
              user.profilePicture
                ? CDN + user.profilePicture
                : PF + "person/noAvatar.png"
            }
            alt=""
            className="shareProfileImg"
          />
          <input
            ref={desc}
            placeholder={
              "What's in your mind " + user.name || user.username + "?"
            }
            className="shareInput"
          />
        </div>
        <hr className="shareHr" />
        {file && (
          <div className="shareImgContainer">
            <img src={URL.createObjectURL(file)} alt="" className="shareImg" />
            <Cancel className="shareCancelling" onClick={() => setfile(null)} />
          </div>
        )}
        <form onSubmit={submitHandler} className="shareBottom">
          <div className="shareOptions">
            <label htmlFor="file" className="shareOption">
              <PermMediaIcon htmlColor="tomato" className="shareIcon" />
              <span className="shareOptionText">Photo or Video</span>
              <input
                style={{ display: "none" }}
                type="file"
                id="file"
                accept=".png,.jpg,.jpeg"
                onChange={(e) => setfile(e.target.files[0])}
              />
            </label>
            <div className="shareOption shareOptionTag">
              <Label htmlColor="blue" className="shareIcon" />
              <span className="shareOptionText">Tag</span>
            </div>
            <div className="shareOption shareOptionLocation">
              <Room htmlColor="green" className="shareIcon" />
              <span className="shareOptionText">Location</span>
            </div>
            <div className="shareOption shareOptionEmoji">
              <EmojiEmotions htmlColor="goldenrod" className="shareIcon" />
              <span className="shareOptionText">Feelings</span>
            </div>
          </div>
          <button type="submit" className="shareButton">
            {isPosting ? (
              <CircularProgress color="white" size="20px" />
            ) : (
              "Share"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Share;
