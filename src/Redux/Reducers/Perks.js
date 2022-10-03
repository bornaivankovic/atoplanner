import { createSlice } from "@reduxjs/toolkit";
import { heroes } from "../../utils/library";
import { typeToPoints } from "../../utils/utils";

export const initialHeroPerks = {
  activeTree: "general",
  totalPerks: 0,
  generalPerks: new Array(12).fill(new Array(7).fill("")),
  physPerks: new Array(12).fill(new Array(7).fill("")),
  elePerks: new Array(12).fill(new Array(7).fill("")),
  mysPerks: new Array(12).fill(new Array(7).fill("")),
};
let initialState = {};
heroes.all().map((hero) => (initialState[hero] = initialHeroPerks));

export const perksSlice = createSlice({
  name: "perks",
  initialState,
  reducers: {
    resetPerksState: () => initialState,
    addPerk: (state, action) => {
      state[action.payload.hero][action.payload.tree][action.payload.column][
        action.payload.index
      ] = action.payload.type;
      state[action.payload.hero].totalPerks += typeToPoints(
        action.payload.type
      );
    },
    removePerk: (state, action) => {
      state[action.payload.hero][action.payload.tree][action.payload.column][
        action.payload.index
      ] = "";
      state[action.payload.hero].totalPerks -= typeToPoints(
        action.payload.type
      );
    },
    setActiveTree: (state, action) => {
      state[action.payload.hero]["activeTree"] = action.payload.tree;
    },
    importTree: (state, action) => {
      state[action.payload.hero] = action.payload.perks;
    },
    resetTree: (state, action) => {
      state[action.payload.hero] = initialHeroPerks;
    },
  },
});
export const {
  resetPerksState,
  addPerk,
  removePerk,
  setActiveTree,
  importTree,
  resetTree
} = perksSlice.actions;
export default perksSlice.reducer;
