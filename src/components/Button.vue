<template>
  <button class="rounded border px-3 py-1.5" role="button">
    <slot class="select-none"></slot>
  </button>
</template>
<script>
  export default {
    props: {
      type: {
        type: String,
        default: 'null'
      }
    }
  }
</script>
