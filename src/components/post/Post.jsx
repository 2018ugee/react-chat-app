import { MoreVert, EmojiEmotions } from "@material-ui/icons";
import "./post.css";
// import {Users} from '../../dummyData'
import { useContext, useEffect, useState, useRef } from "react";
import axios from "axios";
import { format } from "timeago.js";
import { Link, useHistory } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Picker from "emoji-picker-react";
import ThumbUpAltOutlinedIcon from "@material-ui/icons/ThumbUpAltOutlined";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteBorderOutlinedIcon from "@material-ui/icons/FavoriteBorderOutlined";
import FavoriteBorderTwoToneIcon from "@material-ui/icons/FavoriteBorderTwoTone";

function Post({ post }) {
  console.log(post);

  const [like, setlike] = useState(post.likes.length);
  const [isliked, setisliked] = useState(false);
  const [user, setuser] = useState({});
  const [comments, setcomments] = useState([]);
  const [commentBoxOpen, setcommentBoxOpen] = useState(false);
  const [openemoji, setopenemoji] = useState(false);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER; //to append on photos path
  const CDN = process.env.REACT_APP_CDN_URL;
  //   const { user: currentUser } = useContext(AuthContext);
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const history = useHistory();
  const comment = useRef();

  useEffect(() => {
    setisliked(post.likes.includes(currentUser._id));
  }, [currentUser._id, post.likes]);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(
        `https://pandsocial.herokuapp.com/api/users?userId=${post.userId}`
      );
      setuser(res.data);
      console.log(res);
    };
    fetchUser();

    const fetchComments = async () => {
      const res = await axios.get(
        "https://pandsocial.herokuapp.com/api/comment/" + post._id
      );
      setcomments(res.data);
    };
    fetchComments();
  }, [post.userId]);

  const likehandler = async () => {
    try {
      await axios.put(
        "https://pandsocial.herokuapp.com/api/posts/" + post._id + "/like",
        {
          userId: currentUser._id,
        }
      );
    } catch (err) {}
    setlike(isliked ? like - 1 : like + 1);
    setisliked(!isliked);
  };

  const handleComment = async () => {
    const text = comment.current.value;
    const postId = post._id;
    const commentorId = currentUser._id;
    const commentorName = currentUser.name || currentUser.username;
    const data = {
      text: text,
      postId: postId,
      commentorId: commentorId,
      commentorName: commentorName,
    };

    const newComment = { ...data, createdAt: Date.now() };
    setcomments([...comments, newComment]);
    comment.current.value = "";

    try {
      await axios.put("https://pandsocial.herokuapp.com/api/comment", data);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <img
              src={
                user.profilePicture
                  ? CDN + user.profilePicture
                  : PF + "person/noAvatar.png"
              }
              alt=""
              className="postProfileImg"
              onClick={() => {
                history.push(`/profile/${user.username}`);
              }}
            />
            <span className="postUsername">{user.name || user.username}</span>
            <span className="postDate">{format(post.createdAt)}</span>
          </div>
          <div className="postTopRight">
            <MoreVert />
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{post?.desc}</span>
          <img className="postImg" src={CDN + post.img} alt="" />
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            {/* <img
              className="likeIcon"
              onClick={likehandler}
              src={`${PF}like.png`}
              alt=""
            /> */}
            <ThumbUpAltOutlinedIcon
              className="likeIcon"
              onClick={likehandler}
              style={{ color: isliked ? "#1877f2" : null }}
            />
            {/* <img
              className="heartIcon"
              onClick={likehandler}
              src={`${PF}heart.png`}
              alt=""
            /> */}
            {/* <FavoriteBorderTwoToneIcon
              className="heartIcon"
              onClick={likehandler}
              style={{ color: isliked ? "#1877f2" : null }}
            /> */}

            <span className="postLikeCounter">{like}</span>
          </div>
          <div className="postBottomRight">
            <span
              className="postCommentText"
              onClick={() => {
                setcommentBoxOpen(!commentBoxOpen);
                setopenemoji(false);
              }}
            >
              {comments.length ? comments.length : ""} Comments
            </span>
          </div>
        </div>
        {commentBoxOpen && (
          <div className="commentBox">
            <hr className="commentDivider" />
            {comments.map((c) => {
              return (
                <div className="comment">
                  <div className="commentUsernameTime">
                    <span className="commentUsername">{c.commentorName}</span>
                    <span className="commentDate">{format(c.createdAt)}</span>
                  </div>
                  <div className="commentText">{c.text}</div>
                </div>
              );
            })}
            <div className="commentInputBox">
              <input
                className="commentInput"
                type="text"
                placeholder="Add a comment..."
                ref={comment}
              />
              <div className="commentButtonBox">
                <span
                  style={{
                    marginRight: "5px",
                    cursor: "pointer",
                    display: "flex",
                  }}
                  onClick={() => {
                    setopenemoji(!openemoji);
                  }}
                >
                  {/* <img
                    src="/assets/happiness.png"
                    alt=""
                    style={{ height: "25px", width: "25px" }}
                  /> */}
                  <EmojiEmotions
                    // className="shareIcon"
                    style={{ fontSize: "30px", color: "#757577" }}
                  />
                </span>
                <button
                  className="commentInputBoxButton"
                  onClick={() => {
                    handleComment();
                    setopenemoji(!openemoji);
                  }}
                >
                  Comment
                </button>
              </div>
            </div>
            <div className="emojiBox">
              {!!openemoji && (
                <Picker
                  style={{ height: "210px", width: "400px" }}
                  onEmojiClick={(e, emoji) => {
                    //   setnewMessage(newMessage + emoji.emoji);
                    comment.current.value = comment.current.value + emoji.emoji;
                  }}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Post;
