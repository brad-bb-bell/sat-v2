<template>
  <div
    class="bg-gradient-to-br from-purple-300 via-purple-500 to-purple-300 w-4/5 max-w-xl py-2 px-4 border-4 border-purple-400 rounded-lg mx-auto cursor-default text-black"
  >
    <h1 class="text-center text-xl tracking-widest">{{ title }}</h1>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
  },
};
</script>
