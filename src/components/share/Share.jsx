import "./share.css";
import PermMediaIcon from "@material-ui/icons/PermMedia";
import { Label, Room, EmojiEmotions, Cancel } from "@material-ui/icons";
import { Button } from "@material-ui/core";
import { useContext, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

function Share() {
  // const {user} = useContext(AuthContext);
  const user = JSON.parse(localStorage.getItem("user"));
  //   console.log(user, "storage");
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const desc = useRef();
  const [file, setfile] = useState(null);

  const submitHandler = async (e) => {
    e.preventDefault();
    const newPost = {
      userId: user._id,
      desc: desc.current.value,
    };
    if (file) {
      const data = new FormData();
      const fileName = Date.now() + file.name;
      data.append("name", fileName);
      data.append("file", file);
      newPost.img = fileName;
      try {
        await axios.post("http://localhost:4000/api/upload", data);
      } catch (err) {
        console.log(err);
      }
    }

    try {
      await axios.post("http://localhost:4000/api/posts", newPost);
      window.location.reload();
    } catch (err) {}
  };

  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <img
            src={
              user.profilePicture
                ? PF + user.profilePicture
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
            Share
          </button>
        </form>
      </div>
    </div>
  );
}

export default Share;
