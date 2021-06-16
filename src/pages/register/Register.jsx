import axios from "axios";
import { useRef, useState } from "react";
import { useHistory } from "react-router";
import "./register.css";

function Register() {
  const username = useRef();
  const name = useRef();
  const email = useRef();
  const password = useRef();
  const passwordAgain = useRef();
  const history = useHistory();
  const [isFetching, setisFetching] = useState(false);

  const handleClick = async (e) => {
    e.preventDefault();
    setisFetching(true);
    if (password.current.value !== passwordAgain.current.value) {
      password.current.setCustomValidity("Passwords don't match");
    } else {
      const user = {
        username: username.current.value,
        name: name.current.value,
        email: email.current.value,
        password: password.current.value,
      };
      try {
        const res = await axios.post(
          "https://pandsocial.herokuapp.com/api/auth/register",
          user
        );
        // console.log(res);
        if (res.data === "username") {
          setisFetching(false);
          alert("Username already taken");
        } else if (res.data === "email") {
          setisFetching(false);
          alert("Email already registered");
        } else {
          // history.push("/login");
          // alert("Log in using your credentials");
          localStorage.setItem("user", JSON.stringify(res.data));
          setisFetching(false);
          window.location.reload();
        }
      } catch (err) {
        alert("Server error try again after refreshing");
        console.log(err);
      }
    }
  };

  return (
    <div className="register">
      <div className="registerWrapper">
        <div className="registerLeft">
          <h3 className="registerLogo">P&Social</h3>
          <span className="registerDesc">
            Connect with friends and the world around you on P&Social.
          </span>
        </div>
        <div className="registerRight">
          <div className="registerBox">
            <form onSubmit={handleClick} className="registerForm">
              <input
                required
                ref={username}
                placeholder="Username"
                className="registerInput"
              />
              <input
                required
                ref={name}
                placeholder="Name"
                className="registerInput"
              />
              <input
                required
                ref={email}
                type="email"
                placeholder="Email"
                className="registerInput"
              />
              <input
                required
                ref={password}
                type="password"
                placeholder="Password"
                className="registerInput"
              />
              <input
                required
                ref={passwordAgain}
                type="password"
                placeholder="Confirm Password"
                className="registerInput"
              />
              <button type="submit" className="registerButton">
                Sign Up
              </button>
            </form>
            <button
              className="loginRegisterButton"
              onClick={() => {
                history.push("/login");
              }}
            >
              Log In to Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
