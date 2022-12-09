# friday-finance

## Project setup

```sh
# frontend
npm install

# backend
cd backend/
npm install
npm run init
npm run seed
```

## Run for development

```sh
# frontend
npm run serve

# backend
cd backend/
npm run dev
```

# Addional Notes on the coding challenge

There are some missing requirements for the transaction filter fields and to use the whole data in the database. This and other things that I wanted to do were not able to complete on time, but I added here to highlight them and how I would implement it.

- Add select filters of account name and bank, add a datetime input for start and end date range. These fields would go in TransactionsFilter component. And the query edited to receives these variables of filter with AND operator
- Sort buttons in table header, sending the variable in the query to order with prisma function
- Add virtualization render with the whole data in database of transacitons. The pagination or infinite scroll would take more time to implement, while the virtualization would be shortcut with trade off on latency, and in this case I would make the filter and sort to go in the client, as it already has all the data and to prevent further latency when filtering or sorting
- Add loading and error states for user feedback
- Add tests in jests for each component in `component/` dir, as unit tests
- Add Cypress tests for each view, testing with a mocked API in the category update to prevent unstable test runs
