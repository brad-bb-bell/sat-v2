<template>
  <div class="">
    <Container>
      <h1 class="text-center text-xl tracking-widest">🤸 🏋️ 🧘 Simple Activity Tracker 🧘 🏋️ 🤸</h1>
    </Container>

    <Container v-if="!isLoggedIn && !showLogin && !showSignup">
      <div class="text-center">
        <button class="mr-14" @click="showLogin = true">Login</button>
        <button class="ml-14" @click="showSignup = true">Signup</button>
      </div>
    </Container>

    <Container v-if="showSignup">Signup will be here</Container>

    <Container v-if="showLogin">
      <form class="flex" @submit.prevent="login()">
        <ul>
          <!-- errors do not display properly with css -->
          <li v-for="error in errors" :key="error">{{ error }}</li>
        </ul>
        <div>
          <input type="email" placeholder="  Email" v-model="loginParams.email" class="text-black ml-2 my-2 rounded" />
        </div>
        <div>
          <input
            type="password"
            placeholder="  Password"
            v-model="loginParams.password"
            class="text-black ml-2 my-2 rounded"
          />
        </div>
        <button type="submit" class="border text-black font-medium bg-green-400 px-8 text-sm mx-10 my-2 rounded">
          Login
        </button>
      </form>
    </Container>

    <Container v-if="isLoggedIn">
      {{ user.name }}
    </Container>
  </div>
</template>
<script>
import axios from "axios";
import Container from "./components/ContainerBase.vue";
export default {
  components: {
    Container,
  },
  data() {
    return {
      errors: [],
      loginParams: {},
      isLoggedIn: false,
      showLogin: false,
      showSignup: false,
      user: {},
    };
  },
  methods: {
    login() {
      axios.post("/sessions", this.loginParams).then((response) => {
        axios.defaults.headers.common["Authorization"] = "Bearer " + response.data.jwt;
        console.log("response.data", response.data);
        // localStorage.setItem("jwt", response.data.jwt);
        // localStorage.setItem("user_id", response.data.user_id);
        // this.user = response.data;
        // console.log("Login successful");
        // console.log("User: ", this.user);
        // })
        // .catch((error) => {
        //   this.errors = ["Invalid email or password."];
      });
      // this.loginParams = {};
    },
  },
  created() {
    if (localStorage.jwt && localStorage.user_id) {
      this.isLoggedIn = true;
      axios.get("/users/" + localStorage.user_id + ".json").then((response) => {
        this.user = response.data;
        console.log("Current user:", response.data);
      });
    }
  },
};
</script>
