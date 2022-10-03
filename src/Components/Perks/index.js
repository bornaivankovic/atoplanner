import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  clickedInsideRect,
  images,
  getPerkCoords,
  transformCircleToSquare,
  toATOPerks,
  fromATOPerks,
} from "../../utils/utils";
import { menuItems, perks } from "../../utils/library";
import {
  addPerk,
  importTree,
  removePerk,
  resetTree,
  setActiveTree,
} from "../../Redux/Reducers/Perks";
import { Button, Tooltip, tooltipClasses } from "@mui/material";
import { styled } from "@mui/material/styles";
import "./Perks.css";
import { nanoid } from "@reduxjs/toolkit";

class TopBar extends React.Component {
  constructor(props) {
    super(props);
    this.clickedTopBar = this.clickedTopBar.bind(this);
    this.img = React.createRef();
  }
  clickedTopBar(e) {
    let x = e.pageX;
    let y = e.pageY;
    for (let i = 0; i < menuItems.perkClasses.length; i++) {
      if (
        clickedInsideRect(
          {
            x: i * menuItems.width + this.img.current.x,
            y: this.img.current.y,
            width: menuItems.width,
            height: menuItems.height,
          },
          { x: x, y: y }
        )
      ) {
        this.props.dispatch(
          setActiveTree({
            hero: this.props.hero,
            tree: menuItems.perkClasses[i],
          })
        );
      }
    }
  }
  getActiveBarImg() {
    switch (this.props.activeTree) {
      case "phys":
        return images["perks/phys_top_bar.png"];
      case "ele":
        return images["perks/ele_top_bar.png"];
      case "mys":
        return images["perks/mys_top_bar.png"];
      case "general":
        return images["perks/general_top_bar.png"];
      default:
        console.log("cannot load top bar " + this.props.activeTree);
        break;
    }
  }
  render() {
    return (
      <div className="top-bar" onClick={this.clickedTopBar}>
        <img
          alt=""
          src={this.getActiveBarImg()}
          ref={this.img}
          onDragStart={(e) => e.preventDefault()}
        ></img>
      </div>
    );
  }
}

class PerkArea extends React.Component {
  clickedPerk(perk) {
    if (
      this.props.heroPerks[this.props.heroPerks.activeTree + "Perks"][
        perk.column
      ][perk.index] === ""
    ) {
      this.props.dispatch(addPerk(perk));
    } else {
      this.props.dispatch(removePerk(perk));
    }
  }
  render() {
    const tmpCoords = getPerkCoords(
      this.props.perk.column,
      this.props.perk.index
    );
    let tooltip;
    let tooltipDisplay = (
      <div>
        <span>
          <h2>
            {this.props.perk.name[0].toUpperCase() +
              this.props.perk.name.substr(1, this.props.perk.name.length)}
          </h2>
          <br />
        </span>
        <span>
          {this.props.perk.desc}
          <br />
        </span>
      </div>
    );
    let tmpBox = { width: tmpCoords.r, height: 0, startX: 0, startY: 0 };
    if (this.props.perk.type === "special") {
      tmpBox.startX = tmpCoords.x - tmpCoords.r;
      tmpBox.startY = tmpCoords.y - tmpCoords.r;
      tmpBox.height = 2 * tmpCoords.r;
      tmpBox.width = 2 * tmpCoords.r;
      const CustomTooltip = React.forwardRef((props, ref) => {
        const lmoa = perks[this.props.perk.tree].columns[
          this.props.perk.column
        ]["special"].filter((x) => x.id === this.props.perk.index)[0]["opts"];
        return (
          <div {...props} ref={ref}>
            <h2>
              {this.props.perk.name[0].toUpperCase() +
                this.props.perk.name.substr(1, this.props.perk.name.length)}
            </h2>
            {lmoa.map((x, i) => (
              <Tooltip key={nanoid()} placement="top" title={x.desc}>
                <img
                  alt={x.desc}
                  key={nanoid()}
                  onClick={() =>
                    this.clickedPerk({
                      ...this.props.perk,
                      type: "special" + String.fromCharCode(97 + i),
                    })
                  }
                  src={images["perks/perkSquareAvailable.png"]}
                ></img>
              </Tooltip>
            ))}
          </div>
        );
      });
      const NoMaxWidthTooltip = styled(({ className, ...props }) => (
        <Tooltip {...props} classes={{ popper: className }} />
      ))({
        [`& .${tooltipClasses.tooltip}`]: {
          maxWidth: "none",
        },
      });
      tooltip = (
        <NoMaxWidthTooltip
          title={<CustomTooltip />}
          leaveDelay={200}
          placement="bottom"
        >
          <div
            style={{
              left: tmpBox.startX,
              top: tmpBox.startY,
              width: tmpBox.width + "px",
              height: tmpBox.height + "px",
            }}
          >
            <area
              key={this.props.perk.column + "," + this.props.perk.index}
              alt=""
              shape="rect"
              coords={
                tmpCoords.x -
                tmpCoords.r +
                "," +
                (tmpCoords.y - tmpCoords.r) +
                "," +
                (tmpCoords.x + tmpCoords.r) +
                "," +
                (tmpCoords.y + tmpCoords.r)
              }
            />
          </div>
        </NoMaxWidthTooltip>
      );
    } else {
      tooltip = (
        <Tooltip
          key={nanoid()}
          title={tooltipDisplay}
          sx={{ ml: 150 }}
          placement="right"
        >
          <div
            style={{
              left: tmpCoords.x,
              top: tmpCoords.y,
              width: tmpBox.width,
              height: tmpBox.height,
            }}
          >
            <area
              key={this.props.perk.column + "," + this.props.perk.index}
              alt=""
              shape="circle"
              coords={tmpCoords.x + "," + tmpCoords.y + "," + tmpCoords.r}
              onClick={() => this.clickedPerk(this.props.perk)}
            />
          </div>
        </Tooltip>
      );
    }

    return <div>{tooltip}</div>;
  }
}

class MainScreen extends React.Component {
  constructor(props) {
    super(props);
    this.img = React.createRef();
    this.canvas = React.createRef();
  }
  canvasDraw() {
    var c = this.canvas.current.getContext("2d");
    c.clearRect(0, 0, this.canvas.current.width, this.canvas.current.height);
    c.lineWidth = 5;
    const perkTree = this.props.heroPerks.activeTree + "Perks";
    this.props.heroPerks[perkTree].forEach((column, ci) => {
      column.forEach((element, index) => {
        c.strokeStyle = "#f5f5f5";
        if (element.length > 0) {
          let coords = getPerkCoords(ci, index);
          if (element.startsWith("special")) {
            coords = transformCircleToSquare(coords);
            c.strokeStyle = "#ffd700";
            c.strokeRect(coords.x, coords.y, coords.width, coords.height);
            return;
          } else if (element === "golden") {
            c.strokeStyle = "#ffd700";
          }
          c.beginPath();
          c.arc(coords.x, coords.y, coords.r, 0, Math.PI * 2);
          c.stroke();
        }
      });
    });
  }
  componentDidUpdate() {
    this.canvasDraw();
  }
  componentDidMount() {
    this.canvasDraw();
  }
  getActiveTreeImg() {
    switch (this.props.heroPerks.activeTree) {
      case "phys":
        return images["perks/phys.png"];
      case "ele":
        return images["perks/ele.png"];
      case "mys":
        return images["perks/mys.png"];
      case "general":
        return images["perks/general.png"];
      default:
        console.log("cannot load perk tree " + this.props.heroPerks.activeTree);
        break;
    }
  }

  generateMap() {
    let areas = [];
    const perkTree = this.props.heroPerks.activeTree + "Perks";
    perks[perkTree].columns.forEach((element, index) => {
      ["normal", "golden", "special"].forEach((type) =>
        element[type].forEach((i) => {
          const perk = {
            hero: this.props.hero,
            tree: perkTree,
            column: index,
            index: i.id,
            type: type,
            desc: i.desc,
            name: i.sub === undefined ? element.name : i.sub,
          };
          areas.push(
            <PerkArea
              key={perk.column + "," + perk.index}
              heroPerks={this.props.heroPerks}
              perk={perk}
              dispatch={this.props.dispatch}
            />
          );
        })
      );
    });
    return <map name="treemap">{areas}</map>;
  }
  render() {
    const canvasSize = { width: 1413, height: 922 };
    return (
      <div className="main-screen">
        <canvas
          id="canvas"
          height={canvasSize.height}
          width={canvasSize.width}
          ref={this.canvas}
        ></canvas>
        <img
          id="image"
          alt=""
          src={this.getActiveTreeImg()}
          ref={this.img}
          useMap="#treemap"
          onDragStart={(e) => e.preventDefault()}
        />
        {this.generateMap()}
      </div>
    );
  }
}

class SideBar extends React.Component {
  render() {
    return (
      <div className="side-bar">
        <img
          alt=""
          src={images["perks/side_bar.png"]}
          onDragStart={(e) => e.preventDefault()}
        ></img>
      </div>
    );
  }
}

class PerkCounter extends React.Component {
  constructor(props) {
    super(props);
    this.textRef = React.createRef();
  }
  getImg() {
    return this.props.hero === undefined
      ? ""
      : images["heroes/" + this.props.hero + ".png"];
  }
  selectAll() {
    this.textRef.current.select();
  }
  handleImport() {
    let parsedPerks = fromATOPerks(this.textRef.current.value);
    parsedPerks.activeTree = this.props.heroPerks.activeTree;
    this.props.dispatch(
      importTree({
        hero: this.props.hero,
        perks: parsedPerks,
      })
    );
  }
  handleExport() {
    this.textRef.current.value = toATOPerks(this.props.heroPerks);
  }
  handleReset() {
    this.props.dispatch(resetTree({ hero: this.props.hero }));
  }
  render() {
    return (
      <div id="perk-counter" className="perk-counter">
        <img
          alt=""
          src={this.getImg()}
          onDragStart={(e) => e.preventDefault()}
        />
        <h1>Total perks:</h1>
        <h3>{this.props.heroPerks.totalPerks}/50</h3>
        <Button variant="contained" onClick={() => this.handleImport()}>
          IMPORT
        </Button>
        <Button variant="contained" onClick={() => this.handleExport()}>
          EXPORT
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => this.handleReset()}
        >
          RESET
        </Button>
        <br />
        <textarea
          onFocus={() => this.selectAll()}
          ref={this.textRef}
          placeholder="Input your perk tree code"
        ></textarea>
      </div>
    );
  }
}

class Perks extends React.Component {
  render() {
    return (
      <div className="Perks">
        <TopBar
          activeTree={this.props.heroPerks.activeTree}
          dispatch={this.props.dispatch}
          hero={this.props.hero}
        />
        <MainScreen
          heroPerks={this.props.heroPerks}
          dispatch={this.props.dispatch}
          hero={this.props.hero}
        />
        <SideBar />
        <PerkCounter
          heroPerks={this.props.heroPerks}
          hero={this.props.hero}
          dispatch={this.props.dispatch}
        />
      </div>
    );
  }
}

function PerksWrapper() {
  const params = useParams();
  const dispatch = useDispatch();
  const heroPerks = useSelector((state) => state.perks[params["hero"]]);
  return (
    <Perks hero={params["hero"]} dispatch={dispatch} heroPerks={heroPerks} />
  );
}

export default PerksWrapper;
