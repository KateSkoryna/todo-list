describe('Todolist Application', () => {
  let createdTodolistName: string | null = null;

  // Visit page and reset state before each test
  beforeEach(() => {
    cy.visit('/');
    createdTodolistName = null;
  });

  // Clean up test-created todolists after each test
  afterEach(() => {
    if (createdTodolistName) {
      cy.visit('/');
      cy.get('body').then(($body) => {
        if ($body.text().includes(createdTodolistName)) {
          cy.get('[data-testid="todolist-title"]')
            .contains(createdTodolistName)
            .parents('div[data-testid^="todolist-item-"]')
            .within(() => {
              cy.get(
                'button[data-testid="todolist-item-delete-button"]'
              ).click();
            });
        }
      });
    }
  });

  // Final cleanup of all remaining todolists
  after(() => {
    cy.visit('/');

    cy.get('body').then(function cleanupAll($body) {
      const items = $body.find('div[data-testid^="todolist-item-"]');
      if (items.length > 0) {
        cy.get('div[data-testid^="todolist-item-"]').should(
          'have.length',
          items.length
        );
        cy.get('button[data-testid="todolist-item-delete-button"]')
          .first()
          .click();
        cy.get('div[data-testid^="todolist-item-"]').should(
          'have.length',
          items.length - 1
        );
        cy.get('body').then(cleanupAll);
      }
    });

    cy.get('div[data-testid^="todolist-item-"]').should('not.exist');
  });

  it('should display an empty state message when no todolists exist', () => {
    cy.get('[data-testid="empty-todolists-message"]').should('be.visible');
  });

  it('should allow creation of a new todolist', () => {
    const todolistName = `Test List ${Date.now()}`;
    createdTodolistName = todolistName;

    cy.get('input[data-testid="todolist-form-input"]').type(todolistName);
    cy.get('button[data-testid="todolist-form-submit-button"]').click();

    cy.contains(todolistName).should('exist');
    cy.get('div[data-testid^="todolist-item-"]')
      .contains(todolistName)
      .should('exist');
  });

  it('should allow deleting a todolist', () => {
    const todolistName = `Delete Test ${Date.now()}`;

    cy.get('input[data-testid="todolist-form-input"]').type(todolistName);
    cy.get('button[data-testid="todolist-form-submit-button"]').click();
    cy.contains(todolistName).should('exist');

    cy.get('[data-testid="todolist-title"]')
      .contains(todolistName)
      .parents('div[data-testid^="todolist-item-"]')
      .within(() => {
        cy.get('button[data-testid="todolist-item-delete-button"]').click();
      });

    cy.contains(todolistName).should('not.exist');

    createdTodolistName = null;
  });

  it('should display an error when trying to create a todolist with an empty name', () => {
    cy.get('button[data-testid="todolist-form-submit-button"]').click();
    cy.get('[data-testid="todolist-form-error"]').should('be.visible');
    cy.get('[data-testid="todolist-form-error"]').should(
      'have.text',
      'Todo list name cannot be empty.'
    );
  });
});
