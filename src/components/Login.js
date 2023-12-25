import React, { useState } from "react";
import PropTypes from "prop-types";
import { loginUser } from "../service/UserLogin";

import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { ThemeProvider } from "@emotion/react";
import CircularProgress from "@mui/material/CircularProgress";
import { getLoginTheme } from "../components/WebTheme";
import { Typography } from "@mui/material";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { MaterialUISwitch } from "./AppNavBar";

export default function Login({
  setToken,
  navigate,
  setOnRegisterForm,
  useDarkMode,
  setUseDarkMode,
  showAutoHideAlert,
}) {
  const [loading, setLoading] = useState(false);
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await loginUser(
      {
        username,
        password,
      },
      setLoading
    );
    if (data?.token) {
      setToken(data.token);
      navigate("/current-iteration");
    } else {
      showAutoHideAlert(
        "Failed to login. Check your credentials",
        "error",
        5000
      );
    }
  };

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <ThemeProvider theme={getLoginTheme(useDarkMode)}>
      <form onSubmit={handleSubmit}>
        <Box
          color="pmLoginTheme"
          backgroundColor="pmLoginTheme.background"
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "2ch",
            marginBottom: "0",
          }}
        >
          {useDarkMode ? (
            <img
              src="agile-zone_2.png"
              alt="no logo :("
              width="400"
              height="400"
            ></img>
          ) : (
            <img
              src="agile-zone_1.png"
              alt="no logo :("
              width="400"
              height="400"
            ></img>
          )}
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "start",
            alignItems: "center",
          }}
          color="pmLoginTheme"
          backgroundColor="pmLoginTheme.background"
        >
          <FormGroup>
            <FormControlLabel
              control={
                <MaterialUISwitch
                  sx={{ m: 1 }}
                  defaultChecked={useDarkMode}
                  onClick={() => setUseDarkMode(!useDarkMode)}
                />
              }
            />
          </FormGroup>
        </Box>
        <Box
          color="pmLoginTheme"
          backgroundColor="pmLoginTheme.background"
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TextField
              sx={{ m: 1, width: "35ch" }}
              id="outlined-basic"
              label="Username"
              variant="outlined"
              type="text"
              onChange={(e) => setUserName(e.target.value)}
              color="pmLoginTheme"
            />{" "}
            <br></br>
            <FormControl
              sx={{ m: 1, width: "35ch" }}
              variant="outlined"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              color="pmLoginTheme"
            >
              <InputLabel htmlFor="outlined-adornment-password">
                Password
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={showPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
            </FormControl>{" "}
            <br></br>
            <Button
              sx={{ m: 1, width: "35ch", height: "6ch" }}
              variant="outlined"
              type="submit"
              color="pmLoginTheme"
            >
              Login
            </Button>
            <br></br>
            <Box
              color="pmLoginTheme"
              backgroundColor="pmLoginTheme.background"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "2ch",
              }}
            >
              {loading && <CircularProgress color="pmLoginTheme" />}
            </Box>
          </div>
        </Box>
      </form>
      <Box
        color="pmLoginTheme"
        backgroundColor="pmLoginTheme.background"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "2ch",
          flexDirection: "column",
        }}
      >
        <Typography color="pmLoginTheme.text">
          If you want to request a registration, please hit bellow button.
        </Typography>
        <Button
          sx={{ m: 1, width: "35ch", height: "6ch" }}
          variant="outlined"
          color="pmLoginTheme"
          onClick={() => {
            setOnRegisterForm(true);
          }}
        >
          Request Registration
        </Button>
      </Box>
    </ThemeProvider>
  );
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired,
};
