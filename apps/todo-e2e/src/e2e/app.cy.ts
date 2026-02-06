import {getListItem} from '../support/app.po';

describe('todo', () => {
  beforeEach(() => cy.visit({
    url:'/',
    timeout: 1000,
    failOnStatusCode: false
  }));

  it('should display list of todos', () => {
    getListItem().first().contains('Build a Todo backend');
  });
});
