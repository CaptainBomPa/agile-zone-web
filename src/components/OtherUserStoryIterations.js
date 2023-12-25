import { useState, useEffect } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import { getAllTeams, getAllIterations } from "../service/UserStoryEdit";
import { getUserStoriesIterationTeam } from "../service/UserStoryUser";
import UserStoryTable from "./UserStoryTable";
import { getLoginTheme } from "./WebTheme";
import { Box, Fade } from "@mui/material";
import { CircularProgress } from "@mui/material";
import React from "react";

function getStyles2(name, personName, theme) {
  if (!personName) {
    return {
      backgroundColor: theme.palette.pmLoginTheme.background,
      fontWeight: theme.typography.fontWeightRegular,
    };
  }
  if (name.itNumber) {
    return {
      backgroundColor:
        personName.itNumber !== name.itNumber
          ? theme.palette.pmLoginTheme.background
          : theme.palette.pmLoginTheme.lightMain,
      fontWeight:
        personName.itNumber !== name.itNumber
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }
  return {
    backgroundColor:
      personName.id !== name.id
        ? theme.palette.pmLoginTheme.background
        : theme.palette.pmLoginTheme.lightMain,
    fontWeight:
      personName.id !== name.id
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function OtherUserStoryIterations(props) {
  const { userDetails, useDarkMode } = props;

  const [selectedTeam, setSelecteTeam] = useState();
  const [selectedIteration, setSelectedIteratoin] = useState();

  const [teams, setTeams] = useState([]);
  const [iterations, setIterations] = useState([]);

  const [data, setData] = useState();

  useEffect(() => {
    getAllTeams().then((teams) => {
      setTeams(teams);
    });
    getAllIterations().then((iterations) => {
      setIterations(iterations);
    });
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (selectedTeam && selectedIteration) {
        try {
          const fetchData = await getUserStoriesIterationTeam(
            selectedTeam.id,
            selectedIteration.itNumber
          );
          setData(fetchData);
        } catch (error) {
          console.error("Error while fetching data", error);
        }
      }
    }
    fetchData();
  }, [selectedTeam, selectedIteration]);

  return (
    <div>
      <Box
        sx={{
          width: "100% - 64px",
          marginLeft: "64px",
          marginTop: "84px",
          display: "flex",
          justifyContent: "center",
          flexDirection: window.innerWidth < 450 ? "column" : "row", 
        }}
      >
        <FormControl sx={{ marginRight: "1%"}}>
          <InputLabel id="team-label" color="pmLoginTheme">
            Team
          </InputLabel>
          <Select
            labelId="team-label"
            id="team-select-id"
            value={selectedTeam}
            label="Team"
            onChange={(e) => {
              setSelecteTeam(e.target.value);
            }}
            sx={{ minWidth: window.innerWidth < 450 ? "200px" : "130px", }}
            color="pmLoginTheme"
          >
            {teams.map((team) => {
              return (
                <MenuItem
                  style={getStyles2(
                    team,
                    selectedTeam,
                    getLoginTheme(useDarkMode)
                  )}
                  value={team}
                >
                  {team.teamName}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>

        <FormControl>
          <InputLabel id="iteration-label" color="pmLoginTheme">
            Iteration
          </InputLabel>
          <Select
            labelId="iteration-label"
            id="iteration-select-id"
            value={selectedIteration}
            label="Iteration"
            onChange={(e) => {
              setSelectedIteratoin(e.target.value);
            }}
            sx={{ minWidth: window.innerWidth < 450 ? "200px" : "130px", }}
            color="pmLoginTheme"
          >
            {iterations.map((iteration) => {
              return (
                <MenuItem
                  value={iteration}
                  style={getStyles2(
                    iteration,
                    selectedIteration,
                    getLoginTheme(useDarkMode)
                  )}
                >
                  Iteration {iteration.itNumber}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Box>
      {selectedTeam && selectedIteration ? (
        <div>
          {data ? (
            <Box
              sx={{
                width: "100% - 64px",
                marginLeft: "64px",
                marginTop: "10px",
              }}
            >
              <Fade in={true} timeout={750}>
                <div>
                  <UserStoryTable
                    userDetails={userDetails}
                    data={data}
                    setData={setData}
                    team={selectedTeam}
                    iteration={selectedIteration}
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
      ) : (
        <div></div>
      )}
    </div>
  );
}
