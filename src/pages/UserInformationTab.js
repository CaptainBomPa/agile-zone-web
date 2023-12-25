import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { updateUserInfo } from "../service/UsersInfo";
import CircularProgress from "@mui/material/CircularProgress";
import AutoHideAlert from "../components/AutoHideAlert";

export default function UserInformationTab({
  userDetails,
  token,
  setUserDetails,
}) {
  const [loading, setLoading] = useState(false);
  const [isFormDirty, setIsFormDirty] = useState(false);

  const [currentUsername, setCurrentUsername] = useState(userDetails?.username);
  const [currentFirstName, setCurrentFirstName] = useState(
    userDetails?.firstName
  );
  const [currentLastName, setCurrentLastName] = useState(userDetails?.lastName);
  const teamName = userDetails?.team?.teamName || "Team name not available";
  const [assignedProject, setAssginedProject] = useState(userDetails? 
    userDetails.project.projectName : "Not assigned to any project"
  );

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

  useEffect(() => {
    const isDirty =
      currentUsername !== userDetails?.username ||
      currentFirstName !== userDetails?.firstName ||
      currentLastName !== userDetails?.lastName;

      setAssginedProject(
      userDetails?.project
        ? userDetails.project.projectName
        : "Not assigned to any project"
    );

    setIsFormDirty(isDirty);
  }, [currentUsername, currentFirstName, currentLastName, userDetails]);

  const handleUsernameChange = (e) => {
    setCurrentUsername(e.target.value);
  };

  const handleFirstNameChange = (e) => {
    setCurrentFirstName(e.target.value);
  };

  const handleLastNameChange = (e) => {
    setCurrentLastName(e.target.value);
  };

  const handleUpdate = () => {
    userDetails.username = currentUsername;
    userDetails.firstName = currentFirstName;
    userDetails.lastName = currentLastName;
    const updateUserData = async (e) => {
      setLoading(true);
      const data = await updateUserInfo(userDetails);
      if (data !== null) {
        setUserDetails(data);
        showAutoHideAlert("User information updated successfully", "success", 5000);
      } else if (data === null) {
        showAutoHideAlert("Error updating user information", "error", 5000);
      }
      setLoading(false);
    };
    updateUserData.apply();
  };

  const handleRestore = () => {
    setCurrentUsername(userDetails.username || "");
    setCurrentFirstName(userDetails.firstName || "");
    setCurrentLastName(userDetails.lastName || "");
    setIsFormDirty(false);
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
            sx={{m: 1, width: window.innerWidth > 450 ? "45ch" : "100%"}}
            fullWidth={!(window.innerWidth > 450)}
            id="outlined-basic"
            label="Username"
            variant="outlined"
            type="text"
            color="pmLoginTheme"
            value={currentUsername}
            onChange={handleUsernameChange}
          />
          <TextField
            sx={{m: 1, width: window.innerWidth > 450 ? "45ch" : "100%"}}
            fullWidth={!(window.innerWidth > 450)}
            id="outlined-basic"
            label="First Name"
            variant="outlined"
            type="text"
            color="pmLoginTheme"
            value={currentFirstName}
            onChange={handleFirstNameChange}
          />
          <TextField
            sx={{m: 1, width: window.innerWidth > 450 ? "45ch" : "100%"}}
            fullWidth={!(window.innerWidth > 450)}
            id="outlined-basic"
            label="Last Name"
            variant="outlined"
            type="text"
            color="pmLoginTheme"
            value={currentLastName}
            onChange={handleLastNameChange}
          />
          <TextField
            disabled
            sx={{m: 1, width: window.innerWidth > 450 ? "45ch" : "100%"}}
            fullWidth={!(window.innerWidth > 450)}
            id="outlined-basic"
            label="Team Name"
            variant="outlined"
            type="text"
            color="pmLoginTheme"
            value={teamName}
          />
          <TextField
            disabled
            multiline
            rows={2}
            sx={{m: 1, width: window.innerWidth > 450 ? "45ch" : "100%"}}
            fullWidth={!(window.innerWidth > 450)}
            id="outlined-basic"
            label="Assigned Projects"
            variant="outlined"
            type="text"
            color="pmLoginTheme"
            value={assignedProject}
          />
          <Button
            variant="contained"
            sx={{m: 1, width: window.innerWidth > 450 ? "50ch" : "100%"}}
            fullWidth={!(window.innerWidth > 450)}
            color="pmLoginTheme"
            onClick={handleUpdate}
            disabled={!isFormDirty}
          >
            Update
          </Button>
          <Button
            variant="outlined"
            sx={{m: 1, width: window.innerWidth > 450 ? "50ch" : "100%"}}
            fullWidth={!(window.innerWidth > 450)}
            color="pmLoginTheme"
            onClick={handleRestore}
            disabled={!isFormDirty}
          >
            Restore previous information
          </Button>
          <br></br>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "2ch",
            }}
          >
            {loading && <CircularProgress color="pmLoginTheme" />}
          </Box>
        </Box>
    </form>
  );
}
