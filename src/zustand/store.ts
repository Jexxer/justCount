import { create } from "zustand";

interface Counter {
  name: string,
  count: number,
  presets: number[]
}

interface CounterStore {
  counters: Counter[],
  currentCounter: number,
  incrementCounter: (n: number) => void,
  changeCounter: (n: number) => void,
  editPreset: (index: number, value: number) => void,
}

const useCounterStore = create<CounterStore>((set) => ({
  counters: [{
    name: 'My first counter',
    count: 0,
    presets: new Array(10).fill(0)
  }],
  currentCounter: 0,
  incrementCounter: (n: number) => {
    set((state) => {
      const newCounters = [...state.counters];
      newCounters[state.currentCounter].count += n;
      return { ...state, counters: newCounters }
    })
  },
  changeCounter: (n: number) => {
    set(() => ({ currentCounter: n }))
  },
  editPreset: (index: number, value: number) => {
    set((state) => {
      const newCounters = [...state.counters];
      newCounters[state.currentCounter].presets[index] = value;
      return { ...state, counters: newCounters };
    })
  }
}))
