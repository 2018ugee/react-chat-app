import "./home.css";
// import PersonIcon from '@material-ui/icons/Person';
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import { Drawer, Button } from "antd";
import { useState, useEffect } from "react";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";

function Home() {
  const [visible, setvisible] = useState(false);
  const showDrawer = () => {
    setvisible(true);
  };

  const onClose = () => {
    setvisible(false);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <Topbar />
      <div className="homeContainer">
        {/* <Button type="primary" onClick={showDrawer}>
          <KeyboardArrowRightIcon />
        </Button>
        <Drawer
          title="Friends"
          placement="left"
          closable={true}
          onClose={onClose}
          visible={visible}
        >
          <Rightbar />
          <Sidebar />
        </Drawer> */}
        <Sidebar />
        <Feed />
        <Rightbar />
      </div>
    </>
  );
}

export default Home;
