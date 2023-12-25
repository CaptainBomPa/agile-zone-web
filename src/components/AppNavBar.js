import * as React from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Avatar from "@mui/material/Avatar";
import UsernameButton from "./UsernameButton";
import { Link } from "react-router-dom";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { getLoginTheme } from "./WebTheme";
import { styled } from "@mui/material/styles";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import AssignmentIcon from "@mui/icons-material/Assignment";
import TipsAndUpdatesOutlinedIcon from "@mui/icons-material/TipsAndUpdatesOutlined";
import BackpackIcon from "@mui/icons-material/Backpack";
import BackpackOutlinedIcon from "@mui/icons-material/BackpackOutlined";
import BackpackTwoToneIcon from "@mui/icons-material/BackpackTwoTone";
import Switch from "@mui/material/Switch";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useUserRoles } from "../service/UserRolesProvider";
import StyleOutlinedIcon from '@mui/icons-material/StyleOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function AppNavBar({
  userDetails,
  userAvatar,
  handleLogout,
  useDarkMode,
  setUseDarkMode,
}) {
  const { userRoles } = useUserRoles();

  const [avatar, setAvatar] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const theme = getLoginTheme();

  React.useEffect(() => {
    setAvatar(
      userDetails?.firstName.charAt(0).toUpperCase() +
        userDetails?.lastName.charAt(0).toUpperCase()
    );
  }, [userDetails]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: "flex", flexGrow: 1 }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        open={open}
        color="pmLoginTheme"
        backgroundColor="pmLoginTheme.background"
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
        { window.innerWidth > 450 && <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            <Link
              to="/current-iteration"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div
                style={{
                  backgroundColor: "white",
                  display: "inline-block",
                  borderRadius: "4px",
                  padding: "4px 8px",
                }}
              >
                <span style={{ color: "black" }}>AGILE</span>
                <span style={{ color: "#9723ef" }}>ZONE</span>
              </div>
            </Link>{" "}
            - {userDetails?.team.teamName}
          </Typography>}
          <FormGroup sx={{ paddingRight: "50px" }}>
            <FormControlLabel
              control={
                <MaterialUISwitch
                  sx={{ m: 1 }}
                  defaultChecked={useDarkMode}
                  onClick={() => setUseDarkMode(!useDarkMode)}
                />
              }
              label={useDarkMode ? "Dark Mode" : "Light Mode"}
            />
          </FormGroup>
          {userAvatar && userAvatar.image && userAvatar.image.length > 2 ? (
            <Avatar
              sx={{ bgcolor: "gray" }}
              src={`data:image/png;base64,${userAvatar.image}`}
            />
          ) : (
            <Avatar sx={{ bgcolor: "gray" }}>
              {typeof avatar === "string" ? avatar : ""}
            </Avatar>
          )}
          <UsernameButton
            firstName={userDetails?.firstName}
            lastName={userDetails?.lastName}
            isAdministrator={userRoles?.some((element) => {
              return element === "ADMINISTRATOR";
            })}
            isProjectSupervisor={userRoles?.some((element) => {
              return element === "PROJECT_SUPERVISOR";
            })}
            handleLogout={handleLogout}
          />
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        open={open}
        color="pmLoginTheme"
        // backgroundColor="pmLoginTheme.background"
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <DrawerItem
          linkTo="/current-iteration"
          itemText="My Iteration"
          handleDrawerClose={handleDrawerClose}
          open={open}
          icon={<AssignmentOutlinedIcon />}
        />
        <DrawerItem
          linkTo="/iterations"
          itemText="Iterations"
          handleDrawerClose={handleDrawerClose}
          open={open}
          icon={<AssignmentIcon />}
        />
        <Divider />
        <DrawerItem
          linkTo="/my-backlog"
          itemText="My Backlog"
          handleDrawerClose={handleDrawerClose}
          open={open}
          icon={<BackpackOutlinedIcon />}
        />
        <DrawerItem
          linkTo="/backlogs"
          itemText="Backlogs"
          handleDrawerClose={handleDrawerClose}
          open={open}
          icon={<BackpackIcon />}
        />
        <DrawerItem
          linkTo="/project-backlog"
          itemText="Project Backlog"
          handleDrawerClose={handleDrawerClose}
          open={open}
          icon={<BackpackTwoToneIcon />}
        />
        <Divider />
        <DrawerItem
          linkTo="/features"
          itemText="Feature list"
          handleDrawerClose={handleDrawerClose}
          open={open}
          icon={<TipsAndUpdatesOutlinedIcon />}
        />
        <Divider />
        <DrawerItem
          linkTo="/plan-poker"
          itemText="Plan Poker"
          handleDrawerClose={handleDrawerClose}
          open={open}
          icon={<StyleOutlinedIcon />}
        />
        <Divider />
        <DrawerItem
          linkTo="/chat"
          itemText="Chat"
          handleDrawerClose={handleDrawerClose}
          open={open}
          icon={<ChatOutlinedIcon />}
        />
        <Divider />
      </Drawer>
    </Box>
  );
}

function DrawerItem(props) {
  const { linkTo, itemText, icon, handleDrawerClose, open } = props;

  return (
    <Link
      to={linkTo}
      style={{ textDecoration: "none", color: "inherit" }}
      onClick={handleDrawerClose}
    >
      <ListItem disablePadding sx={{ display: "block" }}>
        <ListItemButton
          sx={{
            minHeight: 48,
            justifyContent: open ? "initial" : "center",
            px: 2.5,
          }}
          color="pmLoginTheme.text"
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 3 : "auto",
              justifyContent: "center",
              color: "#9723EF",
            }}
          >
            {icon}
          </ListItemIcon>
          <ListItemText primary={itemText} sx={{ opacity: open ? 1 : 0 }} />
        </ListItemButton>
      </ListItem>
    </Link>
  );
}

export const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  "& .MuiSwitch-switchBase": {
    margin: 1,
    padding: 0,
    transform: "translateX(6px)",
    "&.Mui-checked": {
      color: "#fff",
      transform: "translateX(22px)",
      "& .MuiSwitch-thumb:before": {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          "#fff"
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.palette.mode === "dark" ? "#d49cff" : "#edd900",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: theme.palette.mode === "dark" ? "#9723ef" : "#b3a400",
    width: 32,
    height: 32,
    "&:before": {
      content: "''",
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        "#fff"
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
  },
  "& .MuiSwitch-track": {
    opacity: 1,
    backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
    borderRadius: 20 / 2,
  },
}));
