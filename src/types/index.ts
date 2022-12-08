export type Account = {
  id: string;
  name: string;
  bank: string;
};

export type Category = {
  id: string;
  name: string;
  color: string;
};

export type Transaction = {
  id: string;
  account: Account;
  category?: Category;
  reference?: string;
  amount: number;
  currency: string;
  date: string;
};

export type TransactionFilter = {
  searchText?: string;
};
