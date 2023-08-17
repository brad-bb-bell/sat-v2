<template>
  <button
    class="rounded border w-28 py-1.5 relative overflow-hidden"
    role="button"
    :class="{
      'bg-green-400 text-black': type === 'green'
    }"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <span class="absolute inset-0 border-4" :style="borderStyle"></span>
    <slot class="select-none relative"></slot>
  </button>
</template>

<script>
  export default {
    props: {
      type: {
        type: String,
        default: 'null'
      }
    },
    data() {
      return {
        mouseX: 0,
        mouseY: 0
      }
    },
    computed: {
      borderStyle() {
        return {
          background: `radial-gradient(circle closest-side at ${this.mouseX}px ${this.mouseY}px, #38A169, #4ADE80, transparent)`,
          borderColor: 'transparent'
        }
      }
    },
    methods: {
      handleMouseMove(event) {
        const rect = event.target.getBoundingClientRect()
        this.mouseX = event.clientX - rect.left
        this.mouseY = event.clientY - rect.top
      },
      handleMouseLeave() {
        this.mouseX = 0
        this.mouseY = 0
      }
    }
  }
</script>

<style>
  /* Optional: For TailwindCSS colors if they aren't automatically resolved */
  :root {
    --tw-green-500: #38a169;
    --tw-green-300: #4ade80;
  }
</style>
