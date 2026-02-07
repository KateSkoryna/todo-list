const Header: React.FC = () => {
  return (
    <header className="mb-8 text-center">
      <h1
        className="text-5xl font-bold text-dark-bg mb-2"
        data-testid="app-title"
      >
        Todo Lists
      </h1>
      <p className="text-dark-bg text-lg">Organize your tasks efficiently</p>
    </header>
  );
};

export default Header;
