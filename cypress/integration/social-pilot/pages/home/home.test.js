describe('Home Page Tests', () => {
  beforeEach(() => {
    cy.viewport(1920, 979)
    cy.visit('http://localhost:3000')
    cy.get('#root > .App > .d-flex > .d-sm-flex > .btn').click()
    cy.get('#btn-validate').click()
  })

  it('Click Add manually > click validate > Address Field should be invalid', function () {
    cy.get(':nth-child(1) > .col-sm-10 > .invalid-feedback').contains(
      'Address must be a valid address'
    )

    cy.get('#btn-submit').should('have.class', 'disabled')
  })

  it('there should be 9 dropdown options', () => {
    cy.get('#datalistOptions option').should('have.length', 9)
  })

  it('first value should be Idar', () => {
    cy.get('#datalistOptions option').first().should('have.value', 'Idar')
  })

  it('should enable submit button', () => {
    cy.get('input[name=address]').type('Idar')
    cy.get('#btn-validate').click()
    cy.get('#btn-submit').should('not.have.class', 'disabled').click()
  })
})
