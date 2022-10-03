import React from "react";
import { images } from "../../utils/utils";
import { heroes } from "../../utils/library";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./Heroes.css";
import { selectHero, selectSelectedHeroes } from "../../Redux/Reducers/Heroes";
import { Button } from "@mui/material";

class HeroList extends React.Component {
  onDragStart(e, hero) {
    e.dataTransfer.setData("hero", hero);
  }

  render() {
    return (
      <div className="hero-list">
        {heroes.warrior.map((hero) => (
          <figure
            draggable
            key={hero}
            className={hero}
            onDragStart={(e) => this.onDragStart(e, hero)}
          >
            <img alt="" src={images["heroes/" + hero + ".png"]}></img>
            <figcaption>{hero.toUpperCase()}</figcaption>
          </figure>
        ))}
        {heroes.scout.map((hero) => (
          <figure
            draggable
            key={hero}
            className={hero}
            onDragStart={(e) => this.onDragStart(e, hero)}
          >
            <img alt="" src={images["heroes/" + hero + ".png"]}></img>
            <figcaption>{hero.toUpperCase()}</figcaption>
          </figure>
        ))}
        {heroes.mage.map((hero) => (
          <figure
            draggable
            key={hero}
            className={hero}
            onDragStart={(e) => this.onDragStart(e, hero)}
          >
            <img alt="" src={images["heroes/" + hero + ".png"]}></img>
            <figcaption>{hero.toUpperCase()}</figcaption>
          </figure>
        ))}
        {heroes.healer.map((hero) => (
          <figure
            draggable
            key={hero}
            className={hero}
            onDragStart={(e) => this.onDragStart(e, hero)}
          >
            <img alt="" src={images["heroes/" + hero + ".png"]}></img>
            <figcaption>{hero.toUpperCase()}</figcaption>
          </figure>
        ))}
      </div>
    );
  }
}

class HeroSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onDrop = this.onDrop.bind(this);
  }
  onDrop(event, dest) {
    this.props.dispatch(
      selectHero({ pos: dest, hero: event.dataTransfer.getData("hero") })
    );
  }
  onDragOver(e) {
    e.preventDefault();
  }

  getPosImg(pos) {
    switch (pos) {
      case 0:
        return this.props.selectedHeroes[0] === ""
          ? images["hero_select/back.png"]
          : images["heroes/" + this.props.selectedHeroes[0] + ".png"];
      case 1:
        return this.props.selectedHeroes[1] === ""
          ? images["hero_select/mage.png"]
          : images["heroes/" + this.props.selectedHeroes[1] + ".png"];
      case 2:
        return this.props.selectedHeroes[2] === ""
          ? images["hero_select/scout.png"]
          : images["heroes/" + this.props.selectedHeroes[2] + ".png"];
      case 3:
        return this.props.selectedHeroes[3] === ""
          ? images["hero_select/front.png"]
          : images["heroes/" + this.props.selectedHeroes[3] + ".png"];
      default:
        break;
    }
  }

  handleClick(e, obj) {
    e.preventDefault();
    let entries = Object.entries(obj).flat();
    if (entries.length > 0 && entries[1][1] === "") {
      return;
    }
    this.setState(obj);
  }

  render() {
    let buttons = ["Perks", "Act1", "Act2", "Act3", "Act4"];
    let stateEntry = Object.entries(this.state).flat();
    if (stateEntry.length > 0 && stateEntry[0] === "Perks") {
      return <Navigate to={"/perks/" + this.state.Perks[1]} />;
    } else if (
      stateEntry.length > 0 &&
      stateEntry[0].startsWith("Act") &&
      stateEntry[1][1] !== ""
    ) {
      return (
        <Navigate
          to={
            "/build/" +
            stateEntry[0] +
            "_" +
            stateEntry[1][0] +
            "_" +
            stateEntry[1][1]
          }
        />
      );
    } else {
      return (
        <div className="hero-select">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="hero-pos">
              <img
                src={this.getPosImg(i)}
                onDrop={(e) => this.onDrop(e, i)}
                onDragOver={(e) => this.onDragOver(e)}
                draggable={false}
                alt=""
              />
              {buttons.map((b) => (
                <Button
                  variant="contained"
                  key={b + "_" + i}
                  onClick={(e) =>
                    this.handleClick(e, {
                      [b]: [i, this.props.selectedHeroes[i]],
                    })
                  }
                >
                  {b}
                </Button>
              ))}
            </div>
          ))}
        </div>
      );
    }
  }
}

class Heroes extends React.Component {
  render() {
    return (
      <div className="Heroes">
        <HeroList className="hero-list" />
        <HeroSelect
          className="hero-select"
          selectedHeroes={this.props.selectedHeroes}
          dispatch={this.props.dispatch}
        />
      </div>
    );
  }
}

function HeroesWrapper() {
  const dispatch = useDispatch();
  const selectedHeroes = useSelector(selectSelectedHeroes);
  return <Heroes dispatch={dispatch} selectedHeroes={selectedHeroes} />;
}

export default HeroesWrapper;
