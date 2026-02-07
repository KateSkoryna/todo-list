type ButtonProps = {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  dataTestId?: string;
};

const Button: React.FC<ButtonProps> = ({
  onClick,
  className = '',
  children,
  type = 'button',
  disabled = false,
  dataTestId,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={className}
      disabled={disabled}
      data-testid={dataTestId}
    >
      {children}
    </button>
  );
};

export default Button;
