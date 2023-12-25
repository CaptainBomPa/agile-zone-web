import { useState, useEffect } from "react";
import UserStoryTable from "./UserStoryTable";
import { getUserStoriesIteration } from "../service/UserStoryUser";
import { Box, Fade } from "@mui/material";
import { CircularProgress } from "@mui/material";
import React from "react";

export default function CurrentTeamIteration(props) {
  const { token, userDetails, useDarkMode } = props;

  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getUserStoriesIteration();
        setData(result);
      } catch (error) {
        console.error("Error while fetching data", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      {data.length > 0 ? (
        <Box
          sx={{ width: "100% - 64px", marginLeft: "64px", marginTop: "64px" }}
        >
          <Fade in={true} timeout={750}>
            <div>
              <UserStoryTable
                token={token}
                userDetails={userDetails}
                data={data}
                setData={setData}
                team={userDetails?.team}
                iteration={data[0]?.iteration}
                useDarkMode={useDarkMode}
              />
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
