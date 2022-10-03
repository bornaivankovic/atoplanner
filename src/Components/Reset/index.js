import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resetDecksState } from "../../Redux/Reducers/Decks";
import { resetHeroesState } from "../../Redux/Reducers/Heroes";
import { resetNotesState } from "../../Redux/Reducers/Notes";
import { resetPerksState } from "../../Redux/Reducers/Perks";
import { resetSearchState } from "../../Redux/Reducers/Search";

function Reset() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(resetDecksState());
    dispatch(resetHeroesState());
    dispatch(resetNotesState());
    dispatch(resetPerksState());
    dispatch(resetSearchState());
    navigate("/");
  });
  return <div className="Reset"></div>;
}

export default Reset;
