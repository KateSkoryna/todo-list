import { useRef } from 'react';
import { ChevronDown } from 'lucide-react';

interface DetailsSelectProps<T extends string> {
  id?: string;
  value: T | '';
  onChange: (value: T | '') => void;
  options: { value: T; label: string }[];
  placeholder: string;
}

function DetailsSelect<T extends string>({
  id,
  value,
  onChange,
  options,
  placeholder,
}: DetailsSelectProps<T>) {
  const ref = useRef<HTMLDetailsElement>(null);
  const selected = options.find((o) => o.value === value);

  const handleSelect = (val: T | '') => {
    onChange(val);
    if (ref.current) ref.current.removeAttribute('open');
  };

  return (
    <details ref={ref} id={id} className="relative">
      <summary className="flex justify-between items-center px-3 py-2 rounded-lg border-2 border-secondary-bg bg-base-bg text-dark-bg cursor-pointer list-none focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent select-none">
        <span className={selected ? 'text-dark-bg' : 'text-secondary-dark-bg'}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown className="ml-2 h-4 w-4 text-secondary-dark-bg" />
      </summary>
      <ul className="absolute z-10 mt-1 w-full bg-base-bg border-2 border-secondary-bg rounded-lg shadow-lg overflow-hidden list-none p-0">
        <li
          onClick={() => handleSelect('')}
          className="px-3 py-2 text-sm text-secondary-dark-bg cursor-pointer hover:bg-secondary-bg transition-colors"
        >
          {placeholder}
        </li>
        {options.map((o) => (
          <li
            key={o.value}
            onClick={() => handleSelect(o.value)}
            className={`px-3 py-2 text-sm cursor-pointer transition-colors ${
              value === o.value
                ? 'bg-accent text-black font-medium'
                : 'text-dark-bg hover:bg-secondary-bg'
            }`}
          >
            {o.label}
          </li>
        ))}
      </ul>
    </details>
  );
}

export default DetailsSelect;
