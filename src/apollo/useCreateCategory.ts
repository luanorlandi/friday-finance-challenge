import gql from "graphql-tag";

import { useMutation } from "@vue/apollo-composable";
import { Category } from "@/types";

type UseCreateCategoriesVariables = {
  name: Category["name"];
  color: Category["color"];
};

const useCreateCategory = () => {
  const { mutate: createCategory } = useMutation<
    { createCategory: Category },
    UseCreateCategoriesVariables
  >(
    gql`
      mutation CreateCategoryMutation($name: String, $color: String) {
        createCategory(name: $name, color: $color) {
          id
          name
          color
        }
      }
    `
  );

  return createCategory;
};

export default useCreateCategory;
