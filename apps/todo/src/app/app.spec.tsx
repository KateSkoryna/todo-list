import { render } from '@testing-library/react';
import App from './app';

jest.mock('./tasks', () => {
  return {
    __esModule: true,
    default: () => <div />,
  };
});

describe('App', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<App />);

    expect(baseElement).toBeTruthy();
  });

  it('should have a greeting as the title', () => {
    const component = render(<App />);

    expect(component.baseElement).toMatchInlineSnapshot(`
      <body>
        <div>
          <h1>
            Your Tasks
          </h1>
          <div />
          <div />
        </div>
      </body>
    `);
    component.unmount();
  });
});
