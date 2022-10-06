import { Buffer } from "buffer";
import { initialHeroPerks } from "../Redux/Reducers/Perks";
import { cardClasses, cards, heroClasses, heroes, perks } from "./library";
const zlib = require("react-zlib-js");

export function getCardClass(cardName) {
  for (const cls of cardClasses) {
    for (const c of cards[cls]) {
      if (c["name"] === cardName) {
        return cls;
      }
    }
  }
}

export function getHeroClass(hero) {
  for (const cls of heroClasses) {
    for (const h of heroes[cls]) {
      if (h === hero) {
        return cls;
      }
    }
  }
}

export function clickedInsideRect(rect, clickCoords) {
  if (
    clickCoords.x >= rect.x &&
    clickCoords.y >= rect.y &&
    clickCoords.x <= rect.x + rect.width &&
    clickCoords.y <= rect.y + rect.height
  ) {
    return true;
  }
  return false;
}

export function clickedInsideCircle(circle, clickCoords) {
  if (
    (clickCoords.x - circle.x) ** 2 + (clickCoords.y - circle.y) ** 2 <=
    circle.r ** 2
  ) {
    return true;
  }
  return false;
}

export function getPerkCoords(column, index) {
  return {
    x: perks.offsetX + column * perks.columnW,
    y: perks.offsetY + index * perks.rowH,
    r: perks.circleR,
  };
}

export function transformCircleToSquare(circle) {
  return {
    x: circle.x - circle.r,
    y: circle.y - circle.r,
    width: 2 * circle.r,
    height: 2 * circle.r,
  };
}

function importAll(r) {
  let images = {};
  r.keys().forEach((item, index) => {
    images[item.replace("./", "")] = r(item);
  });
  return images;
}
export const images = importAll(
  require.context("../res", true, /\.(png|jpe?g|svg)$/)
);

export const fonts = importAll(require.context("../res", true, /\.(ttf)$/));

export function typeToPoints(type) {
  if (type.startsWith("normal")) {
    return 1;
  } else if (type.startsWith("special") || type.startsWith("golden")) {
    return 3;
  } else if (type === "") {
    return 0;
  } else {
    console.log("failed converting typetopoints " + type);
  }
}

export function getStateFromStorage() {
  const state = window.localStorage.getItem("state");
  if (state !== null) {
    return JSON.parse(
      Buffer.from(zlib.inflateSync(Buffer.from(state, "base64"))).toString()
    );
  }
}

export function jsonToB64(obj) {
  return Buffer.from(zlib.deflateSync(JSON.stringify(obj))).toString("base64");
}

export function B64ToJson(str) {
  return Buffer.from(zlib.inflateSync(Buffer.from(str, "base64"))).toString();
}

function perkATOName(perkInfo) {
  const columnName = perks[perkInfo.tree].columns[perkInfo.column].name;
  let tmpCol2 = [];
  let tmpCol = [];
  let suffix = "";
  if (perkInfo.chosen.includes("special")) {
    suffix = perkInfo.chosen.split("special")[1];
  }
  for (const sub of ["normal", "golden", "special"]) {
    for (const p of perks[perkInfo.tree].columns[perkInfo.column][sub]) {
      if (columnName.includes("/")) {
        let s = columnName.split("/");
        if (p.sub === s[0]) {
          tmpCol.push({ id: p.id, name: s[0] });
        } else {
          tmpCol2.push({ id: p.id, name: s[1] });
        }
      } else {
        tmpCol.push({ id: p.id, name: columnName });
      }
    }
  }
  tmpCol.sort((x, y) => x.id - y.id);
  tmpCol2.sort((x, y) => x.id - y.id);
  for (let i = 0; i < tmpCol.length; i++) {
    if (tmpCol[i].id === perkInfo.index) {
      return tmpCol[i].name + i + suffix;
    }
  }
  for (let i = 0; i < tmpCol2.length; i++) {
    if (tmpCol2[i].id === perkInfo.index) {
      return tmpCol2[i].name + i + suffix;
    }
  }
}

function toStrChain(inputPerks) {
  let str = inputPerks.totalPerks + "_";
  const prefix = "mainperk";
  for (const type of ["general", "phys", "ele", "mys"]) {
    const tmpPerks = inputPerks[type + "Perks"];
    for (let i = 0; i < tmpPerks.length; i++) {
      for (let j = 0; j < tmpPerks[i].length; j++) {
        if (tmpPerks[i][j] !== "") {
          const perkValue = perkATOName({
            tree: type + "Perks",
            column: i,
            index: j,
            chosen: tmpPerks[i][j],
          });
          str += prefix + perkValue + "-";
        }
      }
    }
  }
  return str.substring(0, str.length - 1);
}

function perkNameToColumn(perkName) {
  for (const type of ["general", "phys", "ele", "mys"]) {
    const tmpPerks = perks[type + "Perks"];
    for (let i = 0; i < tmpPerks.columns.length; i++) {
      for (const name of tmpPerks.columns[i].name.split("/")) {
        if (name === perkName) {
          return { tree: type + "Perks", column: i };
        }
      }
    }
  }
}

function perkColumnPosValue(perkInfo) {
  let tmpCol = [];
  for (const sub of ["normal", "golden", "special"]) {
    for (const p of perks[perkInfo.tree].columns[perkInfo.column][sub]) {
      if (p.sub !== undefined && p.sub === perkInfo.name) {
        tmpCol.push({ id: p.id, type: sub });
      } else if (p.sub === undefined) {
        tmpCol.push({ id: p.id, type: sub });
      }
    }
  }
  tmpCol.sort((x, y) => x.id - y.id);
  for (let i = 0; i < tmpCol.length; i++) {
    if (i === parseInt(perkInfo.index)) {
      return {
        value:
          tmpCol[i].type +
          perkInfo.index.substring(
            perkInfo.index.search(/\d/) + 1,
            perkInfo.index.length
          ),
        pos: tmpCol[i].id,
      };
    }
  }
}

function sumOfAllPerks(perks) {
  let sum = 0;
  for (const type of ["general", "phys", "ele", "mys"]) {
    for (const column of perks[type + "Perks"]) {
      for (const p of column) {
        sum += typeToPoints(p);
      }
    }
  }
  return sum;
}

function fromStrChain(str) {
  const perkList = str
    .substring(str.indexOf("_") + 1, str.length)
    .split("-")
    .map((x) => x.split("mainperk")[1]);
  let tmpPerks = JSON.parse(JSON.stringify(initialHeroPerks));
  for (const perk of perkList) {
    const perkName = perk.substring(0, perk.search(/\d/));
    const perkTreeColumn = perkNameToColumn(perkName);
    const perkPos = perkColumnPosValue({
      ...perkTreeColumn,
      index: perk.substring(perk.search(/\d/), perk.length),
      name: perkName,
    });
    tmpPerks[perkTreeColumn.tree][perkTreeColumn.column][perkPos.pos] =
      perkPos.value;
  }
  tmpPerks["totalPerks"] = sumOfAllPerks(tmpPerks);
  return tmpPerks;
}

export function toATOPerks(inputPerks) {
  const atoStr = toStrChain(inputPerks);
  const gzip = zlib.gzipSync(Buffer.from(atoStr));
  const tmpBuf = Buffer.from(new Uint32Array([atoStr.length]).buffer);
  const ret = Buffer.concat([tmpBuf, gzip]);
  return ret.toString("base64");
}

export function fromATOPerks(atoB64Str) {
  const decoded = Buffer.from(atoB64Str, "base64");
  const gunziped = Buffer.from(
    zlib.gunzipSync(decoded.subarray(4, decoded.length))
  );
  return fromStrChain(gunziped.toString());
}
