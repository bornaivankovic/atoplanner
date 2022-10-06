import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  simpleDeck: false,
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setSimpleDeck: (state, action) => {
      state.simpleDeck = action.payload;
    },
  },
});
export const { setSimpleDeck } = settingsSlice.actions;
export const selectSimpleDeck = (state) => state.settings.simpleDeck;
export default settingsSlice.reducer;
