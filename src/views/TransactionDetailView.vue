<template>
  <BaseContainer>
    <div class="flex mb-4">
      <router-link
        :to="{ name: 'transactions' }"
        class="text-xl text-blue-400 hover:underline"
      >
        Transactions
      </router-link>
      <span class="px-2">/</span>
      <h1 class="text-xl">Transaction Detail</h1>
    </div>
    <div v-if="transaction">
      <div class="flex justify-between mb-4">
        <div>Reference</div>
        <div v-if="transaction.reference">{{ transaction.reference }}</div>
        <div class="text-gray-500" v-else>No reference provided</div>
      </div>

      <div class="flex justify-between mb-4">
        <div>Amount</div>
        <div>
          <span>{{ transaction.amount }}</span>
          <span class="text-gray-500 ml-1">
            {{ transaction.currency }}
          </span>
        </div>
      </div>

      <div class="flex justify-between mb-4">
        <div>Date</div>
        <div>{{ formatDate(transaction.date) }}</div>
      </div>

      <div class="flex justify-between mb-4">
        <div>Category</div>
        <div v-if="!isEditingCategory" class="flex">
          <button
            @click="isEditingCategory = true"
            class="mr-4 px-4 py-1 text-sm rounded border hover:bg-gray-100 mb-2"
          >
            {{ transaction.category ? "Edit" : "Add" }}
          </button>
          <BaseTag
            v-if="transaction.category"
            :color="`#${transaction.category.color}`"
          >
            {{ transaction.category.name }}
          </BaseTag>
        </div>
        <CategoryTypeahead
          v-else
          :modelValue="transaction.category"
          @update:modelValue="handleCategoryChange"
          :categories="categories"
          :onFilter="handleCategoryFilter"
          :onCancelEdit="() => (isEditingCategory = false)"
        />
      </div>

      <hr class="mb-4" />

      <h2 class="text-xl mb-4">Account</h2>

      <div class="flex justify-between mb-4">
        <div>Name</div>
        <div>{{ transaction.account.name }}</div>
      </div>

      <div class="flex justify-between mb-4">
        <div>Bank</div>
        <div>{{ transaction.account.bank }}</div>
      </div>
    </div>
  </BaseContainer>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { useRoute } from "vue-router";

import BaseContainer from "@/components/BaseContainer/BaseContainer.vue";
import type { Category } from "@/types";
import BaseTag from "@/components/BaseTag/BaseTag.vue";
import CategoryTypeahead from "@/components/CategoryTypeahead/CategoryTypeahead.vue";
import formatDate from "@/utils/formatDate";
import useTransaction from "@/apollo/useTransaction";
import useCategories from "@/apollo/useCategories";
import useCreateCategory from "@/apollo/useCreateCategory";
import useUpdateTransactionCategory from "@/apollo/useUpdateTransactionCategory";

export default defineComponent({
  name: "TransactionDetailView",
  components: {
    BaseContainer,
    BaseTag,
    CategoryTypeahead,
  },
  setup() {
    const route = useRoute();
    const isEditingCategory = ref(false);
    const id = route.params.id as string;
    const { transaction } = useTransaction(id);
    const { categories, variables, options } = useCategories({
      throttle: 350,
      enabled: false,
    });
    const createCategory = useCreateCategory();
    const updateTransactionCategory = useUpdateTransactionCategory();

    const handleCategoryFilter = (name: string) => {
      variables.value = { name };
    };

    watch(isEditingCategory, () => {
      options.value = { ...options.value, enabled: isEditingCategory.value };
    });

    const handleCategoryChange = async (category: Category) => {
      if (!transaction.value) {
        return;
      }

      isEditingCategory.value = false;
      if (category.id === undefined) {
        const responseCategory = await createCategory(category);
        if (responseCategory && responseCategory.data) {
          const newCategory = responseCategory.data.createCategory;
          await updateTransactionCategory.mutate({
            id: transaction.value.id,
            categoryId: newCategory.id,
          });
        }
        return;
      }

      await updateTransactionCategory.mutate({
        id: transaction.value.id,
        categoryId: category.id,
      });
    };

    return {
      transaction,
      formatDate,
      categories,
      handleCategoryFilter,
      isEditingCategory,
      handleCategoryChange,
    };
  },
});
</script>
