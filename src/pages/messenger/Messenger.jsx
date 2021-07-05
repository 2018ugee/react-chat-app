import "./messenger.css";
import Topbar from "../../components/topbar/Topbar";
import Conversation from "../../components/conversation/Conversation";
import Message from "../../components/message/Message";
import ChatOnline from "../../components/chatOnline/ChatOnline";
import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { io } from "socket.io-client";
import Picker from "emoji-picker-react";
import { EmojiEmotions } from "@material-ui/icons";

function Messenger() {
  const [conversations, setconversations] = useState([]);
  const [otherConversations, setotherConversations] = useState([]);
  const [currentChat, setcurrentChat] = useState(null);
  const [messages, setmessages] = useState([]);
  const [newMessage, setnewMessage] = useState("");
  const [arrivalMessage, setarrivalMessage] = useState(null);
  const [onlineUsers, setonlineUsers] = useState([]);
  const [openemoji, setopenemoji] = useState(false);
  const [convFriend, setconvFriend] = useState(null);
  const socket = useRef();
  // const { user } = useContext(AuthContext);
  const user = JSON.parse(localStorage.getItem("user"));
  const CDN = process.env.REACT_APP_CDN_URL;
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const scrollRef = useRef();

  useEffect(() => {
    window.scrollTo(0, 0);

    // socket.current = io("ws://localhost:5000"); //ws=web socket
    socket.current = io("wss://pandsocial-socket-server.herokuapp.com");

    socket.current.emit("addUser", user._id);

    socket.current.on("getUsers", (users) => {
      setonlineUsers(
        user.followings.filter((f) => users.some((u) => u.userId === f))
      );
    });

    socket.current.on("getMessage", (data) => {
      setarrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, [user._id]);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setmessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  // useEffect(() => {
  //   // socket.current.on("welcome",message=>{
  //   //     console.log(message);
  //   // });
  // }, [user._id]);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get(
          "https://pandsocial.herokuapp.com/api/conversation/" + user._id
        );
        setconversations(
          res.data.filter((c) => {
            return user.followings.includes(
              c.members.find((member) => member !== user._id)
            );
          })
        );
        setotherConversations(
          res.data.filter((c) => {
            return !user.followings.includes(
              c.members.find((member) => member !== user._id)
            );
          })
        );
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, [user._id]);
  // console.log(conversations, otherConversations);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get(
          "https://pandsocial.herokuapp.com/api/message/" + currentChat._id
        );
        setmessages(res.data);
        const recieverId = currentChat.members.find(
          (member) => member !== user._id
        );
        const convfrnd = await axios.get(
          "https://pandsocial.herokuapp.com/api/users?userId=" + recieverId
        );
        setconvFriend(convfrnd.data);
      } catch (err) {
        if (currentChat) {
          alert("Error in fetching messeges! Please refresh.");
        }
        console.log(err);
      }
    };
    getMessages();
  }, [currentChat]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setopenemoji(false);
    const message = {
      sender: user._id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    const recieverId = currentChat.members.find(
      (member) => member !== user._id
    );

    socket.current.emit("sendMessage", {
      senderId: user._id,
      recieverId: recieverId,
      text: newMessage,
    });

    try {
      const res = await axios.post(
        "https://pandsocial.herokuapp.com/api/message",
        message
      );
      setmessages([...messages, res.data]);
      setnewMessage("");
    } catch (err) {
      alert("Sending msg failed! try again.");
      console.log(err);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <Topbar />
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            {/* <input
              placeholder="Search for friends"
              type="text"
              className="chatMenuInput"
            /> */}
            {/* {!!conversations.length && (
              <span className="otherFriends">Friends</span>
            )} */}
            <span className="myFriends">Friends</span>
            <hr style={{ margin: "10px 0 20px 0" }} />
            {conversations.length ? (
              conversations.map((c) => (
                <div
                  onClick={() => {
                    setcurrentChat(c);
                  }}
                >
                  <Conversation
                    key={c._id}
                    conversation={c}
                    currentUser={user}
                  />
                </div>
              ))
            ) : (
              <span className="noConversations">Follow someone to chat.</span>
            )}
            {/* <hr style={{ margin: "20px 0px" }} /> */}
            <span className="otherFriends">Others</span>
            <hr style={{ margin: "10px 0 20px 0" }} />
            {!!otherConversations.length &&
              otherConversations.map((c) => (
                <div
                  onClick={() => {
                    setcurrentChat(c);
                  }}
                >
                  <Conversation
                    key={c._id}
                    conversation={c}
                    currentUser={user}
                  />
                </div>
              ))}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            {currentChat ? (
              <>
                <div className="chatBoxTop">
                  {messages?.map((m) => (
                    <div ref={scrollRef}>
                      <Message
                        message={m}
                        own={m.sender === user._id ? true : false}
                        key={m._id}
                        userProfileUrl={
                          user.profilePicture
                            ? CDN + user.profilePicture
                            : PF + "person/noAvatar.png"
                        }
                        otherProfileUrl={
                          convFriend?.profilePicture
                            ? CDN + convFriend.profilePicture
                            : PF + "person/noAvatar.png"
                        }
                      />
                    </div>
                  ))}
                </div>
                <div className="chatBoxBottom">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <textarea
                      className="chatMessageInput"
                      placeholder="write something..."
                      rows="5"
                      cols="50"
                      onChange={(e) => {
                        setnewMessage(e.target.value);
                      }}
                      value={newMessage}
                    ></textarea>
                    {!!openemoji && (
                      <Picker
                        style={{ height: "210px", width: "400px" }}
                        onEmojiClick={(e, emoji) => {
                          setnewMessage(newMessage + emoji.emoji);
                        }}
                      />
                    )}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{ marginBottom: "5px", cursor: "pointer" }}
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
                        style={{ fontSize: "30px", color: "#757577" }}
                      />
                    </span>
                    <button className="chatSubmitButton" onClick={handleSubmit}>
                      Send
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <span className="noConversationText">
                Open a conversation to start a chat.
              </span>
            )}
          </div>
        </div>
        <div className="chatOnline">
          <div className="chatOnlineWrapper">
            <ChatOnline
              onlineUsers={onlineUsers}
              currentId={user._id}
              setcurrentChat={setcurrentChat}
              conversations={conversations}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Messenger;
