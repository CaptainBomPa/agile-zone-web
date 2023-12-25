import { ThemeProvider } from "@emotion/react";
import { Box, Button } from "@mui/material";
import { getLoginTheme } from "./WebTheme";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import axios from "axios";

export default function Register(props) {
  const { setOnRegisterForm, useDarkMode, showAutoHideAlert } = props;

  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const validateEmail = () => {
    const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
    const isEmailValid = emailRegex.test(email);

    if (!isEmailValid) {
      setEmailError("Invalid email address");
    } else {
      setEmailError("");
    }
  };

  const validatePassword = () => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(.{6,})$/;
    const isPasswordValid = passwordRegex.test(password);

    if (!isPasswordValid) {
      setPasswordError(
        "Minimum 6 characters, 1 uppercase, 1 special character."
      );
    } else {
      setPasswordError("");
    }
  };

  const validateConfirmPassword = (newConfirmPassword) => {
    if (password === newConfirmPassword) {
      setConfirmPasswordError("");
    } else {
      setConfirmPasswordError("Passwords do not match");
    }
  };

  const handleConfirmPasswordChange = (newConfirmPassword) => {
    setConfirmPassword(newConfirmPassword);
    validateConfirmPassword(newConfirmPassword);
  };

  const handleRegister = () => {
    const registerRequest = {
      username: username,
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
    };

    axios
      .post("http://10.0.1.64:8080/api/user", registerRequest)
      .then((response) => {
        if (response.status === 200) {
          showAutoHideAlert(
            "Registration request send successful",
            "success",
            5000
          );
          setOnRegisterForm(false);
        } else {
          showAutoHideAlert(
            "Error during sendng registration request",
            "error",
            5000
          );
        }
      })
      .catch((error) => {
        showAutoHideAlert(
          "Error during sendng registration request",
          "error",
          5000
        );
      });
  };

  return (
    <ThemeProvider theme={getLoginTheme(useDarkMode)}>
      <Box
        color="pmLoginTheme"
        backgroundColor="pmLoginTheme.background"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "4ch",
          flexDirection: "column",
        }}
      >
        <Button
          sx={{ m: 1, width: "45ch", height: "6ch" }}
          variant="outlined"
          color="pmLoginTheme"
          onClick={() => {
            setOnRegisterForm(false);
          }}
        >
          Go back to login page
        </Button>

        <TextField
          sx={{ width: "45ch", height: "6ch", marginTop: "3ch" }}
          margin="normal"
          id="username"
          label="Username"
          type="text"
          color="pmLoginTheme"
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          sx={{ width: "45ch", height: "6ch", marginTop: "3ch" }}
          margin="normal"
          id="firstName"
          label="First Name"
          type="text"
          color="pmLoginTheme"
          onChange={(e) => setFirstName(e.target.value)}
        />
        <TextField
          sx={{ width: "45ch", height: "6ch", marginTop: "3ch" }}
          margin="normal"
          id="lastName"
          label="Last Name"
          type="text"
          color="pmLoginTheme"
          onChange={(e) => setLastName(e.target.value)}
        />
        <TextField
          sx={{ width: "45ch", height: "6ch", marginTop: "3ch" }}
          margin="normal"
          id="email"
          label="Email"
          type="text"
          color="pmLoginTheme"
          onChange={(e) => {
            setEmail(e.target.value);
            validateEmail();
          }}
          error={emailError !== ""}
          helperText={emailError}
        />
        <TextField
          sx={{ width: "45ch", height: "6ch", marginTop: "3ch" }}
          margin="normal"
          id="password"
          label="Password"
          type="password"
          color="pmLoginTheme"
          onChange={(e) => {
            setPassword(e.target.value);
            validatePassword();
          }}
          error={passwordError !== ""}
          helperText={passwordError}
        />
        <TextField
          sx={{ width: "45ch", height: "6ch", marginTop: "3ch" }}
          margin="normal"
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          color="pmLoginTheme"
          onChange={(e) => {
            handleConfirmPasswordChange(e.target.value);
          }}
          error={confirmPasswordError !== ""}
          helperText={confirmPasswordError}
        />
        <Button
          sx={{ m: 1, width: "45ch", height: "6ch", marginTop: "3ch" }}
          variant="outlined"
          color="pmLoginTheme"
          onClick={() => {
            if (
              email &&
              password &&
              confirmPassword &&
              !emailError &&
              !passwordError &&
              !confirmPasswordError &&
              username &&
              firstName &&
              lastName
            ) {
              handleRegister()
            }
          }}
          disabled={
            !email ||
            !password ||
            !confirmPassword ||
            emailError ||
            passwordError ||
            confirmPasswordError ||
            !username ||
            !firstName ||
            !lastName
          }
        >
          Request Register
        </Button>
      </Box>
    </ThemeProvider>
  );
}
