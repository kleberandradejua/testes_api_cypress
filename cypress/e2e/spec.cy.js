///<reference types="cypress"/>

import "../support/commands";

describe("Acesso ao site Barriga React", () => {
  let token;
  before(() => {
    cy.getToken("kleberandrade98@gmail.com", "Ble@ch2206").then((tkn) => {
      token = tkn;
    });
  });
  beforeEach("Access", () => {});

  it("Criação de conta", () => {
    cy.request({
      url: "https://barrigarest.wcaquino.me/contas",
      method: "POST",
      headers: {
        Authorization: `JWT ${token}`,
      },
      body: {
        nome: "Conta via rest",
      },
    }).as("response");
    cy.get("@response").then((res) => {
      expect(res.status).to.be.equal(201);
      expect(res.body).to.have.property("id");
      expect(res.body).to.have.property("nome", "Conta via rest");
    });
    /*cy.request({
      method: "GET",
      url: "https://barrigarest.wcaquino.me/reset",
      headers: {
        Authorization: "@response",
      },*/
  });
});