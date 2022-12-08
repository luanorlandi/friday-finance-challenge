describe("Transaction Details", () => {
  it("loads the transaction details", () => {
    cy.visit("/");
    cy.contains("h1", "Transaction Detail");
  });
});
