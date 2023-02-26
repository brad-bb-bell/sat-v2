<template>
  <Container class="border-transparent bg-gradient-to-br from-purple-300 to-purple-500">
    <h1 class="text-center text-xl tracking-widest">Simple Activity Tracker</h1>
  </Container>

  <!-- Login or Signup -->
  <Container v-if="!isLoggedIn && !showLogin && !showSignup">
    <div class="grid grid-cols-2 text-xl">
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
          <h2 class="text-xl">New User Signup</h2>
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
  </Container>

  <!-- Login -->
  <Container v-if="showLogin">
    <form @submit.prevent="login()" class="">
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
          <button type="submit" class="border text-black font-medium bg-green-400 px-8 mx-10 my-1 rounded">
            Login
          </button>
          <p>
            <button
              @click.prevent="
                this.showLogin = false;
                this.errors = [];
              "
              class="border text-black font-medium bg-gray-400 px-8 mx-10 my-1 rounded"
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
    <Container class="text-xl grid grid-cols-2">
      <div class="mx-auto">
        {{ user.name }}
      </div>
      <div class="mx-auto">
        <button @click="logout">Logout</button>
      </div>
    </Container>

    <!-- Activities -->
    <Container>
      <div v-if="activities.length == 0" class="text-center mb-2">
        Add an activity in the box below and press 'Enter'
      </div>
      <div v-else v-for="activity in activities" :key="activity.id">
        <div
          @click="toggleSelect(activity.id)"
          class="relative text-xl bg-gray-700 border-2 border-black my-1 pl-2 hover:bg-gray-600"
          :class="[selectedActivities.includes(activity.id) === true ? 'border border-green-400' : '']"
        >
          {{ activity.name }}
          <span class="absolute inset-y-0 right-2">
            <i
              @click.stop="deleteActivity(activity)"
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
            placeholder="Add New Activity"
            class="w-full pl-3 text-black border-2 border-black"
          />
        </form>
      </div>
      <Datepicker
        v-model="calendarDate"
        placeholder="Select Date"
        :enableTimePicker="false"
        autoApply
        dark
        class="mt-1"
      />
      <div class="flex center py-2">
        <button
          @click.prevent="createDidIt()"
          class="text-black border-2 border-purple-400 transition font-medium bg-gradient-to-br from-green-300 to-green-500 hover:font-semibold text-xl rounded-lg py-3 px-8 mx-auto"
        >
          Did It
        </button>
      </div>
    </Container>

    <!-- Favorite Activity -->
    <Container>
      <div class="text-xl text-center">Favorite Activity</div>
      <div class="bg-gray-700 border-2 border-black my-1 pl-2 hover:bg-gray-600">
        {{ favoriteActivity.name }}: {{ favoriteActivity.count }}x
        <br />
        Average: {{ (favoriteActivity.count / (favoriteDays / 7)).toFixed(2) }} days/week
      </div>
      <div class="bg-gray-700 border-2 border-black my-1 pl-2 hover:bg-gray-600">
        Since: {{ favFormat(firstDate) }}
        <br />
        Total days: {{ favoriteDays }}
      </div>
      <div class="bg-gray-700 border-2 border-black my-1 pl-2 hover:bg-gray-600">
        This week: 4x
        <br />
        This month: 15x
        <br />
        Last 30 days: 18x
        <br />
        This year: (if it's been a year)
        <br />
        Last year: (then this will be a thing too)
      </div>
    </Container>

    <!-- All Activities -->
    <Container>
      <div class="text-xl text-center">All Activities</div>
      <div
        v-for="(value, key) in hashTable"
        :key="key"
        class="bg-gray-700 border-2 border-black my-1 pl-2 hover:bg-gray-600"
      >
        {{ key }}: {{ value }}x
      </div>
    </Container>

    <!-- Recent Activities aka Did Its -->
    <Container>
      <div class="text-xl text-center">Recent Activities</div>
      <div
        v-for="didIt in didIts"
        :key="didIt.id"
        class="relative bg-gray-700 border-2 border-black my-1 pl-2 hover:bg-gray-600"
      >
        {{ didIt.name }} on {{ dateFormat(didIt.date) }}
        <span class="absolute inset-y-0 right-2">
          <i
            @click="deleteDidIt(didIt.id, didIt.name)"
            class="fa-solid fa-xmark text-gray-400 hover:cursor-pointer hover:text-red-500"
          ></i>
        </span>
      </div>
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
      didIts: [],
      didItsFullList: [],
      didItsNumber: 10,
      selectedActivities: [],
      newActivityName: "",
      calendarDate: "",
      hashTable: {},
      firstDate: "",
      lastDate: "",
      favoriteActivity: { count: 0, name: "none" },
      favoriteDays: 0,
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
          this.didItsFullList = this.user.did_its;
          this.didIts = this.user.did_its;
          this.sortByDate(this.didIts);
          this.sortByDate(this.didItsFullList);
          this.didIts = this.didIts.reverse().slice(0, this.didItsNumber);
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
    dateFormat(date) {
      // this function is for displaying dates in recent activities
      const displayDate = new Date(date.replace(/-/g, "/"));
      const options = { weekday: "long", month: "short", day: "numeric" };
      return displayDate.toLocaleDateString("en-US", options);
    },
    favFormat(date) {
      const displayDate = new Date(date.replace(/-/g, "/"));
      const options = { month: "long", day: "numeric" };
      return displayDate.toLocaleDateString("en-US", options);
    },
    postFormat(dateString) {
      // this function changes the date before it posts to the backend on createDidIt
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
    deleteDidIt(id, name) {
      axios.delete("/did_its/" + id + ".json").then((response) => {
        console.log("Success,", response.data.message);
        this.didItsFullList = this.didItsFullList.filter((didIt) => didIt.id != id);
        this.didIts = this.didItsFullList.slice(0, this.didItsNumber);
        this.decrementValue(name);
        if (name == this.favoriteActivity.name) {
          this.favoriteActivity.count--;
        }
      });
    },
    createDidIt() {
      if (!this.calendarDate) {
        alert("Please select a date.");
        return;
      }
      if (this.selectedActivities.length === 0) {
        alert("Please select an activity.");
        return;
      }
      for (let index = 0; index < this.selectedActivities.length; index++) {
        axios
          .post("/did_its.json", {
            user_id: this.user.id,
            activity_id: this.selectedActivities[index],
            date: this.postFormat(this.calendarDate),
          })
          .then((response) => {
            console.log("Successfully recorded activity", response.data);
            this.didIts.push(response.data);
            this.sortByDate(this.didIts);
            this.incrementValue(response.data.name);
            if (response.data.name == this.favoriteActivity.name) {
              this.favoriteActivity.count++;
            }
            // could this be included in sortByDate?
            this.didIts = this.didIts.reverse().slice(0, this.didItsNumber);
          });
      }
      this.selectedId = [];
    },
    sortByDate(array) {
      array.sort(function (a, b) {
        var c = new Date(a.date);
        var d = new Date(b.date);
        return c - d;
      });
    },
    addToHashTable(key, value) {
      this.hashTable[key] = value;
    },
    removeFromHashTable(key) {
      delete this.hashTable[key];
    },
    hasKey(key) {
      return this.hashTable.hasOwnProperty(key);
    },
    getValue(key) {
      return this.hashTable[key];
    },
    // increment and decrement could be lumped into on function
    incrementValue(key) {
      var count = this.getValue(key);
      count++;
      this.addToHashTable(key, count);
    },
    decrementValue(key) {
      var count = this.getValue(key);
      count--;
      this.addToHashTable(key, count);
    },
    buildHashTable() {
      for (let index = 0; index < this.didItsFullList.length; index++) {
        if (this.hasKey(this.didItsFullList[index].name) == false) {
          this.addToHashTable(this.didItsFullList[index].name, 1);
        } else {
          var count = this.getValue(this.didItsFullList[index].name);
          count++;
          if (count > this.favoriteActivity.count) {
            this.favoriteActivity.count = count;
            this.favoriteActivity.name = this.didItsFullList[index].name;
          }
          this.addToHashTable(this.didItsFullList[index].name, count);
        }
      }
    },
    getFavorite() {
      for (let index = 0; index < this.didItsFullList.length; index++) {
        if (this.didItsFullList[index].name == this.favoriteActivity.name) {
          this.lastDate = this.didItsFullList[index].date;
          break;
        }
      }
      for (let index = this.didItsFullList.length - 1; index >= 0; index--) {
        if (this.didItsFullList[index].name == this.favoriteActivity.name) {
          this.firstDate = this.didItsFullList[index].date;
          break;
        }
      }
      this.favoriteDays = this.getDaysBetweenDates(this.firstDate, this.lastDate);
    },
    getDaysBetweenDates(date1, date2) {
      const oneDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
      const firstDate = new Date(date1);
      const secondDate = new Date(date2);
      const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));
      return diffDays;
    },
    getStreak(array) {
      let currentStreak = 0;
      let previousDate = null;
      const today = new Date();
      const lastDate = new Date(array[0].date);
      const timeSinceLast = today.getTime() - lastDate.getTime();
      const daysSinceLast = Math.floor(timeSinceLast / (1000 * 60 * 60 * 24));

      // Check if the last activity was performed today or yesterday and starts streak from there
      if (daysSinceLast === 0 || daysSinceLast === 1) {
        currentStreak += 1;
      } else {
        return currentStreak;
      }

      let index = 0;
      while (currentStreak > 0) {
        let currentDate = new Date(array[index].date);

        if (previousDate == null || this.getDaysBetweenDates(previousDate, currentDate) == 0) {
          // couldn't figure out a line that does nothing... using 'continue;' breaks the app
          console.log();
        } else if ((previousDate != null && this.getDaysBetweenDates(previousDate, currentDate)) === 1) {
          currentStreak += 1;
        } else {
          break;
        }
        index++;
        previousDate = currentDate;
      }

      return currentStreak;
    },
  },
  created() {
    if (localStorage.jwt && localStorage.user_id && localStorage.user_id != undefined) {
      this.isLoggedIn = true;
      this.dataLoaded = new Promise((resolve, reject) => {
        axios
          .get("/users/" + localStorage.user_id + ".json")
          .then((response) => {
            this.user = response.data;
            this.activities = this.user.activities;
            this.didItsFullList = this.user.did_its;
            this.didIts = this.user.did_its;
            this.sortByDate(this.didIts);
            this.firstDate = this.didIts[0].date;
            this.lastDate = this.didIts[this.didIts.length - 1].date;
            this.sortByDate(this.didItsFullList);
            this.didIts = this.didIts.reverse().slice(0, this.didItsNumber);
            console.log("Current user:", response.data);
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    }
  },
  mounted() {
    this.dataLoaded.then(() => {
      this.calendarDate = new Date();
      this.buildHashTable();
      this.getFavorite();
      console.log("streak", this.getStreak(this.didItsFullList));
    });
  },
};
</script>
