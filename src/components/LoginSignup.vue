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
          <h2 class="text-xl mb-5">New User Signup</h2>
          <button
            type="submit"
            class="w-[100px] border text-black font-medium bg-green-400 rounded my-1"
          >
            Submit
          </button>
          <p>
            <button
              @click.prevent="
                this.showSignup = false
                this.errors = []
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

  <Section v-if="showLogin">
    <form @submit.prevent="login()">
      <div class="text-center">
        <ul>
          <li v-for="error in errors" :key="error">{{ error }}</li>
        </ul>
      </div>
      <div class="grid grid-cols-2">
        <div class="flex flex-col gap-2 my-2 items-center">
          <div>
            <input
              type="email"
              placeholder="Email"
              v-model="loginParams.email"
              class="text-black rounded px-1"
            />
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
          <button
            type="submit"
            class="border text-black font-medium bg-green-400 px-8 mx-10 my-1 rounded"
          >
            Login
          </button>
          <p>
            <button
              @click.prevent="
                this.showLogin = false
                this.errors = []
              "
              class="border text-black font-medium bg-gray-400 px-8 mx-10 my-1 rounded"
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
  import axios from 'axios'
  import Section from './Section.vue'

  export default {
    components: {
      Section
    },
    data() {
      return {
        showLogin: false,
        showSignup: false,
        errors: [],
        loginParams: {},
        signupParams: {}
      }
    },
    methods: {
      signup() {
        axios
          .post('/users.json', this.signupParams)

          // Should there be a message that says "You have successfully signed up"?

          .then(response => {
            if (response && response.status >= 200 && response.status < 300) {
              console.log(response.data)
              this.showSignup = false
              this.showLogin = true
            } else {
              this.errors.push(response.data.errors)
            }
          })
          .catch(error => {
            console.log(error.response)

            // Test this and potentially implement in the login method

            if (error.response && error.response.data) {
              this.errors.push(error.response.data.errors)
            } else {
              this.errors = [
                'An unexpected error occurred. Please try again later.'
              ]
            }
          })
          .finally(() => {
            this.signupParams = {}
            this.login()
          })
      },
      login() {
        axios
          .post('/sessions.json', this.loginParams)
          .then(response => {
            if (response && response.status >= 200 && response.status < 300) {
              axios.defaults.headers.common['Authorization'] =
                'Bearer ' + response.data.jwt
              localStorage.setItem('jwt', response.data.jwt)
              localStorage.setItem('user_id', response.data.id)
              this.user = response.data
              this.loginParams = {}
              this.showLogin = false
              this.errors = []
              this.$emit('login', response.data)
            } else {
              this.errors.push(response.data.errors)
            }
          })
          .catch(error => {
            console.log(error.response)
            this.errors = ['Invalid email or password.']
            this.loginParams = {}
          })
      }
    }
  }
</script>
