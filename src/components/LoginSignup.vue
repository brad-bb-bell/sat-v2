<template>
  <Section>
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
</template>
<script>
import Section from "./Section.vue";

export default {
  components: {
    Section,
  },
};
</script>
