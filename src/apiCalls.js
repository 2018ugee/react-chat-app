import axios from "axios";
import { useHistory } from "react-router";

export const loginCall = async (userCredential, dispatch) => {
  dispatch({ type: "LOGIN_START" });
  try {
    const res = await axios.post(
      "http://localhost:4000/api/auth/login",
      userCredential
    );
    localStorage.setItem("user", JSON.stringify(res.data));
    dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
    return true;
  } catch (err) {
    dispatch({ type: "LOGIN_FAILURE", payload: err });
    return false;
  }
};
