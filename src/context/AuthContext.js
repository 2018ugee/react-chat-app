import { createContext, useReducer } from "react";
import AuthReducer from "./AuthReducer";

const INITIAL_STATE = {
  // user: {
  //   _id: "60ba455c7e251f4704f82613",
  //   profilePicture: "person/8.jpg",
  //   coverPicture: "",
  //   followers: ["60ba5a117e251f4704f82614"],
  //   followings: ["60ba5a117e251f4704f82614", "60a2caf73dfe4d04989db8b6"],
  //   isAdmin: false,
  //   username: "pritam_again2",
  //   email: "prit300@gmail.com",
  //   password: "$2b$10$9K9fglAzE.FZW.pXWTXNxeghazdcKsuhM44gB6kwSvVPNwdxMYReu",
  //   createdAt: { $date: { $numberLong: "1622820188385" } },
  //   updatedAt: { $date: { $numberLong: "1623069316371" } },
  //   __v: { $numberInt: "0" },
  //   desc: "Hello My Friends",
  //   relationship: { $numberInt: "2" },
  //   city: "Jamalpur",
  //   from: "Bihar",
  // },
  user: null,
  isFetching: false,
  error: false,
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isFetching: state.isFetching,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
