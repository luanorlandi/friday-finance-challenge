<template>
  <div class="flex">
    <div class="flex flex-col w-full">
      <label for="searchText" class="text-sm text-gray-500">Search</label>
      <div class="flex relative p-2 border rounded">
        <input
          id="searchText"
          placeholder="Search by bank, account, reference, category, date, amount, currency..."
          class="w-full pl-6"
          :value="modelValue.searchText"
          @input="handleChangeSearchText"
        />
        <BaseIcon type="Search" class="absolute w-[20px]" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import BaseIcon from "@/components/BaseIcon/BaseIcon.vue";
import { TransactionFilter } from "@/types";

export default defineComponent({
  name: "TransactionsFilter",
  components: {
    BaseIcon,
  },
  emits: ["update:modelValue"],
  props: {
    modelValue: {
      type: Object as PropType<TransactionFilter>,
      required: true,
    },
  },
  setup(props, context) {
    const handleChangeSearchText = (event: Event) => {
      const target = event.target as HTMLInputElement;
      context.emit("update:modelValue", {
        ...props.modelValue,
        searchText: target.value,
      });
    };

    return {
      handleChangeSearchText,
    };
  },
});
</script>
