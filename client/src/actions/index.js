import axios from "axios";

import { FETCH_USER, FETCH_SURVEYS } from "./types";

//fetch user instance from MongoDB users collection
export const fetchUser = () => async (dispatch) => {
  const res = await axios.get("/api/current_user");
  dispatch({ type: FETCH_USER, payload: res.data });
};

//send stripe token to backend api which will handle Payments
//with stripe. We are looking to get back from the api
//the same user model as one we get from fetchUser action
//i.e. the user model from MongoDB database. This will also contain data
//regarding credits so can still use it
export const handleToken = (token) => async (dispatch) => {
  //post token to backend server
  const res = await axios.post("/api/stripe", token);
  //the above post request sends the token object to the
  //express route handler for "/api/stripe"
  dispatch({ type: FETCH_USER, payload: res.data });
};

export const submitSurvey = (values, history) => async (dispatch) => {
  const res = await axios.post("/api/surveys", values);
  //dispatch the user model returned from our surveyRoutes handler
  //whenever it receives a post request
  history.push('/surveys');
  dispatch({ type: FETCH_USER, payload: res.data });
};

export const fetchSurveys = () => async (dispatch) => {
  const res = await axios.get("/api/surveys");
  console.log(res)
  dispatch({ type: FETCH_SURVEYS, payload: res.data });
}
