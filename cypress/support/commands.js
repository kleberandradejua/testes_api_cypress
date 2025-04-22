Cypress.Commands.add("getToken", (user, passwd) => {
  cy.request({
    method: "POST",
    url: "https://barrigarest.wcaquino.me/signin",
    body: {
      email: "kleberandrade98@gmail.com",
      redirecionar: false,
      senha: "Ble@ch2206",
    },
  })
    .its("body.token")
    .should("not.be.empty")
    .then((token) => {
      return token;
    });
});

Cypress.Commands.add("resetRest", () => {
  cy.getToken("kleberandrade98@gmail.com", "Ble@ch2206").then((token) => {
    cy.request({
      method: "GET",
      url: "/reset",
      headers: { Authorization: `JWT ${token}` },
    })
      .its("status")
      .should("be.equal", 200);
  });
});

Cypress.Commands.add("getContaByName", (name) => {
  cy.getToken("kleberandrade98@gmail.com", "Ble@ch2206").then((token) => {
    cy.request({
      method: "GET",
      url: "/contas",
      headers: {
        Authorization: `JWT ${token}`,
      },
      qs: {
        nome: name,
      },
    }).then((res) => {
      return res.body[0].id;
    });
  });
});
