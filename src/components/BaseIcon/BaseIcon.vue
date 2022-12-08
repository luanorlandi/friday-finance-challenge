<template>
  <img :src="src" :alt="type" />
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import * as icons from "@/assets/icons";

type IconList = {
  [type: string]: string;
};

const iconsList = icons as unknown as IconList;

export default defineComponent({
  name: "BaseIcon",
  props: {
    type: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const src = computed(() => {
      const { type } = props;

      let src = "";
      if (iconsList[type]) {
        src = iconsList[type];
      }

      return src;
    });

    return {
      src,
    };
  },
});
</script>
