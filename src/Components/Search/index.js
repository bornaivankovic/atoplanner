import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCls,
  selectCls,
  selectTerm,
  setTerm,
} from "../../Redux/Reducers/Search";
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
      <option value="warrior">Warrior</option>
      <option value="scout">Scout</option>
      <option value="mage">Mage</option>
      <option value="healer">Healer</option>
      <option value="enchantment">Enchantment</option>
    </select>
  );

  return (
    <div className="search">
      <input
        type="text"
        placeholder="Type card name"
        onChange={({ target: { value } }) => {
          dispatch(setTerm({ term: value.toLowerCase() }));
        }}
      />
      <table>
        <tbody>
          <tr>
            <td>Class</td>
            <td>{classSelector}</td>
          </tr>
        </tbody>
      </table>

      <button
        className="search-button"
        onClick={() => {
          update();
        }}
      >
        Search
      </button>
    </div>
  );
};

export default Search;
