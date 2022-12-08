<template>
  <div
    class="text-sm px-2 py-1 rounded max-w-fit whitespace-nowrap h-[28px]"
    :style="{ backgroundColor: color }"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "BaseTag",
  props: {
    color: {
      type: String,
      default: "#958e80",
    },
  },
});
</script>
