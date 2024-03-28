import React, { useState } from "react";
import {
  FaAngleRight,
  FaAngleLeft,
  FaChartBar,
  FaThLarge,
  FaBars,
  FaUsers,
  FaUser,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import "../styles/Navbar.css";

const ICON_SIZE = 20;

function Navbar() {
  const [ visible,setNavVisible] = useState(false);
  const [show, setNavShow] = useState(false);
  const [hideNavbar, setHideNavbar] = useState(false);
 
  return (
    <>
      <div className="mobile-nav">
        <button
          className="mobile-nav-btn"
          onClick={() => setNavVisible(!visible)}
        >
          <FaBars size={24} />
        </button>
      </div>
      <nav className={!visible ? "navbar" : ""}>
        <button
          type="button"
          className="nav-btn"
          onClick={() => setNavVisible(!visible)}
        >
          {!visible ? <FaAngleRight size={30} /> : <FaAngleLeft size={30} />}
        </button>
        <div>
          <NavLink className="logo" to="/">
            <img src="../img/logo.png" alt="logo" />
          </NavLink>
          <div className="links nav-top">
            <NavLink to="/dashboard" className="nav-link">
              <FaThLarge size={ICON_SIZE} />
              <span>Finanzas</span>
            </NavLink>
            <NavLink to="/dashboard/clientes" className="nav-link">
              <FaUsers size={ICON_SIZE} />
              <span>Clientes</span>
            </NavLink>
            <NavLink to="/dashboard/ingresos/egresos" className="nav-link">
              <FaChartBar size={ICON_SIZE} />
              <span>Ingreso/Egreso </span>
            </NavLink>
          </div>
        </div>

        <div className="links nav-botom">
          <NavLink to="/dashboard/perfil" className="nav-link">
            <FaUser size={ICON_SIZE} />
            <span>Mi Perfil</span>
          </NavLink>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
/**
 <NavLink to="/settings" className="nav-link">
						<FaCog size={ICON_SIZE} />
						<span>Settings</span> 
					</NavLink>
 */
