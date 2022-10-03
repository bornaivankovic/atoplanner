import React, { useState } from "react";
import { useDrag, DragPreviewImage } from "react-dnd";
import { useDispatch } from "react-redux";
import { Tooltip, Dialog } from "@mui/material";
import { images } from "../../utils/utils";
import "./card.css";
import { addCardToDeck, removeCardFromDeck } from "../../Redux/Reducers/Decks";
import { getCardClass } from "../../utils/utils";

const Card = ({ cardInfo, isDraggable, index, isInDeck, heroPos, act }) => {
  const [isHovering, setHovering] = useState(false);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const img_url =
    images[getCardClass(cardInfo.name) + "/" + cardInfo.name + ".png"];
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setHovering(false);
  };
  const handleClick = (event) => {
    setHovering(false); //disables tooltip
    if (event.buttons === 2) {
      //if right click opens modal
      handleClickOpen();
      event.preventDefault();
      return false;
    }
  };
  const [, drag, conn] = useDrag(() => ({
    type: "Card",
    item: { card: cardInfo },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const TooltipDisplay = (
    <div>
      {cardInfo.name ? (
        <span>
          Name: {cardInfo.name}
          <br />
        </span>
      ) : (
        <></>
      )}
      {cardInfo.class ? (
        <span>
          Class: {cardInfo.class}
          <br />
        </span>
      ) : (
        <></>
      )}
      {cardInfo.rarity ? (
        <span>
          Rarity: {cardInfo.rarity}
          <br />
        </span>
      ) : (
        <></>
      )}
      {cardInfo.mana !== undefined ? (
        <span>
          Mana cost: {cardInfo.mana}
          <br />
        </span>
      ) : (
        <></>
      )}
    </div>
  );
  const DialogDisplay = (
    <div className="card-modal">
      <img alt="" src={img_url} />
      <div>
        {cardInfo.name ? (
          <h6>
            {cardInfo.name}
            <br />
          </h6>
        ) : (
          <></>
        )}
        {cardInfo.class ? (
          <span>
            Class: {cardInfo.class}
            <br />
          </span>
        ) : (
          <></>
        )}
        {cardInfo.rarity ? (
          <span>
            Rarity: {cardInfo.rarity}
            <br />
          </span>
        ) : (
          <></>
        )}
        {cardInfo.mana !== undefined ? (
          <span>
            Mana cost: {cardInfo.mana}
            <br />
          </span>
        ) : (
          <></>
        )}
      </div>
    </div>
  );

  return (
    <Tooltip
      title={TooltipDisplay}
      placement="right"
      open={isHovering && !open}
      onClose={handleClose}
    >
      <div
        className={isInDeck ? "card-deck" : "card"}
        onMouseOver={() => setHovering(true)}
        onMouseOut={() => setHovering(false)}
      >
        <DragPreviewImage src={img_url} connect={conn} />
        <img
          alt=""
          src={img_url}
          ref={isDraggable ? drag : null}
          width="90px"
          height="120px"
          onMouseDown={(e) => handleClick(e)}
          onContextMenu={(e) => e.preventDefault()}
          onClick={() =>
            isDraggable
              ? dispatch(
                  addCardToDeck({
                    heroPos: heroPos,
                    act: act,
                    card: cardInfo,
                  })
                )
              : dispatch(
                  removeCardFromDeck({
                    heroPos: heroPos,
                    act: act,
                    index: index,
                  })
                )
          }
        />
        <Dialog open={open} onClose={handleClose} maxWidth="md">
          {DialogDisplay}
        </Dialog>
      </div>
    </Tooltip>
  );
};

export default Card;
