import React from "react";
import "./navbar.css";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="navbar">
      <ul className="navigation">
        <li className="parent">
          <Link className="link" to="/">
            Home
          </Link>
        </li>
        <li className="parent">
          <Link className="link" to="/notes">
            Notes
          </Link>
        </li>
        <li className="parent">
          <Link className="link" to="/export">
            Export
          </Link>
        </li>
        <li className="parent">
          <Link className="link" to="/import">
            Import
          </Link>
        </li>
        <li className="parent">
          <Link className="link" to="/reset">
            Reset
          </Link>
        </li>
      </ul>
    </div>
  );
};
export default Navbar;
