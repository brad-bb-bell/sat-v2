<template>
  <div class="">
    <Container>
      <h1 class="text-center text-xl tracking-widest">🤸 🏋️ 🧘 Simple Activity Tracker 🧘 🏋️ 🤸</h1>
    </Container>
    <Container v-if="!isLoggedIn">
      <div class="text-center">
        <button class="mr-14" @click="">Login</button>
        <button class="ml-14" @click="">Signup</button>
      </div>
      <!-- <form @submit="login()">
        <ul>
          <li v-for="error in errors" :key="error">{{ error }}</li>
        </ul>
        <div>
          <input type="email" placeholder="Email" v-model="loginParams.email" />
        </div>
        <div>
          <input type="password" placeholder="Password" v-model="loginParams.password" />
        </div>
        <input type="submit" value="Login" />
      </form> -->
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
    };
  },
  methods: {
    login() {
      console.log("login");
    },
  },
};
</script>
