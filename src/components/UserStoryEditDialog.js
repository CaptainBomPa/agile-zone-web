import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useState, useEffect } from "react";
import {
  getAllFeatures,
  getAllUsers,
  updateStory,
  addUserStory,
  getAllTeams,
  getAllIterations,
  getAllTags,
} from "../service/UserStoryEdit";
import Autocomplete from "@mui/material/Autocomplete";
import { Box, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import BlockIcon from "@mui/icons-material/Block";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import { getLoginTheme } from "./WebTheme";

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

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
  },
}));

export default function UserStoryEditDialog(props) {
  const { setOpen, edit, userStory, handleChangeUpdateRow } = props;

  const [userStoryName, setUserStoryName] = useState(
    userStory ? userStory.userStoryName : ""
  );
  const [storyPoints, setStoryPoints] = useState(
    userStory ? userStory.storyPoints : ""
  );
  const [selectedFeature, setSelectedFeature] = useState(
    userStory ? userStory.feature : null
  );
  const [selectedTeam, setSelectedTeam] = useState(
    userStory ? userStory.team : null
  );
  const [selectedOwner, setSelectedOwner] = useState(
    userStory ? userStory.assignedUser : null
  );
  const [storyState, setStoryState] = useState(
    userStory ? userStory.state : "NEW"
  );
  const [storyDescription, setStoryDescription] = useState(
    userStory ? userStory.description : null
  );
  const [storyBlocked, setStoryBlocked] = useState(
    userStory ? userStory.blocked : null
  );
  const [storyBlockReason, setStoryBlockReason] = useState(
    userStory ? userStory.blockReason : null
  );
  const [storyIteration, setStoryIteration] = useState(
    userStory ? userStory.iteration : null
  );
  const [storyTags, setStoryTags] = useState(userStory ? userStory.tags : null);
  const useDarkMode = true;

  const [features, setFeatures] = useState([]);
  const [owners, setOwners] = useState([]);
  const [teams, setTeams] = useState([]);
  const [iterations, setIterations] = useState([]);
  const [visibleOwners, setVisibleOwners] = useState([]);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    getAllFeatures().then((features) => {
      setFeatures(features);
    });
    getAllTeams().then((teams) => {
      setTeams(teams);
    });
    getAllUsers().then((users) => {
      setOwners(users);
      if (selectedTeam) {
        setVisibleOwners(
          users.filter((user) => user.team?.id === selectedTeam.id)
        );
      }
    });
    getAllIterations().then((iterations) => {
      setIterations(iterations);
    });
    getAllTags().then((tags) => {
      setTags(tags);
    });
  });

  const handleVisibleOwners = (team) => {
    if (selectedTeam === team) return;
    setSelectedOwner(null);
    setVisibleOwners(owners.filter((owner) => owner.team?.id === team.id));
  };

  const handleUpdate = () => {
    const updatedStory = {
      id: userStory.id,
      userStoryName,
      storyPoints,
      feature: selectedFeature,
      assignedUser: selectedOwner,
      state: storyState,
      description: storyDescription,
      blocked: storyBlocked,
      blockReason: storyBlockReason,
      team: selectedTeam,
      iteration: storyIteration,
      tags: storyTags,
    };

    updateStory(updatedStory)
      .then((newStory) => {
        handleChangeUpdateRow(newStory);
      })
      .catch((error) => {
        console.error(
          "Błąd podczas aktualizacji historii użytkownika: ",
          error
        );
      });
  };

  const handleAdd = () => {
    const newStory = {
      userStoryName,
      storyPoints,
      feature: selectedFeature,
      assignedUser: selectedOwner,
      state: storyState,
      description: storyDescription,
      blocked: storyBlocked,
      blockReason: storyBlockReason,
      team: selectedTeam,
      iteration: storyIteration,
      tags: storyTags,
    };

    addUserStory(newStory)
      .then((addedStory) => {
        if (addedStory) {
          handleChangeUpdateRow(addedStory);
          handleClose();
        } else {
          console.error("Błąd podczas dodawania historii użytkownika.");
        }
      })
      .catch((error) => {
        console.error("Błąd podczas dodawania historii użytkownika: ", error);
      });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const isFormValid = () => {
    if (!userStoryName.trim() || !storyPoints) {
      return false;
    }
    return true;
  };

  const handleTagsChanged = (event) => {
    const newTags = event.target.value;
    const idCounts = {};
    newTags.forEach((tag) => {
      const id = tag.id;
      idCounts[id] = (idCounts[id] || 0) + 1;
    });
    const uniqueTags = newTags.filter((tag) => idCounts[tag.id] === 1);
    setStoryTags(uniqueTags);
  };

  return (
    <div>
      <Dialog
        className="custom-scrollbar"
        open={true}
        onClose={handleClose}
        color="pmLoginTheme"
      >
        <Box
          noValidate
          component="form"
          className="custom-scrollbar"
          sx={{
            maxHeight: 800,
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
            m: "auto",
            width: "fit-content",
          }}
        >
          <DialogTitle>{edit ? "Edit" : "Add new"} User Story</DialogTitle>
          <Box
            noValidate
            component="form"
            sx={{
              display: "grid",
              gridTemplateColumns: "2fr",
              gap: "16px",
            }}
          >
            <DialogContent sx={{width: window.innerWidth > 450 ? 580 : 320}}>
              <DialogContentText></DialogContentText>
              <TextField
                autoFocus
                id="name"
                label="User Story Name"
                type="text"
                fullWidth
                color="pmLoginTheme"
                value={userStoryName}
                onChange={(e) => setUserStoryName(e.target.value)}
              />
              <Autocomplete
                id="storyPoints"
                options={possibleValuesStoryPoints}
                fullWidth
                isOptionEqualToValue={(option, value) => option === value}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Story Points"
                    color="pmLoginTheme"
                  />
                )}
                sx={{ marginTop: "12px" }}
                color="pmLoginTheme"
                value={storyPoints}
                onChange={(e, newValue) => setStoryPoints(newValue)}
              />
              <Autocomplete
                id="iteration-autocomplete"
                options={iterations.sort((a, b) => {
                  const numberA = parseInt(a.itNumber, 10);
                  const numberB = parseInt(b.itNumber, 10);
                  return numberB - numberA;
                })}
                fullWidth
                getOptionLabel={(option) => "Iteration " + option.itNumber}
                isOptionEqualToValue={(option, value) =>
                  option.itNumber === value.itNumber
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Iteration"
                    color="pmLoginTheme"
                  />
                )}
                color="pmLoginTheme"
                value={storyIteration}
                onChange={(e, newValue) => {
                  setStoryIteration(newValue);
                }}
                sx={{ marginTop: "12px" }}
              />
              <Autocomplete
                margin="normal"
                id="team-feature-autocomplete"
                options={features}
                fullWidth
                getOptionLabel={(option) => option.featureName}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Team Feature"
                    color="pmLoginTheme"
                  />
                )}
                sx={{ marginTop: "12px" }}
                color="pmLoginTheme"
                value={selectedFeature}
                onChange={(e, newValue) => setSelectedFeature(newValue)}
              />
              <Autocomplete
                margin="normal"
                id="team-autocomplete"
                options={teams}
                fullWidth
                getOptionLabel={(option) => option.teamName}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField {...params} label="Team" color="pmLoginTheme" />
                )}
                sx={{ marginTop: "12px" }}
                color="pmLoginTheme"
                value={selectedTeam}
                onChange={(e, newValue) => {
                  handleVisibleOwners(newValue);
                  setSelectedTeam(newValue);
                }}
              />
              <Autocomplete
                margin="normal"
                id="owner-autocomplete"
                options={visibleOwners}
                fullWidth
                getOptionLabel={(owner) =>
                  owner.firstName + " " + owner.lastName
                }
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Owner"
                    color="pmLoginTheme"
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: "new-password",
                    }}
                  />
                )}
                sx={{ marginTop: "12px" }}
                color="pmLoginTheme"
                value={selectedOwner}
                onChange={(e, newValue) => setSelectedOwner(newValue)}
                renderOption={(props, option) => (
                  <Box
                    component="li"
                    sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                    {...props}
                  >
                    {option?.avatar ? (
                      <Avatar
                        sx={{ bgcolor: "gray" }}
                        src={`data:image/png;base64,${option.avatar}`}
                      />
                    ) : (
                      <Avatar sx={{ bgcolor: "gray" }}>
                        {option.firstName.charAt(0).toUpperCase() +
                          option.lastName.charAt(0).toUpperCase()}
                      </Avatar>
                    )}
                    <span style={{ marginLeft: "12px" }}>
                      {option.firstName + " " + option.lastName}
                    </span>
                  </Box>
                )}
              />
              <ToggleButtonGroup
                fullWidth
                sx={{ marginTop: "12px" }}
                value={storyState ? storyState : "NEW"}
                exclusive
                onChange={(event, newValue) => {
                  setStoryState(newValue);
                }}
                color="pmLoginTheme"
              >
                <ToggleButton value="NEW">N</ToggleButton>
                <ToggleButton value="DEFINED">D</ToggleButton>
                <ToggleButton value="IN_PROGRESS">IP</ToggleButton>
                <ToggleButton value="READY">R</ToggleButton>
                <ToggleButton value="TEST">T</ToggleButton>
                <ToggleButton value="TEST_READY">TR</ToggleButton>
                <ToggleButton value="ACCEPTED">A</ToggleButton>
                <ToggleButton value="CLOSED">C</ToggleButton>
                <div
                  style={{
                    display: "inline-block",
                    position: "relative",
                    width: "24px",
                    height: "24px",
                  }}
                >
                  <HtmlTooltip title={tooltipExplainingStoriesState}>
                    <QuestionMarkIcon
                      style={{ fontSize: "34px", margin: "5px 0" }}
                      color="pmLoginTheme"
                    />
                  </HtmlTooltip>
                </div>
              </ToggleButtonGroup>
              <FormControl fullWidth margin="normal" color="pmLoginTheme">
                <InputLabel id="tags-chip-label">Tags</InputLabel>
                <Select
                  color="pmLoginTheme"
                  // fullWidth
                  labelId="tags-chip-label"
                  id="tag-multiple-chip"
                  multiple
                  onChange={handleTagsChanged}
                  value={storyTags ? storyTags : []}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  input={
                    <OutlinedInput id="select-multiple-chip" label="Tags" />
                  }
                  renderValue={(selectedTags) => (
                    <Box
                      sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, maxWidth: 580 }}
                      color="pmLoginTheme"
                    >
                      {selectedTags.map((tag) => (
                        <Chip
                          key={tag.id}
                          label={tag.tagName}
                          color="pmLoginTheme"
                        />
                      ))}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {tags.map((tag) => (
                    <MenuItem
                      color="pmLoginTheme"
                      key={tag.id}
                      value={tag}
                      style={getStyles(
                        tag,
                        storyTags,
                        getLoginTheme(useDarkMode)
                      )}
                    >
                      {tag.tagName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Typography>
                Blocked:{" "}
                <Checkbox
                  checked={storyBlocked}
                  icon={<BlockIcon sx={{ color: "gray" }} />}
                  checkedIcon={<BlockIcon sx={{ color: "red" }} />}
                  onChange={() => {
                    setStoryBlocked(!storyBlocked);
                  }}
                />
              </Typography>

              {storyBlocked && (
                <TextField
                  margin="dense"
                  id="blockReason"
                  label="Block Reason"
                  type="text"
                  fullWidth
                  color="pmLoginTheme"
                  value={storyBlockReason}
                  onChange={(e) => setStoryBlockReason(e.target.value)}
                />
              )}
              <TextField
                label="Description"
                color="pmLoginTheme"
                margin="normal"
                fullWidth
                multiline
                value={storyDescription}
                onChange={(e) => setStoryDescription(e.target.value)}
                maxRows={5}
                InputProps={{
                  className: "custom-scrollbar-text-field",
                }}
              />
            </DialogContent>
          </Box>
          <DialogActions>
            <Button
              color="pmLoginTheme"
              onClick={edit ? handleUpdate : handleAdd}
              disabled={!isFormValid()}
            >
              {edit ? "Update" : "Add"}
            </Button>
            <Button color="pmLoginTheme" onClick={handleClose}>
              Cancel
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </div>
  );
}

const possibleValuesStoryPoints = [1, 2, 3, 5, 8, 13];

const tooltipExplainingStoriesState = (
  <React.Fragment>
    <b>{"N (New)"}</b>
    {
      "- story is new. The goal and scope of this story has not been yet defined."
    }
    <br></br>
    <b>{"D (Defined)"}</b>
    {"- story has been defined. It's awaiting to be picked up by developer."}
    <br></br>
    <b>{"IP (In progress)"}</b>
    {"- story has been taken by developer."}
    <br></br>
    <b>{"R (Ready)"}</b>
    {
      "- story has been implemented by developer. It's awaiting to be picked up by QA."
    }
    <br></br>
    <b>{"T (Test)"}</b>
    {"- story has been taken by QA."}
    <br></br>
    <b>{"TR (Test Ready)"}</b>
    {"- story has been tested. It's awaiting PM to be accepted."}
    <br></br>
    <b>{"A (Accepted)"}</b>
    {"- story has been accepted by PM."}
    <br></br>
    <b>{"C (Closed)"}</b>
    {"- story has been closed. There will no be need for any additional work."}
    <br></br>
  </React.Fragment>
);

function getStyles(name, personName, theme) {
  if (!name || !personName) {
    return {
      fontWeight: theme.typography.fontWeightRegular,
    };
  }

  return {
    backgroundColor: !personName.some((tag) => tag.id === name.id)
      ? theme.palette.pmLoginTheme.background
      : theme.palette.pmLoginTheme.lightMain,
    fontWeight: !personName.some((tag) => tag.id === name.id)
      ? theme.typography.fontWeightRegular
      : theme.typography.fontWeightMedium,
  };
}
