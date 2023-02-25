import { createApp } from "vue";
import App from "./App.vue";
import axios from "axios";
import "./input.css";

import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

// uncomment line below to use the dev server
// axios.defaults.baseURL = process.env.NODE_ENV === "development" ? "http://localhost:3000" : "/";

// this has not been tested -> chatgpt suggestion
// axios.defaults.baseURL = process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://sat-api-v2.herokuapp.com";

// uncomment line below to use the production server
axios.defaults.baseURL = "https://sat-api-v2.herokuapp.com/";

var jwt = localStorage.getItem("jwt");
if (jwt) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;
}

createApp(App).mount("#app");
