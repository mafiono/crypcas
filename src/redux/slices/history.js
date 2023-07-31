import { createSlice } from "@reduxjs/toolkit";

// NOTE: This is a very simplified implementation of history which will currently only remember
// the very last filter selected from the games page, so when going back from a game your
// filtered provider is still in effect.

const initialState = {
  lastFilter: "",
  filter: "",
};

const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    back: (state, _action) => {
      const filter = state.lastFilter;
      const lastFilter = "";

      return {
        ...state,
        filter,
        lastFilter,
      };
    },
    setFilter: (state, action) => {
      const lastFilter = state.filter;
      const filter = action.payload;

      return {
        ...state,
        lastFilter,
        filter,
      };
    },
  },
});

export const { back, setFilter } = historySlice.actions;

export default historySlice.reducer;
