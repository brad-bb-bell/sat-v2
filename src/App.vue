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
      <form class="flex" @submit="login()">
        <ul>
          <li v-for="error in errors" :key="error">{{ error }}</li>
        </ul>
        <div>
          <input
            type="email"
            placeholder="  Email"
            v-model="loginParams.email"
            class="text-black mx-2 my-2 rounded-lg"
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="  Password"
            v-model="loginParams.password"
            class="text-black mx-2 my-2 rounded-lg"
          />
        </div>
        <button type="submit" class="border text-black font-medium bg-green-400 px-8 text-sm mx-2 my-2 rounded-lg">
          Login
        </button>
      </form>
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
    };
  },
  methods: {
    login() {
      console.log("login");
    },
  },
};
</script>
