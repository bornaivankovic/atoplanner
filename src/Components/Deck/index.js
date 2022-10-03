import React from "react";
import { useDrop } from "react-dnd";
import Card from "../Card";
import { useDispatch, useSelector } from "react-redux";
import "./deck.css";
import { addCardToDeck } from "../../Redux/Reducers/Decks";
import { nanoid } from "@reduxjs/toolkit";

const Deck = ({ heroPos, act }) => {
  const dispatch = useDispatch();
  let deck = useSelector((state) => state.decks[heroPos][act]);
  const [, drop] = useDrop(() => ({
    accept: "Card",
    drop: (item) =>
      dispatch(addCardToDeck({ heroPos: heroPos, act: act, card: item.card })),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  return (
    <div className="deck-container" ref={drop}>
      <div className="deck">
        <div>
          {deck.map((card, index) => (
            <Card
              cardInfo={card}
              key={nanoid()}
              isDraggable={false}
              index={index}
              isInDeck={true}
              heroPos={heroPos}
              act={act}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Deck;
