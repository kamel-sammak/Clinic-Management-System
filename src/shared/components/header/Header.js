import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  return (
    <div className="container-fluid sticky-top bg-white shadow-sm">
      <div className="container">
        <nav className="navbar navbar-expand-lg bg-white navbar-light py-3 py-lg-0">
          <Link to="/" className="navbar-brand">
            <h1 className="m-0 text-uppercase text-primary">
              <i className="fa fa-clinic-medical me-2"></i>Clinic Mangment
              System
            </h1>
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default Header;
