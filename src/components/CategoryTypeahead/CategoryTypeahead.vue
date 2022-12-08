<template>
  <div class="flex">
    <button
      @click="onCancelEdit()"
      class="mr-4 px-4 py-1 text-sm rounded border hover:bg-gray-100 justify-self-end"
    >
      Cancel
    </button>
    <div class="relative">
      <div class="flex border px-2 py-1 rounded">
        <BaseTag v-if="modelValue" class="mr-2" :color="`#${modelValue.color}`">
          {{ modelValue.name }}
        </BaseTag>
        <input
          class="min-w-[220px]"
          aria-label="Category"
          v-model="inputValue"
          autofocus
        />
      </div>
      <div class="absolute shadow-md border rounded w-full mt-2 bg-white">
        <span class="px-4 py-2 flex text-sm text-gray-500"
          >Select an option or create one</span
        >
        <div
          class="flex flex-col gap-y-1 px-2 pb-2 max-h-[220px] overflow-y-auto"
        >
          <template v-for="category in categories" :key="category.id">
            <button
              class="px-2 py-1 rounded hover:bg-gray-100 focus:bg-gray-100"
              @click="$emit('update:modelValue', category)"
            >
              <BaseTag :color="`#${category.color}`">{{
                category.name
              }}</BaseTag>
            </button>
          </template>
          <button
            class="flex px-2 py-1 rounded hover:bg-gray-100 focus:bg-gray-100"
            @click="
              $emit('update:modelValue', { name: inputValue, color: newColor })
            "
            v-if="
              inputValue !== '' &&
              // category type is not the exact match
              !(
                categories.length >= 1 &&
                categories.find(
                  (category) =>
                    category.name.toLowerCase() === inputValue.toLowerCase()
                )
              )
            "
          >
            <span class="mx-2">Create</span>
            <BaseTag :color="`#${newColor}`">{{ inputValue }}</BaseTag>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, watch } from "vue";
import BaseTag from "@/components/BaseTag/BaseTag.vue";
import { Category } from "@/types";
import getRandomColor from "@/utils/getRandomColor";

export default defineComponent({
  name: "CategoryTypeahead",
  components: {
    BaseTag,
  },
  emits: ["update:modelValue"],
  props: {
    modelValue: {
      type: Object as PropType<Category>,
    },
    categories: {
      type: Array as PropType<Category[]>,
      default: () => [],
    },
    onFilter: {
      type: Function,
      required: true,
    },
    onCancelEdit: {
      type: Function,
      required: true,
    },
  },
  setup(props) {
    const inputValue = ref("");
    watch(inputValue, () => {
      if (inputValue.value === "") {
        return;
      }
      props.onFilter(inputValue.value);
    });
    watch(props, (value) => {
      const { categories } = value;
      if (categories.length === 1 && categories[0].name === inputValue.value) {
        return;
      }
    });
    return {
      inputValue,
      newColor: getRandomColor(),
    };
  },
});
</script>
