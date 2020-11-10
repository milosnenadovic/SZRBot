import axios from "axios";

const KEY = "AIzaSyCO6It_BfimiA3jw3IBEAn3cxTx2UhJS1k";

export const API_DEFAULT_PARAMS = {
  part: "snippet",
  maxResults: 5,
  key: KEY,
};

export default axios.create({
  baseURL: "https://www.googleapis.com/youtube/v3",
});
