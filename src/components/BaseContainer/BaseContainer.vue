<template>
  <div class="mx-auto max-w-5xl">
    <div class="m-4 p-6 rounded border border-gray-100 shadow-xl text-left">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "BaseContainer",
});
</script>
