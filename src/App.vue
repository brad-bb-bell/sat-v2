<template>
  <div class="">
    <Container>
      <h1 class="text-center text-xl tracking-widest">🤸 🏋️ 🧘 Simple Activity Tracker 🧘 🏋️ 🤸</h1>
    </Container>

    <!-- Login or Signup -->
    <Container v-if="!isLoggedIn && !showLogin && !showSignup">
      <div class="grid grid-cols-2">
        <button class="mx-auto" @click="showLogin = true">Login</button>
        <button class="mx-auto" @click="showSignup = true">Signup</button>
      </div>
    </Container>

    <!-- Signup -->
    <Container v-if="showSignup">
      <form @submit.prevent="signup()">
        <div class="text-center">
          <ul>
            <li v-for="error in errors" :key="error">{{ error }}</li>
          </ul>
        </div>
        <div class="grid grid-cols-2">
          <div class="flex flex-col gap-2 py-2 items-center">
            <div>
              <input
                type="username"
                placeholder="Username"
                v-model="signupParams.name"
                class="text-black rounded px-1"
              />
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
            <h2>New User Signup</h2>
            <button type="submit" class="w-[100px] border text-black font-medium bg-green-400 text-sm rounded my-1">
              Submit
            </button>
            <p>
              <button
                @click.prevent="
                  this.showSignup = false;
                  this.errors = [];
                "
                class="w-[100px] border text-black font-medium bg-gray-400 text-sm rounded my-1"
              >
                Back
              </button>
            </p>
          </div>
        </div>
      </form>
    </Container>

    <!-- Login -->
    <Container v-if="showLogin">
      <form @submit.prevent="login()">
        <div class="text-center">
          <ul>
            <li v-for="error in errors" :key="error">{{ error }}</li>
          </ul>
        </div>
        <div class="grid grid-cols-2">
          <div class="flex flex-col gap-2 my-2 items-center">
            <div>
              <input type="email" placeholder="Email" v-model="loginParams.email" class="text-black rounded px-1" />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                v-model="loginParams.password"
                class="text-black rounded px-1"
              />
            </div>
          </div>

          <div class="text-center my-auto">
            <button type="submit" class="border text-black font-medium bg-green-400 px-8 text-sm mx-10 my-1 rounded">
              Login
            </button>
            <p>
              <button
                @click.prevent="
                  this.showLogin = false;
                  this.errors = [];
                "
                class="border text-black font-medium bg-gray-400 px-8 text-sm mx-10 my-1 rounded"
              >
                Back
              </button>
            </p>
          </div>
        </div>
      </form>
    </Container>

    <!-- Successfully Logged In -->
    <div v-if="isLoggedIn">
      <Container class="grid grid-cols-2">
        <div class="mx-auto">
          {{ user.name }}
        </div>
        <div class="mx-auto">
          <button @click="logout">Logout</button>
        </div>
      </Container>

      <Container class="py-2">
        <div v-for="activity in activities" :key="activity.id">
          <div
            @click="toggleSelect(activity.id)"
            class="relative bg-gray-700 border-2 border-black my-1 pl-2"
            :class="[selectedActivities.includes(activity.id) === true ? 'border border-green-400' : '']"
          >
            {{ activity.name }}
            <span class="absolute inset-y-0 right-2">
              <i
                @click="deleteActivity(activity.id)"
                class="fa-solid fa-xmark text-red-400 hover:cursor-pointer hover:text-red-600"
              ></i>
            </span>
          </div>
        </div>
      </Container>
    </div>
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
      signupParams: {},
      isLoggedIn: false,
      showLogin: false,
      showSignup: false,
      user: {},
      activities: [],
      selectedActivities: [],
    };
  },
  methods: {
    login() {
      axios
        .post("/sessions.json", this.loginParams)
        .then((response) => {
          axios.defaults.headers.common["Authorization"] = "Bearer " + response.data.jwt;
          localStorage.setItem("jwt", response.data.jwt);
          localStorage.setItem("user_id", response.data.id);
          this.user = response.data;
          this.activities = this.user.activities;
          console.log("Login successful");
          console.log("User: ", this.user);
          this.loginParams = {};
          this.showLogin = false;
          this.isLoggedIn = true;
          this.errors = [];
        })
        .catch((error) => {
          console.log(error.response);
          this.errors = ["Invalid email or password."];
          this.loginParams = {};
        });
    },
    logout() {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("jwt");
      localStorage.removeItem("user_id");
      this.isLoggedIn = false;
      console.log("Logout successful");
    },
    signup() {
      axios
        .post("/users.json", this.signupParams)
        .then((response) => {
          console.log(response.data);
          this.signupParams = {};
          this.showSignup = false;
          this.showLogin = true;
        })
        .catch((error) => {
          this.errors = error.response.data.errors;
          this.signupParams = {};
        });
    },
    deleteActivity(id) {
      console.log("Activity with ID " + id + " will be deleted");
    },
    toggleSelect(id) {
      if (this.selectedActivities.includes(id) === false) {
        this.selectedActivities.push(id);
      } else {
        var index = this.selectedActivities.indexOf(id);
        if (index !== -1) {
          this.selectedActivities.splice(index, 1);
        }
      }
    },
  },
  created() {
    if (localStorage.jwt && localStorage.user_id && localStorage.user_id != undefined) {
      this.isLoggedIn = true;
      axios.get("/users/" + localStorage.user_id + ".json").then((response) => {
        this.user = response.data;
        this.activities = this.user.activities;
        console.log("Current user:", response.data);
      });
    }
  },
};
</script>
