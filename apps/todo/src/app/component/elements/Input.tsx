type InputProps = {
  type?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  placeholder?: string;
  label?: string;
  id?: string;
  inputTestId?: string;
  labelTestId?: string;
  checked?: boolean;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
};

const Input: React.FC<InputProps> = ({
  type = 'text',
  value,
  onChange,
  className = '',
  placeholder = '',
  label,
  id,
  inputTestId,
  labelTestId,
  checked,
  onBlur,
  onKeyDown,
}) => {
  return (
    <>
      {label && (
        <label
          className="block text-sm font-medium text-dark-bg mb-1"
          data-testid={labelTestId}
          htmlFor={id}
        >
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={className}
        placeholder={placeholder}
        data-testid={inputTestId}
        checked={checked}
        autoFocus
        onKeyDown={onKeyDown}
      />
    </>
  );
};

export default Input;
