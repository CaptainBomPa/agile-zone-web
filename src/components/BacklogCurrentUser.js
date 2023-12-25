import { useState, useEffect } from "react";
import { getBacklogForCurrentUser } from "../service/UserStoryBacklog";
import UserStoryTable from "./UserStoryTable";
import { Box, Fade } from "@mui/material";
import { CircularProgress } from "@mui/material";
import React from "react";

export default function BacklogCurrentUser(props) {
  const { userDetails, useDarkMode } = props;

  const [data, setData] = useState();

  useEffect(() => {
    getBacklogForCurrentUser().then((data) => {
      setData(data);
    });
  }, []);

  return (
    <div>
      {data ? (
        <Box
          sx={{ width: "100% - 64px", marginLeft: "64px", marginTop: "64px" }}
        >
          <Fade in={true} timeout={750}>
            <div>
              {
                <UserStoryTable
                  userDetails={userDetails}
                  data={data}
                  setData={setData}
                  team={userDetails?.team}
                  useDarkMode={useDarkMode}
                />
              }
            </div>
          </Fade>
        </Box>
      ) : (
        <Box
          sx={{
            width: "100% - 64px",
            marginLeft: "64px",
            marginTop: "164px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress color="pmLoginTheme" size={125} />
        </Box>
      )}
    </div>
  );
}
