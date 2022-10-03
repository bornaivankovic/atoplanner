import React from "react";
import Card from "../Card";
import "./lister.css";
import { useSelector } from "react-redux";
import { cards } from "../../utils/library.js";
import { selectCls, selectTerm } from "../../Redux/Reducers/Search";

const Lister = ({ heroPos, act }) => {
  let curClass = useSelector(selectCls);
  let searchTerm = useSelector(selectTerm);

  function filterCards() {
    let allCards = [];
    if (curClass !== "" && searchTerm !== "") {
      cards[curClass]
        .filter((x) => x["name"].toLowerCase().includes(searchTerm))
        .map((x) => allCards.push(x));
    } else if (curClass !== "") {
      cards[curClass].map((x) => allCards.push(x));
    } else if (searchTerm !== "") {
      cards
        .all()
        .filter((x) => x["name"].toLowerCase().includes(searchTerm))
        .map((x) => allCards.push(x));
    } else {
      cards.all().map((x) => allCards.push(x));
    }
    return allCards;
  }
  return (
    <div className="lister">
      {filterCards().map((card) => (
        <Card
          cardInfo={card}
          key={card.name}
          isInDeck={false}
          isDraggable={true}
          heroPos={heroPos}
          act={act}
        />
      ))}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          margin: 0,
          justifyContent: "center",
          alignItems: "center",
        }}
      ></div>
    </div>
  );
};

export default Lister;
