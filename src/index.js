import React from "react";
import { createRoot } from "react-dom/client";
import store from "./Redux/Store";
import { Provider } from "react-redux";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./index.css";
import Build from "./Components/Build";
import PerksWrapper from "./Components/Perks";
import HeroesWrapper from "./Components/Heroes";
import Navbar from "./Components/Navbar";
import Notes from "./Components/Notes";
import Export from "./Components/Export";
import Import from "./Components/Import";
import Reset from "./Components/Reset";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { images } from "./utils/utils";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";

document.getElementsByTagName("body")[0].style.backgroundImage =
  "url(" + images["bg/bg-4.png"] + ")";
const container = document.getElementById("root");
const root = createRoot(container);

let persist = persistStore(store);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persist}>
        <DndProvider backend={HTML5Backend}>
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route path="/" element={<HeroesWrapper />} />
              <Route path="/perks/:hero" element={<PerksWrapper />} />
              <Route path="/build/:build" element={<Build />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/export" element={<Export />} />
              <Route path="/import" element={<Import />} />
              <Route path="/reset" element={<Reset />} />
            </Routes>
          </BrowserRouter>
        </DndProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
