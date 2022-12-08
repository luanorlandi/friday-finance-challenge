import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import TransactionsPage from "../views/TransactionsView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "transactions",
    component: TransactionsPage,
  },
  {
    path: "/transaction/:id",
    name: "transaction-detail",
    component: () =>
      import(
        /* webpackChunkName: "transaction-detail" */ "../views/TransactionDetailView.vue"
      ),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
