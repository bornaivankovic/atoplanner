import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedHeroes: new Array(4).fill(""),
};

export const heroesSlice = createSlice({
  name: "heroes",
  initialState,
  reducers: {
    resetHeroesState: () =>  initialState,
    selectHero: (state, action) => {
      state.selectedHeroes[action.payload.pos] = action.payload.hero;
    },
  },
});
export const { resetHeroesState, selectHero } = heroesSlice.actions;
export const selectSelectedHeroes = (state) => state.heroes.selectedHeroes;
export default heroesSlice.reducer;
