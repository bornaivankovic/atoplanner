import React, { useEffect } from "react";
import "./Build.css";
import Deck from "../Deck";
import Search from "../Search";
import Lister from "../Lister";
import { useParams } from "react-router-dom";
import { getHeroClass } from "../../utils/utils";
import { useDispatch } from "react-redux";
import { setCls } from "../../Redux/Reducers/Search";

function Build() {
  const params = useParams();
  const act = params["build"].split("_")[0];
  const heroPos = params["build"].split("_")[1];
  const heroName = params["build"].split("_")[2];
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setCls({ cls: getHeroClass(heroName) }));
  });
  return (
    <div className="Build">
      <Search />
      <Lister heroPos={heroPos} act={act} />
      <Deck heroPos={heroPos} act={act} />
    </div>
  );
}

export default Build;
