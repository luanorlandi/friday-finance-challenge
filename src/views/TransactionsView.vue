<template>
  <BaseContainer>
    <div class="flex mb-4">
      <h1 class="text-xl">Transactions</h1>
    </div>
    <!-- TODO add other filters in requirements -->
    <TransactionsFilter
      :modelValue="filter"
      @update:modelValue="handleFilter"
    />
    <table v-if="transactions !== undefined" class="min-w-full">
      <thead class="border-b">
        <tr>
          <!-- TODO add sort -->
          <th scope="col" class="text-sm px-4 py-4 text-left">Reference</th>
          <th scope="col" class="text-sm px-4 py-4 text-left w-[320px]">
            Category
          </th>
          <th scope="col" class="text-sm px-4 py-4 text-left w-[120px]">
            Date
          </th>
          <th scope="col" class="text-sm px-4 py-4 text-right w-[120px]">
            Amount
          </th>
        </tr>
      </thead>
      <tbody>
        <!-- TODO add virtualization render if not adding pagination/infinite scroll -->
        <tr
          v-for="transaction in transactions"
          :key="transaction.id"
          class="border border-x-white border-y-gray-100 hover:bg-gray-100"
        >
          <router-link
            :to="{
              name: 'transaction-detail',
              params: { id: transaction.id },
            }"
            class="contents"
          >
            <td class="px-4 py-2 text-left">
              <span v-if="transaction.reference">
                {{ transaction.reference }}
              </span>
              <span class="text-gray-500" v-else>No reference provided</span>
            </td>
            <td class="px-4 py-2 text-left w-[320px]">
              <BaseTag
                v-if="transaction.category"
                :color="`#${transaction.category.color}`"
              >
                {{ transaction.category.name }}
              </BaseTag>
            </td>
            <td class="px-4 py-2 text-left w-[120px]">
              {{ formatDate(transaction.date) }}
            </td>
            <td class="px-4 py-2 text-right w-[120px]">
              <div>
                <span>{{ transaction.amount }}</span>
                <span class="text-gray-500 ml-1">
                  {{ transaction.currency }}
                </span>
              </div>
            </td>
          </router-link>
        </tr>
      </tbody>
    </table>
  </BaseContainer>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { useQuery } from "@vue/apollo-composable";
import gql from "graphql-tag";
import BaseContainer from "@/components/BaseContainer/BaseContainer.vue";
import BaseTag from "@/components/BaseTag/BaseTag.vue";
import type { Transaction, TransactionFilter } from "@/types";
import formatDate from "@/utils/formatDate";
import TransactionsFilter from "@/components/TransactionsFilter/TransactionsFilter.vue";

export default defineComponent({
  name: "TransactionsPage",
  components: {
    BaseContainer,
    BaseTag,
    TransactionsFilter,
  },
  setup() {
    const transactions = ref<Transaction[] | undefined>();
    const filter = ref<TransactionFilter>({ searchText: "" });
    const { result } = useQuery(
      gql`
        query TransactionsQuery($searchText: String) {
          transactions(searchText: $searchText) {
            id
            category {
              id
              name
              color
            }
            account {
              id
              name
              bank
            }
            date
            currency
            amount
            reference
          }
        }
      `,
      filter
    );

    watch(result, (value) => {
      transactions.value = value.transactions;
    });

    const handleFilter = (newFilter: TransactionFilter) => {
      filter.value = newFilter;
    };

    return {
      transactions,
      formatDate,
      filter,
      handleFilter,
    };
  },
});
</script>
