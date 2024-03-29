<template>
  <Section v-if="!showLogin && !showSignup">
    <div class="grid grid-cols-2 text-xl">
      <button
        class="login-signup-button hover:text-white mx-auto"
        @click="showLogin = true"
      >
        Login
      </button>
      <button
        class="login-signup-button hover:text-white mx-auto"
        @click="showSignup = true"
      >
        Signup
      </button>
    </div>
  </Section>

  <Section v-if="showSignup">
    <form @submit.prevent="signup()">
      <div class="grid grid-cols-2">
        <div class="flex flex-col gap-2 py-2 items-center">
          <InputBox
            type="username"
            placeholder="Username"
            v-model="signupParams.name"
            @input="clearErrors"
          />
          <InputBox
            type="email"
            placeholder="Email address"
            v-model="signupParams.email"
            @input="clearErrors"
          />
          <InputBox
            type="password"
            placeholder="Password"
            v-model="signupParams.password"
            @input="clearErrors"
          />
          <InputBox
            type="password"
            placeholder="Password confirmation"
            v-model="signupParams.password_confirmation"
            @input="clearErrors"
          />
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
              @click.prevent="handleBackClick()"
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
      <div class="grid grid-cols-2">
        <div class="flex flex-col gap-2 my-2 items-center">
          <div>
            <input
              type="email"
              placeholder="Email"
              v-model="loginParams.email"
              class="text-black rounded p-1 w-64 focus:outline-purple-700"
              @input="clearErrors"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              v-model="loginParams.password"
              class="text-black rounded p-1 w-64 focus:outline-purple-700"
              @input="clearErrors"
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
              @click.prevent="handleBackClick()"
              class="border text-black font-medium bg-gray-400 px-8 mx-10 my-1 rounded"
            >
              Back
            </button>
          </p>
        </div>
      </div>
    </form>
  </Section>

  <Section v-if="errors.length > 0">
    <div class="text-center">
      <ul>
        <li v-for="error in errors" :key="error">{{ error }}</li>
      </ul>
    </div>
  </Section>

  <!-- <Section>
    not sure why this is here
    <div class="flex justify-center">
      <Button type="green">Login</Button>
    </div>
  </Section> -->
</template>
<script>
  import axios from 'axios'
  import Section from './Section.vue'
  import InputBox from './InputBox.vue'
  import Button from './Button.vue'
  import { Input } from 'postcss'

  export default {
    components: {
      Section,
      InputBox,
      Button,
      Input
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
    emits: ['login'],
    computed: {
      passwordsMatch() {
        return (
          this.signupParams.password === this.signupParams.password_confirmation
        )
      }
    },
    methods: {
      handleBackClick() {
        this.showSignup = false
        this.showLogin = false
        this.errors = []
      },
      clearErrors() {
        this.errors = []
      },
      signup() {
        if (
          !this.signupParams.name ||
          !this.signupParams.email ||
          !this.signupParams.password ||
          !this.signupParams.password_confirmation
        ) {
          this.errors.push('Please fill out all fields')
          return
        }
        if (!this.passwordsMatch) {
          this.errors.push('Passwords do not match')
          return
        }
        axios
          .post('/users.json', this.signupParams)

          // Should there be a message that says "You have successfully signed up"?

          .then(response => {
            if (response && response.status >= 200 && response.status < 300) {
              this.showSignup = false
              // shouldn't showLogin be false?
              this.showLogin = true
              this.login()
            } else {
              this.errors.push(...response.data.errors)
            }
          })
          .catch(error => {
            this.errors.push(...error.response.data.errors)
          })
          .finally(() => {
            this.signupParams = {}
          })
      },
      login() {
        if (!this.loginParams.email || !this.loginParams.password) {
          this.errors.push('Please enter your email and password')
          return
        }
        axios
          .post('/sessions.json', this.loginParams)
          .then(response => {
            if (response.status >= 200 && response.status < 300) {
              axios.defaults.headers.common['Authorization'] =
                'Bearer ' + response.data.jwt
              localStorage.setItem('jwt', response.data.jwt)
              localStorage.setItem('user_id', response.data.id)
              this.loginParams = {}
              this.showLogin = false
              this.$emit('login', response.data)
            }
          })
          .catch(error => {
            if (error?.response?.data?.errors) {
              this.errors = [...this.errors, ...error.response.data.errors]
            } else {
              this.errors.push('Invalid email or password')
            }
          })
          .finally(() => {
            this.loginParams = {}
          })
      }
    }
  }
</script>
<style>
  .login-signup-button {
    position: relative;
    padding-bottom: 5px; /* Adjust as needed for spacing between text and underline */
    overflow: hidden;
  }

  .login-signup-button::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0;
    height: 3px; /* Thickness of underline */
    background-color: #9f7aea; /* Color equivalent to decoration-purple-300 */
    transition: width 0.3s ease-out;
    transform: translateX(-50%);
  }

  .login-signup-button:hover::before {
    width: 100%;
  }
</style>
