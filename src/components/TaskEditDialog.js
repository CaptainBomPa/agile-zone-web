import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { addTask, updateTask } from "../service/UserStoryUser";
import { useState } from "react";

export default function TaskEditDialog(props) {
  const {
    setOpenEdit,
    edit,
    userStoryId,
    handleUpdateTaskList,
    handleUpdateTaskFromList,
    previousTask,
  } = props;

  const [taskName, setTaskName] = useState(
    previousTask ? previousTask.taskName : ""
  );
  const [description, setDescription] = useState(
    previousTask ? previousTask.description : ""
  );
  const taskId = previousTask ? previousTask.id : "";
  const handleClose = () => {
    setOpenEdit(false);
  };

  const handleUpdate = async () => {
    const taskData = {
      id: taskId,
      userStoryId: userStoryId,
      taskName: taskName,
      description: description,
    };

    try {
      const updatedTask = await updateTask(taskData);
      if (updatedTask) {
        handleUpdateTaskFromList(updatedTask)
        setOpenEdit(false);
      } else {
        console.error("Nie udało się zaktualizować zadania");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAdd = async () => {
    const taskData = {
      userStoryId: userStoryId,
      taskName: taskName,
      description: description,
    };

    try {
      const newTask = await addTask(taskData);
      if (newTask) {
        setOpenEdit(false);
        handleUpdateTaskList(newTask);
      } else {
        console.error("Nie udało się dodać nowego zadania");
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
        <Dialog open={true} onClose={handleClose} color="pmLoginTheme">
          <DialogTitle>
            {edit ? "Edit" : "New"} Task - UserStory ID ({userStoryId})
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Task Name"
              type="text"
              fullWidth
              variant="standard"
              color="pmLoginTheme"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
            />
            <TextField
              autoFocus
              margin="dense"
              label="Description"
              type="text"
              fullWidth
              variant="standard"
              color="pmLoginTheme"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
