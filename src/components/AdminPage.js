import { Autocomplete, Box, Button, TextField } from "@mui/material";
import {
  getAllUsers,
  getAllProjects,
  getAllTeams,
} from "../service/UserStoryEdit";
import { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { getLoginTheme } from "./WebTheme";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import { updateFullUser } from "../service/UsersInfo";
import AutoHideAlert from "./AutoHideAlert";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, personName, theme) {
  if (!personName) {
    return {
      fontWeight: theme.typography.fontWeightRegular,
    };
  }

  return {
    backgroundColor:
      personName.indexOf(name) === -1
        ? theme.palette.pmLoginTheme.background
        : theme.palette.pmLoginTheme.lightMain,
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

function getStyles2(name, personName, theme) {
  if (!personName || !name) {
    return {
      fontWeight: theme.typography.fontWeightRegular,
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

export default function AdminPage(props) {
  const { useDarkMode } = props;

  //fetch data
  const [data, setData] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [allTeams, setAllTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);

  //selected row
  const [selectedRow, setSelectedRow] = useState(null);

  //items on form that can be changed
  const [userId, setUserId] = useState(selectedRow?.id);
  const [username, setUsername] = useState(selectedRow?.username);
  const [firstName, setFirstName] = useState(selectedRow?.firstName);
  const [lastName, setLastName] = useState(selectedRow?.lastName);
  const [roles, setRoles] = useState(selectedRow ? selectedRow.roles : []);
  const [project, setProject] = useState(
    selectedRow ? selectedRow.project : null
  );
  const [team, setTeam] = useState(selectedRow ? selectedRow.team : null);

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

  const handleRolesChange = (event) => {
    const {
      target: { value },
    } = event;
    setRoles(typeof value === "string" ? value.split(",") : value);
  };

  const handleSelectRow = (row) => {
    setSelectedRow(row);
    setUsername(row.username);
    setFirstName(row.firstName);
    setLastName(row.lastName);
    setRoles(row.roles);
    setUserId(row.id);
    setTeam(row.team);
    setProject(row.project);
    if (row.project) {
      const teams = allTeams.filter(
        (team) => team.project.id === row.project.id
      );
      setFilteredTeams(teams);
    } else {
      setFilteredTeams(null);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getAllUsers();
      setData(data);
    };
    fetchUsers();
    const fetchProjects = async () => {
      const data = await getAllProjects();
      setAllProjects(data);
    };
    fetchProjects();
    const fetchTeams = async () => {
      const data = await getAllTeams();
      setAllTeams(data);
    };
    fetchTeams();
  }, []);

  useEffect(() => {
    if (project) {
      const teams = allTeams.filter((team) => team.project.id === project.id);
      setFilteredTeams(teams);
    } else {
      setFilteredTeams(null);
    }
  }, [project, allTeams]);

  const handleClear = () => {
    setSelectedRow(null);
    setUsername(null);
    setFirstName(null);
    setLastName(null);
    setRoles(null);
    setUserId(null);
    setTeam(null);
    setProject(null);
  };

  const handleRestorePreviousInformations = () => {
    if (selectedRow) {
      setUsername(selectedRow.username);
      setFirstName(selectedRow.firstName);
      setLastName(selectedRow.lastName);
      setRoles(selectedRow.roles);
      setProject(selectedRow.project);
      setTeam(selectedRow.team);
    }
  };

  const handleUpdate = async () => {
    if (selectedRow) {
      const userData = {
        id: userId,
        username: username,
        firstName: firstName,
        lastName: lastName,
        roles: roles,
        project: project,
        team: team,
      };
      try {
        const updatedUser = await updateFullUser(userData);

        const updatedData = data.map((user) => {
          if (user.id === updatedUser.id) {
            let updatedUserWithAvatar = updatedUser;
            updatedUserWithAvatar.avatar = user.avatar;
            setSelectedRow(updatedUserWithAvatar);
            return updatedUserWithAvatar;
          } else {
            return user;
          }
        });
        setData(updatedData);
        showAutoHideAlert("User updated successfully.", "success", 5000);
      } catch (error) {
        showAutoHideAlert(
          "An error occurred while updating the user.",
          "error",
          5000
        );
        console.error(error);
      }
    }
  };

  return (
    <Box
      sx={{
        width: "100% - 64px",
        marginLeft: "64px",
        marginTop: "84px",
        display: "flex",
        flexDirection: window.innerWidth < 450 ? "column" : "row",
        justifyContent: "center",
        height: "100%",
      }}
    >
      <AutoHideAlert
        alertOpen={alertOpen}
        alertType={alertType}
        alertMessage={alertMessage}
        setAlertOpen={setAlertOpen}
      />
      <Box sx={{ width: window.innerWidth < 450 ? "100%" : "40%", marginRight: "10ch" }}>
        <div className="custom-scrollbar">
          <TableContainer
            className="custom-scrollbar"
            component={Paper}
            sx={{
              maxHeight: 800,
              overflow: "auto",
            }}
          >
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: 50 }}>ID</TableCell>
                  <TableCell sx={{ width: 70 }} align="left"></TableCell>
                  <TableCell sx={{ width: 200 }} align="left">
                    First Name
                  </TableCell>
                  <TableCell sx={{ width: 200 }} align="left">
                    Last Name
                  </TableCell>
                  <TableCell sx={{ width: 200 }} align="right">
                    Move to Edit Form
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.id}
                    </TableCell>
                    <TableCell align="left">
                      {row?.avatar ? (
                        <Avatar
                          sx={{ bgcolor: "gray" }}
                          src={`data:image/png;base64,${row.avatar}`}
                        />
                      ) : (
                        <Avatar sx={{ bgcolor: "gray" }}>
                          {row.firstName.charAt(0).toUpperCase() +
                            row.lastName.charAt(0).toUpperCase()}
                        </Avatar>
                      )}
                    </TableCell>
                    <TableCell align="left">{row.firstName}</TableCell>
                    <TableCell align="left">{row.lastName}</TableCell>
                    <TableCell align="right">
                      <Button
                        color="pmLoginTheme"
                        onClick={(e) => {
                          handleSelectRow(row);
                        }}
                      >
                        <ArrowRightAltIcon />{" "}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Box>
      <Box sx={{ width: window.innerWidth < 450 ? "95%" : "40%" }}>
        <form>
          <TextField
            margin="normal"
            id="userId"
            label="User ID"
            type="text"
            fullWidth
            color="pmLoginTheme"
            defaultValue=" "
            value={userId}
            disabled
            onChange={(e) => {
              setUserId(e.target.value);
            }}
          />
          <TextField
            margin="normal"
            id="username"
            label="Username"
            type="text"
            fullWidth
            color="pmLoginTheme"
            defaultValue=" "
            value={username ? username : ""}
            disabled={selectedRow === null}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <TextField
            margin="normal"
            id="firstName"
            label="First Name"
            type="text"
            fullWidth
            color="pmLoginTheme"
            defaultValue=" "
            value={firstName ? firstName : ""}
            disabled={selectedRow === null}
            onChange={(e) => {
              setFirstName(e.target.value);
            }}
          />
          <TextField
            margin="normal"
            id="lastName"
            label="Last Name"
            type="text"
            fullWidth
            color="pmLoginTheme"
            defaultValue=" "
            value={lastName ? lastName : ""}
            disabled={selectedRow === null}
            onChange={(e) => {
              setLastName(e.target.value);
            }}
          />
          <FormControl fullWidth margin="normal" color="pmLoginTheme">
            <InputLabel id="demo-multiple-chip-label">Roles</InputLabel>
            <Select
              color="pmLoginTheme"
              fullWidth
              labelId="demo-multiple-chip-label"
              id="demo-multiple-chip"
              multiple
              onChange={handleRolesChange}
              value={roles ? roles : []}
              input={<OutlinedInput id="select-multiple-chip" label="Roles" />}
              renderValue={(selected) => (
                <Box
                  sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                  color="pmLoginTheme"
                >
                  {selected.map((value) => (
                    <Chip key={value} label={value} color="pmLoginTheme" />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
              disabled={selectedRow === null}
            >
              {names.map((name) => (
                <MenuItem
                  color="pmLoginTheme"
                  key={name}
                  value={name}
                  style={getStyles(name, roles, getLoginTheme(useDarkMode))}
                >
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Autocomplete
            sx={{ marginTop: "1ch" }}
            id="project-autocomplete"
            options={allProjects}
            fullWidth
            getOptionLabel={(option) => option.projectName}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <TextField {...params} label="Project" color="pmLoginTheme" />
            )}
            color="pmLoginTheme"
            value={project ? project : null}
            onChange={(e, newValue) => {
              setProject(newValue);
            }}
            disabled={selectedRow === null}
            renderOption={(props, option) => (
              <li
                {...props}
                color="pmLoginTheme"
                style={getStyles2(option, project, getLoginTheme(useDarkMode))}
              >
                {option.projectName}
              </li>
            )}
          />
          <Autocomplete
            sx={{ marginTop: "2ch" }}
            id="team-autocomplete"
            options={filteredTeams}
            fullWidth
            getOptionLabel={(option) => option.teamName}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <TextField {...params} label="Team" color="pmLoginTheme" />
            )}
            color="pmLoginTheme"
            value={team ? team : null}
            onChange={(e, newValue) => {
              setTeam(newValue);
            }}
            disabled={selectedRow === null}
            renderOption={(props, option) => (
              <li
                {...props}
                color="pmLoginTheme"
                style={getStyles2(option, team, getLoginTheme(useDarkMode))}
              >
                {option.teamName}
              </li>
            )}
          />
          <Button
            color="pmLoginTheme"
            sx={{ marginTop: "2ch" }}
            fullWidth
            variant="contained"
            onClick={() => {
              handleUpdate();
            }}
          >
            Update
          </Button>
          <Button
            color="pmLoginTheme"
            sx={{ marginTop: "1ch" }}
            fullWidth
            variant="outlined"
            onClick={() => {
              handleRestorePreviousInformations();
            }}
          >
            Restore previous informations
          </Button>
          <Button
            color="pmLoginTheme"
            sx={{ marginTop: "1ch" }}
            fullWidth
            variant="outlined"
            onClick={() => {
              handleClear();
            }}
          >
            Clear
          </Button>
        </form>
      </Box>
    </Box>
  );
}

const names = [
  "EDITING",
  "PROJECT_SUPERVISOR",
  "ADMINISTRATOR",
];
