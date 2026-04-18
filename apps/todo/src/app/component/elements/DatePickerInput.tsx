import { useRef, useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/src/style.css';
import { CalendarDays } from 'lucide-react';
import dayjs from 'dayjs';

const DAY_PICKER_STYLE: React.CSSProperties = {
  '--rdp-today-color': '#eb8a4a',
  '--rdp-selected-border': 'none',
  '--rdp-day-width': '44px',
  '--rdp-day-height': '44px',
  '--rdp-day_button-width': '44px',
  '--rdp-day_button-height': '44px',
  '--rdp-accent-color': '#4aabeb',
  '--rdp-nav_button-width': '32px',
  '--rdp-nav_button-height': '32px',
  fontSize: '13px',
} as React.CSSProperties;

type DatePickerInputProps = {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  placeholder?: string;
};

const DatePickerInput: React.FC<DatePickerInputProps> = ({
  value,
  onChange,
  id,
  placeholder = 'Select date...',
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = value ? dayjs(value).toDate() : undefined;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        id={id}
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-2 py-2 rounded-lg border border-secondary-bg focus:border-accent focus:outline-none bg-white text-dark-bg text-sm min-w-[160px]"
      >
        <CalendarDays className="w-4 h-4 text-secondary-dark-bg shrink-0" />
        <span className={selected ? 'text-dark-bg' : 'text-secondary-dark-bg'}>
          {selected ? dayjs(selected).format('DD/MM/YYYY') : placeholder}
        </span>
      </button>

      {open && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 z-50 bg-base-bg rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.15)] flex flex-col items-center py-3 px-4">
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={(date) => {
              onChange(date ? dayjs(date).format('YYYY-MM-DD') : '');
              setOpen(false);
            }}
            weekStartsOn={1}
            navLayout="around"
            showOutsideDays
            style={DAY_PICKER_STYLE}
            modifiersClassNames={{
              selected:
                '[&>button]:!bg-accent [&>button]:!text-dark-bg [&>button]:!border-0 [&>button]:!rounded-[8px]',
              today: '[&>button]:!text-triadic-orange [&>button]:!font-bold',
            }}
          />
          {selected && (
            <button
              type="button"
              onClick={() => {
                onChange('');
                setOpen(false);
              }}
              className="text-xs text-secondary-dark-bg hover:text-dark-bg underline"
            >
              Clear
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default DatePickerInput;
