import gql from "graphql-tag";

import { useMutation } from "@vue/apollo-composable";
import { Transaction, Category } from "@/types";

type UseUpdateTransactionCategory = {
  id: Transaction["id"];
  categoryId: Category["id"];
};

const useUpdateTransactionCategory = () => {
  const { mutate } = useMutation<Category, UseUpdateTransactionCategory>(
    gql`
      mutation UpdateTransactionCategoryMutation(
        $id: String
        $categoryId: String!
      ) {
        updateTransactionCategory(id: $id, categoryId: $categoryId) {
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
    `
  );

  return { mutate };
};

export default useUpdateTransactionCategory;
