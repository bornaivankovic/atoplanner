import { Button } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCls,
  selectCls,
  selectTerm,
  setTerm,
} from "../../Redux/Reducers/Search";
import { cardClasses } from "../../utils/library";
import "./search.css";

const Search = () => {
  const dispatch = useDispatch();
  const cls = useSelector(selectCls);
  const term = useSelector(selectTerm);

  const update = async () => {
    dispatch(setCls({ cls: cls }));
    dispatch(setTerm({ term: term }));
  };

  const classSelector = (
    <select
      onChange={({ target: { value } }) => {
        dispatch(
          setCls({
            cls: value.toLowerCase() === "unset" ? "" : value.toLowerCase(),
          })
        );
      }}
      value={cls}
    >
      <option value="unset">Unset</option>
      {cardClasses.map((x) => (
        <option value={x}>
          {x[0].toUpperCase() + x.substring(1, x.length)}
        </option>
      ))}
    </select>
  );

  return (
    <div className="search">
      {/* TODO mui text field */}
      <input
        type="text"
        placeholder="Type card name"
        onChange={({ target: { value } }) => {
          dispatch(setTerm({ term: value.toLowerCase() }));
        }}
      />
      {/* TODO mui select */}
      <table>
        <tbody>
          <tr>
            <td>Class</td>
            <td>{classSelector}</td>
          </tr>
        </tbody>
      </table>

      <Button
        variant="contained"
        className="search-button"
        onClick={() => {
          update();
        }}
      >
        Search
      </Button>
    </div>
  );
};

export default Search;
