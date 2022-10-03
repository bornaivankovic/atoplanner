import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  noteContents: "",
};

export const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    resetNotesState: () =>  initialState,
    setNoteContents: (state, action) => {
      state.noteContents = action.payload.noteContents;
    },
  },
});
export const { resetNotesState, setNoteContents } = notesSlice.actions;
export const selectNotes = (state) => state.notes.noteContents;
export default notesSlice.reducer;
