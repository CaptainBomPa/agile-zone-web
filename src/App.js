import React, { useState } from "react";
import AppNavBar from "./components/AppNavBar";
import Login from "./components/Login";
import useToken from "./useToken";
import { Route, Routes, useNavigate } from "react-router-dom";
import Nopage from "../src/pages/NoPage";
import UserSettings from "../src/pages/UserSettings";
import { getUserAvatar, getUserInfo } from "./service/UsersInfo";
import axios from "axios";
import OtherUserStoryIterations from "./components/OtherUserStoryIterations";
import CurrentTeamIteration from "./components/CurrentTeamIteration";
import BacklogCurrentUser from "./components/BacklogCurrentUser";
import BacklogSelectTeam from "./components/BacklogSelectTeam";
import BacklogProject from "./components/BacklogProject";
import { ThemeProvider } from "@emotion/react";
import { getLoginTheme } from "./components/WebTheme";
import { Box } from "@mui/material";
import AdminPage from "./components/AdminPage";
import Register from "./components/Register";
import AutoHideAlert from "./components/AutoHideAlert";
import RequestAdd from "./components/RequestAdd";
import { UserRolesProvider } from "./service/UserRolesProvider";
import ManageTags from "./components/ManageTags";
import FeatureWrapper from "./components/FeatureWrapper";
import Chat from "./components/Chat";

function App() {
  const [navOpen, setNavOpen] = useState(false);
  const [userDetails, setUserDetails] = useState();
  const [userAvatar, setUserAvatar] = useState();
  const [useDarkMode, setUseDarkMode] = useState(true);
  const [onRegisterForm, setOnRegisterForm] = useState(false);
  const navigate = useNavigate();

  //alert
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("info");
  const showAutoHideAlert = (message, severity, duration) => {
    setAlertMessage(message);
    setAlertType(severity);
    setAlertOpen(true);

    setTimeout(() => {
      setAlertOpen(false);
    }, duration);
  };

  document.body.style.backgroundColor =
    getLoginTheme(useDarkMode).palette.pmLoginTheme.background;

  axios.defaults.headers.common["Content-Type"] = "application/json";
  const { token, setToken } = useToken();
  if (!token && onRegisterForm) {
    return (
      <Box>
        <AutoHideAlert
          alertOpen={alertOpen}
          alertType={alertType}
          alertMessage={alertMessage}
          setAlertOpen={setAlertOpen}
        />
        <Register
          setOnRegisterForm={setOnRegisterForm}
          useDarkMode={useDarkMode}
          showAutoHideAlert={showAutoHideAlert}
        />
      </Box>
    );
  } else if (!token) {
    return (
      <Box>
        <AutoHideAlert
          alertOpen={alertOpen}
          alertType={alertType}
          alertMessage={alertMessage}
          setAlertOpen={setAlertOpen}
        />
        <Login
          setToken={setToken}
          navigate={navigate}
          setOnRegisterForm={setOnRegisterForm}
          useDarkMode={useDarkMode}
          setUseDarkMode={setUseDarkMode}
          showAutoHideAlert={showAutoHideAlert}
        />
      </Box>
    );
  } else {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  if (!userDetails) {
    const fetchUserData = async (e) => {
      await getUserInfo({ token }).then((res) => {
        setUserDetails(res);
      });
    };
    fetchUserData.apply();
  }

  if (userAvatar === null || userDetails === undefined) {
    const fetchUserAvatar = async (e) => {
      const data = await getUserAvatar();
      setUserAvatar(data);
    };
    fetchUserAvatar.apply();
  }

  const handleLogout = (e) => {
    setUserDetails(null);
    setUserAvatar(null);
    setToken(null);
    sessionStorage.removeItem("token");
  };
  return (
    <UserRolesProvider>
      <ThemeProvider theme={getLoginTheme(useDarkMode)}>
        <Box>
          <AutoHideAlert
            alertOpen={alertOpen}
            alertType={alertType}
            alertMessage={alertMessage}
            setAlertOpen={setAlertOpen}
          />
          <AppNavBar
            onClick={() => {
              setNavOpen(!navOpen);
            }}
            setToken={setToken}
            token={token}
            userDetails={userDetails}
            userAvatar={userAvatar}
            handleLogout={handleLogout}
            useDarkMode={useDarkMode}
            setUseDarkMode={setUseDarkMode}
          />
          <Routes>
            <Route path="home" element={<Nopage />} />
            <Route
              path="current-iteration"
              element={
                <CurrentTeamIteration
                  token={token}
                  userDetails={userDetails}
                  useDarkMode={useDarkMode}
                />
              }
            />
            <Route
              path="iterations"
              element={
                <OtherUserStoryIterations
                  userDetails={userDetails}
                  useDarkMode={useDarkMode}
                />
              }
            />
            <Route
              path="my-backlog"
              element={
                <BacklogCurrentUser
                  userDetails={userDetails}
                  useDarkMode={useDarkMode}
                />
              }
            />
            <Route
              path="backlogs"
              element={
                <BacklogSelectTeam
                  userDetails={userDetails}
                  useDarkMode={useDarkMode}
                />
              }
            />
            <Route
              path="project-backlog"
              element={
                <BacklogProject
                  userDetails={userDetails}
                  useDarkMode={useDarkMode}
                />
              }
            />
            <Route
              path="settings"
              element={
                <UserSettings
                  token={token}
                  userDetails={userDetails}
                  setUserDetails={setUserDetails}
                  userAvatar={userAvatar}
                  setUserAvatar={setUserAvatar}
                />
              }
            />
            <Route
              path="user-management"
              element={
                <AdminPage
                  userDetails={userDetails}
                  useDarkMode={useDarkMode}
                />
              }
            />
            <Route
              path="features"
              element={
                <FeatureWrapper
                  userDetails={userDetails}
                  useDarkMode={useDarkMode}
                />
              }
            />
            <Route path="manage-tags" element={<ManageTags />} />
            <Route path="request-add-user" element={<RequestAdd />} />
            <Route path="/chat" element={<Chat token={token} currentUser={userDetails} />} />
            <Route path="*" element={<Nopage />} />
          </Routes>
        </Box>
      </ThemeProvider>
    </UserRolesProvider>
  );
}

export default App;
