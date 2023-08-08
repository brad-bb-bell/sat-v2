<template>
  <Section v-if="!showLogin && !showSignup">
    <div class="grid grid-cols-2 text-xl">
      <button
        class="mx-auto hover:underline hover:decoration-purple-300 hover:underline-offset-4"
        @click="showLogin = true"
      >
        Login
      </button>
      <button
        class="mx-auto hover:underline hover:decoration-purple-300 hover:underline-offset-4"
        @click="showSignup = true"
      >
        Signup
      </button>
    </div>
  </Section>

  <Section v-if="showSignup">
    <form @submit.prevent="signup()">
      <div class="text-center">
        <ul>
          <li v-for="error in errors" :key="error">{{ error }}</li>
        </ul>
      </div>
      <div class="grid grid-cols-2">
        <div class="flex flex-col gap-2 py-2 items-center">
          <div>
            <input type="username" placeholder="Username" v-model="signupParams.name" class="text-black rounded px-1" />
          </div>
          <div>
            <input
              type="email"
              placeholder="Email address"
              v-model="signupParams.email"
              class="text-black rounded px-1"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              v-model="signupParams.password"
              class="text-black rounded px-1"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password confirmation"
              v-model="signupParams.password_confirmation"
              class="text-black rounded px-1"
            />
          </div>
        </div>
        <div class="text-center my-auto">
          <h2 class="text-xl mb-5">New User Signup</h2>
          <button type="submit" class="w-[100px] border text-black font-medium bg-green-400 rounded my-1">
            Submit
          </button>
          <p>
            <button
              @click.prevent="
                this.showSignup = false;
                this.errors = [];
              "
              class="w-[100px] border text-black font-medium bg-gray-400 rounded my-1"
            >
              Back
            </button>
          </p>
        </div>
      </div>
    </form>
  </Section>
</template>
<script>
import axios from "axios";
import Section from "./Section.vue";

export default {
  components: {
    Section,
  },
  data() {
    return {
      showLogin: false,
      showSignup: false,
      errors: [],
      loginParams: {},
      signupParams: {},
    };
  },
  methods: {
    // after signup, the user should be automatically logged in
    signup() {
      axios
        .post("/users.json", this.signupParams)
        .then((response) => {
          if (response && response.status >= 200 && response.status < 300) {
            // this.$emit("login", response.data);
            console.log(response.data);
            this.showSignup = false;
            this.showLogin = true;
          } else {
            this.errors.push(response.data.errors);
          }
        })
        .catch((error) => {
          if (error.response && error.response.data) {
            this.errors.push(error.response.data.errors);
          } else {
            this.errors = ["An unexpected error occurred. Please try again later."];
          }
        })
        .finally(() => {
          this.signupParams = {};
        });
    },
  },
};
</script>
