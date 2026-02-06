type InputProps = {
  type?: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  placeholder?: string;
  label?: string;
  id?: string;
};

const Input: React.FC<InputProps> = ({
  type = 'text',
  value,
  onChange,
  className = '',
  placeholder = '',
  label,
  id,
}) => {
  return (
    <>
      {label && (
        <label className="block text-sm font-medium text-dark-bg mb-1">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        className={className}
        placeholder={placeholder}
      />
    </>
  );
};

export default Input;
