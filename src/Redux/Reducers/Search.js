import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cls: "",
  term: "",
};

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    resetSearchState: () => initialState,
    setCls: (state, action) => {
      state.cls = action.payload.cls;
    },
    setTerm: (state, action) => {
      state.term = action.payload.term;
    },
  },
});
export const { resetSearchState, setCls, setTerm } = searchSlice.actions;
export const selectCls = (state) => state.search.cls;
export const selectTerm = (state) => state.search.term;
export default searchSlice.reducer;
