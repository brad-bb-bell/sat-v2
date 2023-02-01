<template>
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

    <!-- Activities -->
    <Container class="py-2">
      <div v-if="activities.length === 0" class="text-center mb-2">
        Add an activity in the box below and press 'Enter'
      </div>
      <div v-for="activity in activities" :key="activity.id">
        <div
          @click="toggleSelect(activity.id)"
          class="relative bg-gray-700 border-2 border-black my-1 pl-2 hover:bg-gray-600"
          :class="[selectedActivities.includes(activity.id) === true ? 'border border-green-400' : '']"
        >
          {{ activity.name }}
          <span class="absolute inset-y-0 right-2">
            <i
              @click="deleteActivity(activity)"
              class="fa-solid fa-xmark text-gray-400 hover:cursor-pointer hover:text-red-500"
            ></i>
          </span>
        </div>
      </div>
      <div class="">
        <form @submit.prevent="addActivity(newActivityName)">
          <input
            type="text"
            v-model="newActivityName"
            placeholder="Add Activity"
            class="w-full pl-3 text-black border-2 border-black"
          />
        </form>
      </div>
      <Datepicker
        v-model="calendarDate"
        placeholder="Select Date"
        :enableTimePicker="false"
        @update:modelValue="calendarDate"
        autoApply
        dark
        class="mt-1"
      />
    </Container>
  </div>
</template>
<script>
import axios from "axios";
import Container from "./components/ContainerBase.vue";
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
export default {
  components: {
    Container,
    Datepicker,
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
      newActivityName: "",
      calendarDate: "",
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

    deleteActivity(activity) {
      if (confirm("Are you sure you want to permanently remove this activity and all associated Did Its?")) {
        // var deleteName = activity.name;
        var deleteActivityId = activity.id;
        // console.log("didIts length", this.fullDidIts.length);
        // this.fullDidIts.forEach(
        //   (didIt) => {
        //     console.log("forEach");
        //     if (didIt.name === deleteName) {
        //       console.log("delete me", didIt);
        //       var deleteId = didIt.id;
        //       axios.delete("/did_its/" + deleteId + ".json").then((response) => {
        //         console.log("Success,", response.data);
        //         this.didIts = this.didIts.filter((didIt) => didIt.id != deleteId);
        //       });
        //     }
        //   },
        axios
          .delete("/activities/" + deleteActivityId + ".json")
          .then((response) => {
            console.log("Success,", response.data);
            this.activities = this.activities.filter((activity) => activity.id != deleteActivityId);
          })
          .catch((error) => {
            console.log(error.response.data.errors);
          });
        // );
      }
    },
    addActivity(name) {
      const newActivity = {
        user_id: localStorage.user_id,
        name: name,
      };
      axios
        .post("/activities.json", newActivity)
        .then((response) => {
          console.log("Successfully added new activity", response.data);
          this.activities.push(response.data);
        })
        .catch((error) => {
          console.log(error.response.data.errors);
        });
      this.newActivityName = "";
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
    format() {
      const day = this.date.getDate();
      const month = this.date.getMonth() + 1;
      const year = this.date.getFullYear();

      return `${month}/${day}/${year}`;
    },
    showDate(date) {
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      this.calendarDate = `${year}-${month}-${day}`;
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
  // setup() {
  //   const date = ref(new Date());

  //   const format = (date) => {
  //     const day = date.getDate();
  //     const month = date.getMonth() + 1;
  //     const year = date.getFullYear();

  //     return `${month}/${day}/${year}`;
  //   };

  //   return {
  //     date,
  //     format,
  //   };
  // },
};
</script>
