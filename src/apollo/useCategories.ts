import { watch, ref } from "vue";
import gql from "graphql-tag";

import { useQuery } from "@vue/apollo-composable";
import { Category } from "@/types";

type UseCategoriesVariables = {
  name?: Category["name"];
};

const useCategories = (initialOptions = {}) => {
  const categories = ref<Category[] | undefined>();
  const variables = ref<UseCategoriesVariables>({});
  const options = ref(initialOptions);

  const { result } = useQuery(
    gql`
      query CategoriesQuery($name: String) {
        categories(name: $name) {
          id
          name
          color
        }
      }
    `,
    variables,
    options
  );

  watch(result, (value) => {
    categories.value = value.categories;
  });

  return { categories, variables, options };
};

export default useCategories;
