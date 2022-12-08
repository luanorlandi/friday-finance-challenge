import * as fs from "fs";
import * as path from "path";
import { PrismaClient } from "@prisma/client";
import * as csv from "fast-csv";

const prisma = new PrismaClient();

const parseCsv = <T>(fileName: string): Promise<Array<T>> => {
  const rows: Array<T> = [];

  return new Promise((resolve) => {
    fs.createReadStream(path.resolve(__dirname, "seed", fileName))
      .pipe(csv.parse({ headers: true }))
      .on("error", (error) => console.error(error))
      .on("data", (row) => rows.push(row))
      .on("end", (rowCount: number) => {
        console.log(`Parsed ${rowCount} rows`);
        resolve(rows);
      });
  });
};

type AccountCsv = {
  id: string;
  name: string;
  bank: string;
};

type CategoryCsv = {
  id: string;
  name: string;
  color: string;
};

type TransactionCsv = {
  id: string;
  accountId: string;
  categoryId?: string;
  reference?: string;
  amount: string;
  currency: string;
  date: string;
};

async function main() {
  const accounts = await parseCsv<AccountCsv>("accounts.csv");
  const categories = await parseCsv<CategoryCsv>("categories.csv");
  // TODO change to complete list of transactions
  const transactions = await parseCsv<TransactionCsv>("transactions-short.csv");

  console.log("Parsed all csv files, inserting data in database...");

  const accountPromises = accounts.map((account) => {
    const newAccount = prisma.account.create({
      data: account,
    });
    return newAccount;
  });

  await Promise.all(accountPromises);

  const categoryPromises = categories.map((category) => {
    const newCategory = prisma.category.create({
      data: category,
    });
    return newCategory;
  });

  await Promise.all(categoryPromises);

  const transactionPromises = transactions.map((transaction) => {
    const newTransaction = prisma.transaction.create({
      data: {
        ...transaction,
        categoryId:
          transaction.categoryId !== "" ? transaction.categoryId : undefined,
        amount: parseFloat(transaction.amount),
        date: new Date(transaction.date),
      },
    });
    return newTransaction;
  });

  await Promise.all(transactionPromises);

  console.log("Inserted all data succesfully");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
