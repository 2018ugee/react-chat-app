import React from "react";
import axios from "axios";
import { useContext, useEffect, useState, useRef } from "react";
import EditRoundedIcon from "@material-ui/icons/EditRounded";
import ImageIcon from "@material-ui/icons/Image";
import PanoramaIcon from "@material-ui/icons/Panorama";
import { Button, Modal, Fade, Backdrop } from "@material-ui/core";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";

function Upload() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [file, setfile] = useState(null);

  useEffect(() => {
    if (file !== null) {
      handleUpload("profilePicture");
    } else {
      console.log("NULL file");
    }
  }, [file]);

  const handleUpload = async (file, changeTypeKey) => {
    if (file) {
      // console.log("update pic");

      const data = new FormData();
      const fileName = Date.now() + file.name;
      console.log(fileName, "filename");
      data.append("name", fileName);
      data.append("file", file);

      try {
        const res = await axios.post("http://localhost:4000/upload", data);
        console.log(res.data);
        setfile(null);

        //update profilePicture in database & localstorage
        if (changeTypeKey === "profilePicture") user.profilePicture = res.data;
        else user.coverPicture = res.data;
        localStorage.removeItem("user");
        localStorage.setItem("user", JSON.stringify(user));

        // update profilePicture on database
        await axios.put(
          "https://pandsocial.herokuapp.com/api/users/" + user._id,
          {
            [changeTypeKey]: res.data,
            userId: user._id,
          }
        );

        window.location.reload();
      } catch (err) {
        console.log(err);
        alert("Something went wrong!! Try again.");
      }
    }
  };
  return (
    <div>
      <div className="updatebar">
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
                  // setfile(e.target.files[0]);
                  handleUpload(e.target.files[0], "profilePicture");
                }}
                onClick={(e) => (e.target.value = "")}
              />
            </label>
          </Button>
        </div>
        <img
          src={
            process.env.REACT_APP_CDN_URL +
            "1625417293/test_images/1625417288914heart.png"
          }
          alt=""
        />
      </div>
    </div>
  );
}

export default Upload;
