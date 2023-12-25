import { useState, useEffect } from "react";
import { Box, Fade } from "@mui/material";
import { CircularProgress } from "@mui/material";
import React from "react";
import FeatureTable from "./FeaturesTable";
import { getAllWithStories } from "../service/Features";

export default function FeatureWrapper(props) {
  const { userDetails, useDarkMode } = props;

  const [data, setData] = useState();

  useEffect(() => {
    getAllWithStories().then((data) => {
      setData(data);
    });
  }, []);

  return (
    <div>
      {data ? (
        <Box
          sx={{
            width: "100% - 64px",
            marginLeft: "64px",
            marginTop: "64px",
          }}
        >
          <Fade in={true} timeout={750}>
            <div>
              <FeatureTable
                userDetails={userDetails}
                data={data}
                setData={setData}
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
