<script setup lang="ts">
const props = defineProps({
  solid: Boolean,
})
</script>
<template>
  <Transition mode="out-in" :duration="100">
    <svg
      v-if="!solid"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      viewBox="0 0 24 24"
      stroke-linecap="round"
      stroke-linejoin="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19.27 16.202A7.81 7.81 0 0 1 12.06 21c-4.313 0-7.81-3.492-7.81-7.8S5.89 7.13 8.455 3c4.806 2.1 4.806 8.4 4.806 8.4s1.579-3.038 4.807-4.5c1.034 3.042 2.43 6.365 1.202 9.302"
      />
      <path d="M12 18a5 5 0 0 1-5-5" />
    </svg>
    <svg
      v-else
      class="fill-red-400"
      width="24"
      height="24"
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.818 2.604a.75.75 0 0 1 .938-.291c2.676 1.17 3.982 3.498 4.618 5.441.183.562.314 1.1.407 1.58l.1-.12c.844-.996 2.13-2.206 3.877-2.997a.75.75 0 0 1 1.02.441q.142.418.294.853c.437 1.252.906 2.597 1.18 3.928.34 1.655.405 3.39-.29 5.053a8.56 8.56 0 0 1-7.902 5.258c-4.727 0-8.56-3.827-8.56-8.55 0-3.874 1.296-5.885 3.22-8.868.346-.539.714-1.109 1.098-1.728M7.75 13a.75.75 0 0 0-1.5 0A5.75 5.75 0 0 0 12 18.75a.75.75 0 0 0 0-1.5A4.25 4.25 0 0 1 7.75 13"
      />
    </svg>
  </Transition>
</template>
