import { PrismaClient } from "@prisma/client";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import formatDate from "./utils/formatDate";
import isInvalidDate from "./utils/isInvalidDate";

const prisma = new PrismaClient();

const typeDefs = `#graphql
  scalar DateTime

  type Account {
    id: String
    name: String
    bank: String
  }

  type Category {
    id: String
    name: String
    color: String
  }

  type Transaction {
    id: String
    account: Account
    category: Category
    reference: String!
    amount: Float
    currency: String
    date: DateTime
  }

  type Query {
    accounts: [Account]
    categories(name: String): [Category]
    transactions(searchText: String): [Transaction]
    transaction(id: String!): Transaction
  }

  type Mutation {
    createCategory(name: String, color: String): Category
    updateTransactionCategory(id: String, categoryId: String): Transaction
  }
`;

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query: {
      accounts: async () => {
        const accounts = await prisma.account.findMany();
        return accounts;
      },
      categories: async (_, args: { name?: string }) => {
        const categories = await prisma.category.findMany({
          where: {
            name: {
              contains: args.name,
            },
          },
        });
        return categories;
      },
      transactions: async (_, args) => {
        const gteDateFormatted = new Date(formatDate(args.searchText));
        const ltDateFormatted = new Date(formatDate(args.searchText));
        ltDateFormatted.setDate(ltDateFormatted.getDate() + 1);
        const dateEqual = {
          gte: gteDateFormatted,
          lt: ltDateFormatted,
        };
        const searchTextFilter = [
          {
            reference: {
              contains: args.searchText,
            },
          },
          {
            currency: {
              contains: args.searchText,
            },
          },
          {
            date: !isInvalidDate(gteDateFormatted) ? dateEqual : undefined,
          },
          {
            category: {
              name: {
                contains: args.searchText,
              },
            },
          },
          {
            account: {
              OR: [
                {
                  name: {
                    contains: args.searchText,
                  },
                },
                {
                  bank: {
                    contains: args.searchText,
                  },
                },
              ],
            },
          },
        ];
        const transactions = await prisma.transaction.findMany({
          where: {
            OR: args.searchText ? searchTextFilter : undefined,
          },
          include: {
            account: true,
            category: true,
          },
        });
        return transactions;
      },
      transaction: async (_, args: { id: string }) => {
        const transactions = await prisma.transaction.findUnique({
          where: { id: args.id },
          include: {
            account: true,
            category: true,
          },
        });
        return transactions;
      },
    },
    Mutation: {
      createCategory: async (_, args: { name: string; color: string }) => {
        const category = await prisma.category.create({
          data: {
            name: args.name,
            color: args.color,
          },
        });
        return category;
      },
      updateTransactionCategory: async (
        _,
        args: { id: string; categoryId: string }
      ) => {
        const transaction = await prisma.transaction.update({
          where: {
            id: args.id,
          },
          data: {
            category: {
              connect: {
                id: args.categoryId,
              },
            },
          },
          include: {
            account: true,
            category: true,
          },
        });
        return transaction;
      },
    },
  },
});

async function main() {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });
  console.log(`🚀  Server ready at: ${url}`);
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
