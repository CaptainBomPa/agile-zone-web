import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import AutoHideAlert from "../components/AutoHideAlert";

export default function ChangeAvatarTab({ userAvatar, setUserAvatar, token }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isFileTooLarge, setIsFileTooLarge] = useState(false);

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
    if (userAvatar?.image) {
      setImageUrl(`data:image/png;base64,${userAvatar.image}`);
    }
  }, [userAvatar]);

  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImageUrl(reader.result);
    };

    reader.readAsDataURL(selectedFile);
    setFile(selectedFile);

    if (selectedFile.size > 1024 * 1024) {
      setIsFileTooLarge(true);
    } else {
      setIsFileTooLarge(false);
    }
  };

  const handleSaveImage = () => {
    if (!file) {
      showAutoHideAlert("Select file first.", "info", 5000)
      return;
    }

    if (isFileTooLarge) {
      showAutoHideAlert("File size exceeds 1MB. Please select a smaller file.", "info", 5000)
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    setLoading(true);

    fetch("http://10.0.1.64:8080/api/user/avatar", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((response) => {
        setLoading(false);
        if (response.status === 200) {
          showAutoHideAlert("Avatar updated successfully", "success", 5000);
          return response.json();
        } else {
          showAutoHideAlert("Error during saving avatar", "error", 5000);
          console.error("Error during saving avatar", response.status);
        }
      })
      .then((data) => {
        setUserAvatar(data);
      });
  };

  return (
    <Box>
      <AutoHideAlert
        alertOpen={alertOpen}
        alertType={alertType}
        alertMessage={alertMessage}
        setAlertOpen={setAlertOpen}
      />
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
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <label htmlFor="upload-image">
          <Button variant="contained" component="span" color="pmLoginTheme">
            Select Image (.jpg .png) 1MB
          </Button>
          <input
            id="upload-image"
            hidden
            accept="image/*"
            type="file"
            onChange={handleFileUpload}
            color="primary"
          />
        </label>
        <div
          style={{
            width: "300px",
            height: "300px",
            overflow: "hidden",
            margin: "16px",
          }}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Wgrane Zdjęcie"
              width="100%"
              height="100%"
            />
          ) : (
            <div>No image selected</div>
          )}
        </div>
        <Button
          variant="contained"
          color="pmLoginTheme"
          onClick={handleSaveImage}
          style={{ marginTop: "16px" }}
          disabled={!file || isFileTooLarge}
        >
          Save as avatar
        </Button>
        {loading && <CircularProgress color="pmLoginTheme" />}
      </Box></Box>
  );
}
