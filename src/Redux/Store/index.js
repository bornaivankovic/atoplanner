import searchReducer from "../Reducers/Search";
import decksReducer from "../Reducers/Decks";
import perksReducer from "../Reducers/Perks";
import heroesReducer from "../Reducers/Heroes";
import notesReducer from "../Reducers/Notes";
import settingsReducer from "../Reducers/Settings";
import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

const reducers = combineReducers({
  search: searchReducer,
  decks: decksReducer,
  perks: perksReducer,
  heroes: heroesReducer,
  notes: notesReducer,
  settings: settingsReducer,
});
const persistConfig = {
  key: "root",
  storage,
};
const persistedReducer = persistReducer(persistConfig, reducers);
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export default store;
