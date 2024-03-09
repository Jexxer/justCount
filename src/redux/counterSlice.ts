import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@redux/store";

interface CounterType {
  name: string,
  count: number,
  presets: number[]
}


interface EditPresetType {
  presetIndex: number,
  value: number
}

export interface CounterState {
  counters: CounterType[],
  currentCounter: number,
}

const initialState: CounterState = {
  counters: [{ name: 'My first counter', count: 0, presets: new Array(10).fill(0) }],
  currentCounter: 0
}

export const counterSlice = createSlice({
  name: 'counters',
  initialState,
  reducers: {
    changeCounter: (state, action: PayloadAction<number>) => {
      if (action.payload > state.counters.length - 1) return
      state.currentCounter = action.payload;
    },
    incrementCounter: (state, action: PayloadAction<number>) => {
      state.counters[state.currentCounter].count += action.payload;
    },
    editPreset: (state, action: PayloadAction<EditPresetType>) => {
      state.counters[state.currentCounter].presets[action.payload.presetIndex] = action.payload.value;
    },
    resetCounter: (state) => {
      state.counters[state.currentCounter].count = 0;
    }
  }
})

export const { changeCounter, incrementCounter, editPreset, resetCounter } = counterSlice.actions;
export default counterSlice.reducer;
