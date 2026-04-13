import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Bell, CalendarDays } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/src/style.css';

const DAY_PICKER_STYLE: React.CSSProperties = {
  '--rdp-today-color': '#eb8a4a',
  '--rdp-selected-border': 'none',
  '--rdp-day-width': '50px',
  '--rdp-day-height': '50px',
  '--rdp-day_button-width': '50px',
  '--rdp-day_button-height': '50px',
  '--rdp-accent-color': '#4aabeb',
  '--rdp-nav_button-width': '36px',
  '--rdp-nav_button-height': '36px',
  fontSize: '14px',
} as React.CSSProperties;

const ROUTE_TITLES: Record<string, string> = {
  '/': 'Dashboard',
  '/vital': 'Vital Task',
  '/tasks': 'My Task',
  '/statistics': 'Statistics',
  '/settings': 'Settings',
  '/help': 'Help',
};

function TopHeader() {
  const { pathname } = useLocation();
  const title = ROUTE_TITLES[pathname] ?? 'Dashboard';

  const today = new Date();
  const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  const dateStr = `${day}/${month}/${year}`;

  const [selected, setSelected] = useState<Date | undefined>(today);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(e.target as Node)
      ) {
        setCalendarOpen(false);
      }
    }
    if (calendarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [calendarOpen]);

  return (
    <header className="h-24 flex items-center gap-4 bg-base-bg shadow-[0px_4px_12px_rgba(0,0,0,0.1)] shrink-0">
      <div className="w-64 shrink-0 flex items-center justify-center px-6">
        <h2 className="text-xl font-bold text-dark-bg">{title}</h2>
      </div>

      <div className="flex-1 flex justify-center pr-6">
        <div className="flex items-center gap-2 w-full max-w-xl">
          <input
            type="text"
            placeholder="Search your task here..."
            className="flex-1 px-4 py-2 rounded-lg bg-gray-100 text-sm text-dark-bg placeholder:text-secondary-dark-bg focus:outline-none shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
          />
          <button
            aria-label="Search"
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-triadic-orange text-white shadow-[0_2px_8px_rgba(235,138,74,0.4)] hover:opacity-90 transition-opacity shrink-0"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 pr-6">
        <button
          aria-label="Notifications"
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-triadic-orange text-white hover:opacity-90 transition-opacity"
        >
          <Bell className="w-4 h-4" />
        </button>

        <div className="relative" ref={calendarRef}>
          <button
            aria-label="Calendar"
            onClick={() => setCalendarOpen((o) => !o)}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-triadic-orange text-white hover:opacity-90 transition-opacity"
          >
            <CalendarDays className="w-4 h-4" />
          </button>

          {calendarOpen && (
            <div
              className="absolute right-0 top-11 z-50 bg-base-bg rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.15)]"
              style={{ width: 378 }}
            >
              <div className="flex items-center justify-between px-[14px] pt-4 pb-2">
                <span className="font-bold text-dark-bg">Calendar</span>
                <button
                  onClick={() => setCalendarOpen(false)}
                  className="text-secondary-dark-bg hover:text-dark-bg transition-colors"
                  aria-label="Close calendar"
                >
                  ✕
                </button>
              </div>

              {selected && (
                <div className="mx-[14px] mb-2 px-3 py-2 rounded-lg border border-secondary-bg text-sm text-dark-bg">
                  {selected.toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </div>
              )}

              <DayPicker
                mode="single"
                selected={selected}
                onSelect={setSelected}
                weekStartsOn={1}
                navLayout="around"
                showOutsideDays
                style={DAY_PICKER_STYLE}
                modifiersClassNames={{
                  selected:
                    '[&>button]:!bg-accent [&>button]:!text-dark-bg [&>button]:!border-0 [&>button]:!rounded-[8px]',
                  today:
                    '[&>button]:!text-triadic-orange [&>button]:!font-bold',
                }}
              />
            </div>
          )}
        </div>

        <div className="flex flex-col items-center leading-tight">
          <span className="text-sm font-bold text-dark-bg">{dayName}</span>
          <span className="text-sm font-semibold text-triadic-blue">
            {dateStr}
          </span>
        </div>
      </div>
    </header>
  );
}

export default TopHeader;
