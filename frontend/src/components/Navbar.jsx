import { Link, NavLink, useNavigate } from "react-router-dom";
import { FiBookOpen, FiHome, FiLogOut } from "react-icons/fi";

import "../styles/Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="app-navbar">
      <div className="app-navbar-inner">

        <Link className="app-navbar-brand" to="/dashboard">
          <span className="app-navbar-brand-icon">
            <FiBookOpen />
          </span>

          <span className="app-navbar-brand-text">
            AI Notes Summarizer
          </span>
        </Link>

        <div className="app-navbar-actions">

          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `app-navbar-link${isActive ? " active" : ""}`
            }
          >
            <FiHome />
            <span>Dashboard</span>
          </NavLink>

          <button
            type="button"
            className="app-navbar-logout"
            onClick={handleLogout}
          >
            <FiLogOut />
            <span>Logout</span>
          </button>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;
