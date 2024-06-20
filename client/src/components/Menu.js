import React from 'react';
import { NavLink } from 'react-router-dom';

function Menu() {
  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark d-flex justify-content-center py-3">
        <ul className="nav nav-pills">
          <li className="nav-item">
            <NavLink to="/" end
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              Home
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/about" end
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              About
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Menu;