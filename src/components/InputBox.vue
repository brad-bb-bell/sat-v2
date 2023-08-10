<template>
  <div>
    <input
      :type="type"
      :placeholder="placeholder"
      :value="inputValue"
      @input="$emit('input', $event.target.value)"
      class="text-black rounded p-1 w-64 focus:outline-purple-700"
    />
  </div>
</template>
<script>
  export default {
    props: {
      type: String,
      placeholder: String,
      inputValue: String
    }
  }
</script>
