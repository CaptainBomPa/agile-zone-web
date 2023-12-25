import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Link } from "react-router-dom";

export default function UsernameButton({
  firstName,
  lastName,
  isAdministrator,
  handleLogout,
  isProjectSupervisor,
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const logout = () => {
    handleLogout();
  };

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{ color: "white" }}
      >
        {firstName} {lastName}
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {isProjectSupervisor && (
          <Link
            to="/manage-tags"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <MenuItem onClick={handleClose}>Manage tags</MenuItem>
          </Link>
        )}
        {isAdministrator && (
          <Link
            to="/request-add-user"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <MenuItem onClick={handleClose}>Requests</MenuItem>
          </Link>
        )}
        {isAdministrator && (
          <Link
            to="/user-management"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <MenuItem onClick={handleClose}>User Management</MenuItem>
          </Link>
        )}
        <Link
          to="/settings"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <MenuItem onClick={handleClose}>Settings</MenuItem>
        </Link>
        <MenuItem onClick={logout}>Logout</MenuItem>
      </Menu>
    </div>
  );
}
