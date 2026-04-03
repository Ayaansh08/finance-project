import { NavLink } from "react-router-dom";

export const TestNavbar = () => {
  return (
    <nav>
      <NavLink to="/">Dashboard</NavLink>{" "}
      <NavLink to="/records">Records</NavLink>{" "}
      <NavLink to="/login">Login</NavLink>
    </nav>
  );
};
