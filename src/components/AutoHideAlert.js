import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

export default function AutoHideAlert({alertOpen, alertType, alertMessage, setAlertOpen}) {
  return (
    <Snackbar
      open={alertOpen}
      autoHideDuration={5000}
      anchorOrigin={{ vertical: "top", horizontal: "left" }}
      sx={{
        width: "350px",
        marginTop: "20px",
      }}
    >
      <Alert
        severity={alertType}
        sx={{
          width: "100%",
          padding: "20px",
          fontSize: "16px",
          fontWeight: "bold",
        }}
        action={
          <IconButton
            size="small"
            color="inherit"
            onClick={() => {
              setAlertOpen(false);
            }}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
      >
        {alertMessage}
      </Alert>
    </Snackbar>
  );
};
