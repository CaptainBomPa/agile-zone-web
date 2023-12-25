import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import { addNewFeature } from "../service/Features";

export default function FeatureDialog(props) {
  const {
    setOpenEdit,
    edit,
    feature,
    data,
    setData,
    showAutoHideAlert,
    userDetails,
  } = props;

  const [featureName, setFeatureName] = useState(
    feature ? feature.featureName : ""
  );
  const handleClose = () => {
    setOpenEdit(false);
  };

  const handleUpdate = async () => {
    const updateFeature = {
      id: feature.id,
      featureName: featureName,
      project: feature.project,
    };

    try {
      await addNewFeature(updateFeature).then(
        (response) => {
          const index = data.findIndex((feature) => feature.id === response.id);
          const newData = [...data];
          const oldData = newData[index];
          newData[index] = response;
          newData[index].allStoryPoints = oldData.allStoryPoints;
          setData(newData);
          handleClose();
          showAutoHideAlert("Feature updated", "success", 5000);
        }
      );
    } catch (error) {
      console.error(error);
      showAutoHideAlert("Error while updating feature", "error", 5000);
    }
  };

  const handleAdd = async () => {
    console.log(userDetails);
    const newFeature = {
      featureName: featureName,
      project: userDetails.project,
    };

    try {
      await addNewFeature(newFeature).then((response) => {
        const newData = [...data];
        response.allStoryPoints = 0;
        newData.push(response);
        setData(newData);
        handleClose();
        showAutoHideAlert("Feature added", "success", 5000);
      });
    } catch (error) {
      console.error(error);
      showAutoHideAlert("Error while adding feature", "error", 5000);
    }
  };

  return (
    <div>
      <Dialog fullWidth open={true} onClose={handleClose} color="pmLoginTheme">
        <DialogTitle>{edit ? "Edit" : "New"} Feature</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Feature Name"
            type="text"
            fullWidth
            variant="standard"
            color="pmLoginTheme"
            value={featureName}
            onChange={(e) => setFeatureName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            color="pmLoginTheme"
            onClick={edit ? handleUpdate : handleAdd}
          >
            {edit ? "Update" : "Add"}
          </Button>
          <Button color="pmLoginTheme" onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
