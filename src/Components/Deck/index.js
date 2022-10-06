import React, { useEffect, useRef, useState } from "react";
import { useDrop } from "react-dnd";
import Card from "../Card";
import { useDispatch, useSelector } from "react-redux";
import "./deck.css";
import { addCardToDeck, removeCardFromDeck } from "../../Redux/Reducers/Decks";
import { nanoid } from "@reduxjs/toolkit";
import { clickedInsideRect, getCardClass, images } from "../../utils/utils";
import { selectSelectedHeroes } from "../../Redux/Reducers/Heroes";
import { cards } from "../../utils/library";

export function DeckSimpleView({ heroPos, act }) {
  const dispatch = useDispatch();
  const deck = useSelector((state) => state.decks[heroPos][act]);
  const hero = useSelector(selectSelectedHeroes);
  const heroName =
    hero[heroPos][0].toUpperCase() +
    hero[heroPos].substring(1, hero[heroPos].length);
  const canvasRef = useRef();
  const [imgsLoaded, setImgsLoaded] = useState(false);
  let imgs = [{ id: "banner", url: images["bg/banner-cards-vertical.png"] }];
  for (const i of Array.from(Array(10).keys())) {
    imgs.push({ id: i, url: images["bg/mana-" + i + ".png"] });
  }
  const [imgObjs, setImgObjs] = useState([]);
  const [rects, setRects] = useState([]);

  const loadImage = (image) => {
    return new Promise((resolve, reject) => {
      const loadImg = new Image();
      loadImg.src = image.url;
      loadImg.onload = () => resolve({ id: image.id, obj: loadImg });
      loadImg.onerror = (err) => reject(err);
    });
  };

  function getImgObj(id) {
    return imgObjs.filter((x) => x.id === id)[0]["obj"];
  }

  function handleCanvasClick(e) {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    for (const rect of rects) {
      if (clickedInsideRect(rect.rect, { x: x, y: y })) {
        dispatch(
          removeCardFromDeck({
            heroPos: heroPos,
            act: act,
            index: deck.findIndex((x) => x.name === rect.card.name),
          })
        );
      }
    }
  }

  useEffect(() => {
    Promise.all(imgs.map((img) => loadImage(img)))
      .then((im) => {
        setImgsLoaded(true);
        im.forEach((o) =>
          setImgObjs((prev) => [...prev, { id: o.id, obj: o.obj }])
        );
      })
      .catch((err) => console.log("Failed to load images", err));
    if (imgsLoaded) {
      const deckCopy = JSON.parse(JSON.stringify(deck));
      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      setRects([]);
      ctx.drawImage(getImgObj("banner"), 0, 0);
      ctx.font = '35px "cantora"';
      ctx.fillStyle = "white";
      ctx.fillText(heroName + " cards (" + deckCopy.length + ")", 130, 60);
      ctx.font = '25px "cantora"';
      let cnt = 0;
      deckCopy.sort((x, y) => x.mana - y.mana || x.name.localeCompare(y.name));
      for (const card of deckCopy) {
        const rect = { x: 150, y: 35 * cnt + 150, width: 300, height: 30 };
        ctx.fillStyle = cards.colors[getCardClass(card.name)];
        ctx.fillRect(rect.x - 15, rect.y - 22, rect.width, rect.height);
        setRects((prev) => [
          ...prev,
          {
            rect: {
              x: rect.x - 15,
              y: rect.y - 22,
              width: rect.width,
              height: rect.height,
            },
            card: card,
          },
        ]);
        ctx.drawImage(getImgObj(card.mana), rect.x - 37, rect.y - 25, 37, 37);
        ctx.fillStyle = "white";
        ctx.fillText(card.name, rect.x, rect.y);
        cnt++;
      }
    }
  }, [imgsLoaded, deck]);
  return (
    <div className="deck-container">
      <div className="simple-deck">
        <canvas
          ref={canvasRef}
          width={800}
          height={1200}
          onClick={(e) => handleCanvasClick(e)}
        ></canvas>
      </div>
    </div>
  );
}

export const Deck = ({ heroPos, act }) => {
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
