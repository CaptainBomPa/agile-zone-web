import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { updatePassword } from "../service/UsersInfo";
import AutoHideAlert from "../components/AutoHideAlert";

export default function ChangePasswordTab({ token, setUserDetails }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [loading, setLoading] = useState(false);
  const [allFieldsFilled, setAllFieldsFilled] = useState(false);

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

  const checkAllFieldsFilled = () => {
    setAllFieldsFilled(
      oldPassword !== "" && newPassword !== "" && confirmNewPassword !== ""
    );
  };

  const handleOldPasswordChange = (e) => {
    setOldPassword(e.target.value);
    checkAllFieldsFilled();
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
    setPasswordsMatch(e.target.value === confirmNewPassword);
    checkAllFieldsFilled();
  };

  const handleConfirmNewPasswordChange = (e) => {
    setConfirmNewPassword(e.target.value);
    setPasswordsMatch(e.target.value === newPassword);
    checkAllFieldsFilled();
  };

  const handleChangePassword = () => {
    if (newPassword === confirmNewPassword) {
      const dataUpdatePassword = async (e) => {
        setLoading(true);
        const status = await updatePassword(
          oldPassword,
          newPassword
        );
        if (status === 200) {
          showAutoHideAlert("Password updated successfully", "success", 5000);
        } else {
          showAutoHideAlert("Error updating password", "error", 5000);
        }
        setLoading(false);
      };
      dataUpdatePassword.apply();
    }
  };

  return (
    <form>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "7ch",
          marginTop: "2ch",
        }}
      >
        <AutoHideAlert
          alertOpen={alertOpen}
          alertType={alertType}
          alertMessage={alertMessage}
          setAlertOpen={setAlertOpen}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TextField
          sx={{ m: 1, width: window.innerWidth > 450 ? "45ch" : "100%" }}
          fullWidth={!(window.innerWidth > 450)}
          id="old-password"
          label="Old Password"
          variant="outlined"
          type="password"
          value={oldPassword}
          color="pmLoginTheme"
          onChange={handleOldPasswordChange}
        />
        <TextField
          sx={{ m: 1, width: window.innerWidth > 450 ? "45ch" : "100%" }}
          fullWidth={!(window.innerWidth > 450)}
          id="new-password"
          label="New Password"
          variant="outlined"
          type="password"
          value={newPassword}
          color="pmLoginTheme"
          onChange={handleNewPasswordChange}
        />
        <TextField
          sx={{ m: 1, width: window.innerWidth > 450 ? "45ch" : "100%" }}
          fullWidth={!(window.innerWidth > 450)}
          id="confirm-new-password"
          label="Confirm New Password"
          variant="outlined"
          type="password"
          color="pmLoginTheme"
          value={confirmNewPassword}
          onChange={handleConfirmNewPasswordChange}
          error={!passwordsMatch}
          helperText={!passwordsMatch && "Passwords do not match"}
        />
        <Button
          variant="contained"
          sx={{ m: 1, width: window.innerWidth > 450 ? "50ch" : "100%" }}
          fullWidth={!(window.innerWidth > 450)}
          color="pmLoginTheme"
          onClick={handleChangePassword}
          disabled={!allFieldsFilled || !passwordsMatch || loading}
        >
          Change Password
        </Button>
        {loading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "2ch",
            }}
          >
            <CircularProgress color="primary" />
          </Box>
        )}
      </Box>
    </form>
  );
}
