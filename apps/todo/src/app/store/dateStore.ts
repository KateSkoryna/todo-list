import { create } from 'zustand';
import dayjs, { Dayjs } from 'dayjs';

interface DateState {
  selectedDate: Dayjs;
  setSelectedDate: (date: Dayjs) => void;
}

export const useDateStore = create<DateState>((set) => ({
  selectedDate: dayjs(),
  setSelectedDate: (date) => set({ selectedDate: date }),
}));
