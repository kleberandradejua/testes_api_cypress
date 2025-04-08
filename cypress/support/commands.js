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