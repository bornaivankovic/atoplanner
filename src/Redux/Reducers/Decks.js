import { createSlice } from "@reduxjs/toolkit";

const initialState = [
  { Act1: [], Act2: [], Act3: [], Act4: [] },
  { Act1: [], Act2: [], Act3: [], Act4: [] },
  { Act1: [], Act2: [], Act3: [], Act4: [] },
  { Act1: [], Act2: [], Act3: [], Act4: [] },
];

export const decksSlice = createSlice({
  name: "decks",
  initialState,
  reducers: {
    resetDecksState: () => initialState,
    resetDeckHeroPos: (state, action) => {
      state[action.payload.heroPos] = {
        Act1: [],
        Act2: [],
        Act3: [],
        Act4: [],
      };
    },
    addCardToDeck: (state, action) => {
      state[action.payload.heroPos][action.payload.act].push(
        action.payload.card
      );
    },
    removeCardFromDeck: (state, action) => {
      state[action.payload.heroPos][action.payload.act].splice(
        action.payload.index,
        1
      );
    },
  },
});
export const {
  resetDecksState,
  resetDeckHeroPos,
  addCardToDeck,
  removeCardFromDeck,
} = decksSlice.actions;
export default decksSlice.reducer;
