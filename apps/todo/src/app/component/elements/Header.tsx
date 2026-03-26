const Header: React.FC = () => {
  return (
    <header className="flex flex-col items-start">
      <h1 className="text-5xl font-bold text-dark-bg" data-testid="app-title">
        Task Manager
      </h1>
      <p className="text-dark-bg text-lg">Organize your tasks efficiently</p>
    </header>
  );
};

export default Header;
