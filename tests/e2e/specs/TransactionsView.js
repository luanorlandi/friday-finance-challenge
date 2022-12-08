describe("Transactions", () => {
  it("loads the transactions list", () => {
    cy.visit("/");
    cy.contains("h1", "Transactions");
  });
});
