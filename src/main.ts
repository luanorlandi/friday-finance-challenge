import { createApp, provide, h } from "vue";
import App from "./App.vue";
import "./assets/tailwind.css";
import { createPinia } from "pinia";

import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client/core";
import { DefaultApolloClient } from "@vue/apollo-composable";
import router from "./router";

const httpLink = createHttpLink({
  uri: "http://localhost:4000",
});

const cache = new InMemoryCache();

const apolloClient = new ApolloClient({
  link: httpLink,
  cache,
});

createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient);
  },

  render: () => h(App),
})
  .use(router)
  .use(createPinia())
  .mount("#app");
