describe('Todo Application', () => {
  let todolistName: string;

  // Clean up all existing todolists and create one test todolist
  before(() => {
    cy.visit('/');

    const deleteAllExisting = ($body) => {
      const items = $body.find('div[data-testid^="todolist-item-"]');
      if (items.length > 0) {
        cy.get('button[data-testid="todolist-item-delete-button"]')
          .first()
          .click();

        cy.get('body').then(deleteAllExisting);
      }
    };

    cy.get('body').then(deleteAllExisting);

    cy.get('div[data-testid^="todolist-item-"]').should('not.exist');

    todolistName = `Test Todolist ${Date.now()}`;

    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.get('input[data-testid="todolist-form-input"]')
      .should('be.visible')
      .clear()
      .type(todolistName);

    cy.get('button[data-testid="todolist-form-submit-button"]').click();

    cy.get('div[data-testid^="todolist-item-"]', { timeout: 10000 }).should(
      'exist'
    );
    cy.get('[data-testid="todolist-title"]')
      .contains(todolistName)
      .should('be.visible');
  });

  // Visit page and expand todolist before each test
  beforeEach(() => {
    cy.visit('/');

    cy.get('[data-testid="todolist-title"]', { timeout: 10000 })
      .contains(todolistName)
      .should('be.visible')
      .parents('div[data-testid^="todolist-item-"]')
      .then(($list) => {
        const hasForm =
          $list.find('[data-testid="todo-form-input"]').length > 0;
        if (!hasForm) {
          cy.wrap($list).find('[data-testid="todolist-title"]').click();
        }
      });
  });

  // Clean up todos created in each test
  afterEach(() => {
    cy.get('body').then(($body) => {
      const todolistTitle = $body
        .find('[data-testid="todolist-title"]')
        .filter((_i, el) => {
          return el.textContent?.includes(todolistName);
        });

      if (todolistTitle.length > 0) {
        cy.wrap(todolistTitle)
          .first()
          .parents('div[data-testid^="todolist-item-"]')
          .then(($list) => {
            const todos = $list.find('div[data-testid^="todo-item-"]');
            if (todos.length > 0) {
              todos.each((_index, todo) => {
                cy.wrap(todo)
                  .find('button[data-testid^="todo-item-delete-button-"]')
                  .click();
              });
            }
          });
      }
    });
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

  it('should display an error when trying to add a todo with an empty name', () => {
    cy.get('[data-testid="todolist-title"]')
      .contains(todolistName)
      .parents('div[data-testid^="todolist-item-"]')
      .within(() => {
        cy.get('button[data-testid="todo-form-submit-button"]').click();
        cy.get('[data-testid="todo-error-message"]').should('be.visible');
        cy.get('[data-testid="todo-error-message"]').should(
          'have.text',
          'Title cannot be empty.'
        );
      });
  });

  it('should allow adding a new todo to a todolist', () => {
    const todoName = 'My New Todo';

    cy.get('[data-testid="todolist-title"]')
      .contains(todolistName)
      .parents('div[data-testid^="todolist-item-"]')
      .within(() => {
        cy.get('input[data-testid="todo-form-input"]').type(todoName);
        cy.get('button[data-testid="todo-form-submit-button"]').click();
        cy.contains(todoName).should('exist');
      });
  });

  it('should allow marking a todo as complete', () => {
    const todoName = 'Todo to Complete';

    cy.get('[data-testid="todolist-title"]')
      .contains(todolistName)
      .parents('div[data-testid^="todolist-item-"]')
      .within(() => {
        cy.get('input[data-testid="todo-form-input"]').type(todoName);
        cy.get('button[data-testid="todo-form-submit-button"]').click();
        cy.contains(todoName).should('exist');

        cy.contains('div[data-testid^="todo-item-"]', todoName).within(() => {
          cy.get('input[data-testid^="todo-item-complete-checkbox-"]').click();
        });

        cy.contains('div[data-testid^="todo-item-"]', todoName).should(
          'have.class',
          'completed'
        );
      });
  });

  it('should allow deleting a todo', () => {
    const todoName = 'Todo to Delete';

    cy.get('[data-testid="todolist-title"]')
      .contains(todolistName)
      .parents('div[data-testid^="todolist-item-"]')
      .within(() => {
        cy.get('input[data-testid="todo-form-input"]').type(todoName);
        cy.get('button[data-testid="todo-form-submit-button"]').click();
        cy.contains(todoName).should('exist');

        cy.contains('div[data-testid^="todo-item-"]', todoName).within(() => {
          cy.get('button[data-testid^="todo-item-delete-button-"]').click();
        });

        cy.contains(todoName).should('not.exist');
      });
  });

  it('should display an empty state message when no todos exist in a todolist', () => {
    cy.get('[data-testid="todolist-title"]')
      .contains(todolistName)
      .parents('div[data-testid^="todolist-item-"]')
      .within(() => {
        cy.get('[data-testid="empty-todos-message"]').should('be.visible');
      });
  });
});
