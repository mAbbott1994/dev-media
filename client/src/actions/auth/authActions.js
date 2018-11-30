import axios from "axios";
import setAuthToken from "../../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import { GET_ERRORS, SET_CURRENT_USER } from "../types";

export const registerUser = (userData, history) => dispatch => {
  axios
    .post("/api/authentication/register", userData)
    .then(res => history.push("/login"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

/**
 * Login user
 * Action serves the get users JWT token for accessing private routes
 */

export const loginUser = userData => dispatch => {
  axios
    .post("/api/authentication/login", userData)
    .then(res => {
      const { token } = res.data;

      localStorage.setItem("jwtToken", token);

      //set token to auth header
      setAuthToken(token);

      //decode token
      const decoded = jwt_decode(token);

      //set current user

      dispatch(setCurrentUser(decoded));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};
