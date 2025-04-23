///<reference types="cypress"/>
import "../support/commands";
import dayjs from "dayjs";

describe("Acesso ao site Barriga React", () => {
  let token;
  before(() => {
    cy.getToken("kleberandrade98@gmail.com", "Ble@ch2206").then((tkn) => {
      token = tkn;
    });
  });
  beforeEach("Access", () => {
    cy.request({
      url: "/reset",
      method: "GET",
      headers: {
        Authorization: `JWT ${token}`,
      },
    });
  });

  it("Criação de conta", () => {
    cy.request({
      url: "/contas",
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
  });

  it("Alteração de contas", () => {
    cy.getContaByName("Conta para alterar").then((contaId) => {
      cy.request({
        url: `/contas/${contaId}`,
        method: "PUT",
        headers: {
          Authorization: `JWT ${token}`,
        },
        body: {
          nome: "conta alterada via rest",
        },
      }).as("response");
      cy.get("@response").its("status").should("be.equal", 200);
    });
  });

  it("Conta duplicada", () => {
    cy.request({
      url: "/contas",
      method: "POST",
      headers: {
        Authorization: `JWT ${token}`,
      },
      body: {
        nome: "Conta mesmo nome",
      },
      failOnStatusCode: false,
    }).as("response");
    cy.get("@response").then((res) => {
      expect(res.status).to.be.equal(400);
      expect(res.body.error).to.be.equal("Já existe uma conta com esse nome!");
    });
  });
  it("Inserir movimentação", () => {
    cy.getContaByName("Conta para alterar").then((contaId) => {
      cy.request({
        url: "/transacoes",
        method: "POST",
        headers: {
          Authorization: `JWT ${token}`,
        },
        body: {
          conta_id: contaId,
          data_pagamento: dayjs().add(1, "day").format("DD/MM/YYYY"),
          data_transacao: dayjs().format("DD/MM/YYYY"),
          descricao: "desc",
          envolvido: "inter",
          status: true,
          tipo: "REC",
          valor: "123",
        },
      }).as("response");
    });
    cy.get("@response").its("status").should("be.equal", 201);
    cy.get("@response").its("body.id").should("exist");
  });
  it.only("Saldo", () => {
    cy.request({
      url: "/saldo",
      method: "GET",
      headers: { Authorization: `JWT ${token}` },
    }).then((res) => {
      let saldoConta = null;
      res.body.forEach((c) => {
        if (c.conta === "Conta para saldo") saldoConta = c.saldo;
      });
      expect(saldoConta).to.be.equal("534.00");
    });
  });
});
