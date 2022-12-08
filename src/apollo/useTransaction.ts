import { watch, ref } from "vue";
import gql from "graphql-tag";

import { useQuery } from "@vue/apollo-composable";
import { Transaction } from "@/types";

const useTransaction = (id: Transaction["id"]) => {
  const transaction = ref<Transaction | undefined>();

  const { result } = useQuery(
    gql`
      query TransactionQuery($id: String!) {
        transaction(id: $id) {
          id
          account {
            id
            name
            bank
          }
          category {
            id
            name
            color
          }
          reference
          amount
          currency
          date
        }
      }
    `,
    {
      id: id,
    }
  );

  watch(result, (value) => {
    transaction.value = value.transaction;
  });

  return { transaction };
};

export default useTransaction;
