import React, { createRef, useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import { visuallyHidden } from "@mui/utils";
import Collapse from "@mui/material/Collapse";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import UserStoryEditDialog from "./UserStoryEditDialog";
import TaskEditDialog from "./TaskEditDialog";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveIcon from "@mui/icons-material/Remove";
import Chip from "@mui/material/Chip";
import {
  deleteUserStory,
  deleteMultipleUserStories,
  deleteTask,
} from "../service/UserStoryUser";
import AutoHideAlert from "./AutoHideAlert";
import { useUserRoles } from "../service/UserRolesProvider";

function descendingComparator(a, b) {
  if (b < a) {
    return -1;
  }
  if (b > a) {
    return 1;
  }
  return 0;
}

function alphanumSort(a, b) {
  const collator = new Intl.Collator(undefined, {
    numeric: true,
    sensitivity: "base",
  });
  return collator.compare(a, b);
}

function getComparator(order, orderBy) {
  if (orderBy === "featureName") {
    return order === "desc"
      ? (a, b) => alphanumSort(b.feature[orderBy], a.feature[orderBy])
      : (a, b) => alphanumSort(a.feature[orderBy], b.feature[orderBy]);
  }
  if (orderBy === "userStoryName") {
    return order === "desc"
      ? (a, b) => alphanumSort(b[orderBy], a[orderBy])
      : (a, b) => alphanumSort(a[orderBy], b[orderBy]);
  }
  if (orderBy === "userStoryNameId") {
    return order === "desc"
      ? (a, b) => descendingComparator(b.id, a.id)
      : (a, b) => descendingComparator(a.id, b.id);
  }
  return order === "desc"
    ? (a, b) => descendingComparator(a[orderBy], b[orderBy])
    : (a, b) => -descendingComparator(a[orderBy], b[orderBy]);
}

function stableSort(array, comparator) {
  if (!array) return array;
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "userStoryNameId",
    numeric: true,
    disablePadding: false,
    label: "ID",
    field: "userStoryNameId",
  },
  {
    id: "userStoryName",
    numeric: false,
    disablePadding: false,
    label: "\u00A0Story\u00A0Name",
    field: "userStoryName",
  },
  {
    id: "storyPoints",
    numeric: true,
    disablePadding: false,
    label: "Story\u00A0Points",
    field: "storyPoints",
  },
  {
    id: "featureName",
    numeric: false,
    disablePadding: false,
    label: "TF\u00A0Name",
    field: "featureName",
  },
  {
    id: "assignedUser",
    numeric: false,
    disablePadding: false,
    label: "Owner",
    field: "assignedUser",
  },
  {
    id: "storyState",
    numeric: false,
    disablePadding: false,
    label: "State",
    field: "storyState",
  },
  {
    id: "tags",
    numeric: false,
    disablePadding: false,
    label: "Tag(s)",
    field: "tags",
  },
];

const DEFAULT_MIN_WIDTH_CELL = 75;
const DEFAULT_MAX_WIDTH_CELL = 1000;

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    onClickResizeColumn,
    columnRefs,
    isPermitted,
  } = props;

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead className="tableHead">
      <TableRow>
        <TableCell className="tableCell resizable" sx={{ width: "64px" }} />
        <TableCell padding="checkbox" className="tableCell resizable">
          <Checkbox
            disabled={!isPermitted()}
            color="pmLoginTheme"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        <TableCell className="tableCell resizable" sx={{ width: "64px" }} />
        {headCells.map((headCell, colIndex) => (
          <TableCell
            className="tableCell resizable"
            key={headCell.id}
            align={"right"}
            padding={"normal"}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            <TableSortLabel
              disabled={headCell.id === "tags"}
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
            <div
              onMouseDown={() => onClickResizeColumn(colIndex)}
              ref={columnRefs[colIndex]}
              className={"resizeLine"}
            />
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const {
    numSelected,
    handleDelete,
    data,
    setData,
    currentTeamId,
    currentIterationId,
    iteration,
    team,
    useDarkMode,
    isPermitted,
  } = props;

  const [openAdd, setOpenAdd] = useState(false);

  const handleAddUserStory = () => {
    setOpenAdd(!openAdd);
  };

  const handleAddUpdateRow = (newRow) => {
    if (
      currentTeamId === newRow.assignedUser?.team?.id &&
      currentIterationId === newRow.iteration.itNumber
    ) {
      const updatedData = [...data, newRow];
      setData(updatedData);
      setOpenAdd(false);
    }
  };

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) => (useDarkMode ? "#6b02bd" : "#f1dfff"),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          {iteration ? "Iteration" : "Backlog"} {iteration?.itNumber}{" "}
          {team?.teamName}
          <Tooltip title="Add new User Story">
            <IconButton
              disabled={!isPermitted()}
              onClick={() => handleAddUserStory()}
            >
              <AddCircleOutlineIcon
                sx={{ color: isPermitted() ? "green" : "gray" }}
              />
            </IconButton>
          </Tooltip>
        </Typography>
      )}

      {numSelected > 0 && (
        <Tooltip title="Delete">
          <IconButton disabled={!isPermitted()} onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      )}

      {openAdd && (
        <UserStoryEditDialog
          setOpen={setOpenAdd}
          edit={false}
          handleChangeUpdateRow={handleAddUpdateRow}
        />
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function UserStoryTable(props) {
  const { userDetails, data, setData, team, iteration, useDarkMode } =
    props;

  const [visibleRows, setVisibleRows] = useState([]);

  const [order, setOrder] = React.useState("desc");
  const [orderBy, setOrderBy] = React.useState("userStoryNameId");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const dense = false;

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

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = data?.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  useEffect(() => {
    const filteredAndSortedData = stableSort(
      data,
      getComparator(order, orderBy)
    ).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    setVisibleRows(filteredAndSortedData);
  }, [data, order, orderBy, page, rowsPerPage]);

  const [columnRefs, setColumnRefs] = useState(
    headCells.map(() => createRef())
  );

  const isResizing = useRef(-1);

  useEffect(() => {
    document.onmousemove = handleOnMouseMove;
    document.onmouseup = handleOnMouseUp;
    loadColumnInfoLocalStorage();
    return () => {
      document.onmousemove = null;
      document.onmouseup = null;
    };
  });

  function loadColumnInfoLocalStorage() {
    let columnsInfo = localStorage.getItem("columnsInfo");
    if (columnsInfo) {
      columnsInfo = JSON.parse(columnsInfo);
      Object.keys(columnsInfo).forEach((colField, index) => {
        if (
          columnRefs[index] &&
          columnRefs[index].current &&
          columnRefs[index].current.parentElement
        ) {
          columnRefs[index].current.parentElement.style.width =
            columnsInfo[colField];
        }
      });
    }
  }

  const saveColumnInfoLocalStorage = () => {
    let columnsInfo = {};
    headCells.forEach((col, index) => {
      columnsInfo[col.field] = {};
      if (
        columnRefs[index] &&
        columnRefs[index].current &&
        columnRefs[index].current.parentElement
      ) {
        columnsInfo[col.field] =
          columnRefs[index].current.parentElement.style.width;
      }
    });
    localStorage.setItem("columnsInfo", JSON.stringify(columnsInfo));
  };

  const adjustWidthColumn = (index, width) => {
    const minWidth = headCells[index]?.minWidth ?? DEFAULT_MIN_WIDTH_CELL;
    const maxWidth = columnRefs[index]?.maxWidth ?? DEFAULT_MAX_WIDTH_CELL;
    const newWidth =
      width > maxWidth ? maxWidth : width < minWidth ? minWidth : width;

    columnRefs[index].current.parentElement.style.width = newWidth + "px";
  };

  const setCursorDocument = (isResizing) => {
    document.body.style.cursor = isResizing ? "col-resize" : "auto";
  };

  const handleOnMouseMove = (e) => {
    if (
      isResizing.current >= 0 &&
      columnRefs &&
      columnRefs[isResizing.current]
    ) {
      const columnIndex = isResizing.current;
      const columnRef = columnRefs[columnIndex].current;

      columnRefs.current = headCells.map(() => createRef());
      if (columnRef && columnRef.parentElement) {
        const newWidth =
          e.clientX - columnRef.parentElement.getBoundingClientRect().left;
        adjustWidthColumn(columnIndex, newWidth);
      }
    }
  };

  const handleOnMouseUp = () => {
    if (isResizing.current !== -1) {
      isResizing.current = -1;
      saveColumnInfoLocalStorage();
      setCursorDocument(false);
    }
  };

  const onClickResizeColumn = (index) => {
    isResizing.current = index;
    setCursorDocument(true);
  };

  const handleDelete = async () => {
    if (selected.length === 1) {
      singleDeleteUserStory();
    } else {
      multipleDeleteUserStory();
    }
  };

  const multipleDeleteUserStory = async () => {
    const responseData = await deleteMultipleUserStories(selected);
    if (responseData) {
      const removedIds = responseData.map((item) => item.id);
      const updatedRows = data.filter((row) => !removedIds.includes(row.id));

      setData(updatedRows);
      setSelected([]);
      showAutoHideAlert("User Stories deleted", "success", 5000);
    } else {
      showAutoHideAlert("Could not delete User Stories", "error", 5000);
      console.error("Not removed", selected);
    }
  };

  const singleDeleteUserStory = async () => {
    const oneSelected = selected[0];
    const responseData = await deleteUserStory(oneSelected);
    if (responseData?.id === oneSelected) {
      const index = data.findIndex((row) => row.id === oneSelected);
      if (index !== -1) {
        const updatedRows = [...data];
        updatedRows.splice(index, 1);
        setData(updatedRows);
        setSelected([]);
        showAutoHideAlert("User Story deleted", "success", 5000);
      }
    } else {
      showAutoHideAlert("Could not delete User Story", "error", 5000);
      console.error("Not removed", oneSelected);
    }
  };

  const handleUpdateRow = (updatedRow) => {
    if (
      userDetails?.team?.id === updatedRow.team?.id &&
      data[0]?.iteration?.itNumber === updatedRow.iteration.itNumber
    ) {
      const updatedData = data.map((row) =>
        row.id === updatedRow.id ? updatedRow : row
      );
      setData(updatedData);
      showAutoHideAlert("User Story updated", "success", 5000);
    } else {
      const updatedData = data.filter((row) => row.id !== updatedRow.id);
      setData(updatedData);
      showAutoHideAlert("User Story deleted", "success", 5000);
    }
  };

  const { userRoles } = useUserRoles();
  const isPermitted = () => {
    return (
      userRoles?.includes("EDITING") ||
      userRoles?.includes("ADMINISTRATOR") ||
      userRoles?.includes("PROJECT_SUPERVISOR")
    );
  };

  return (
    <Box>
      <AutoHideAlert
        alertOpen={alertOpen}
        alertType={alertType}
        alertMessage={alertMessage}
        setAlertOpen={setAlertOpen}
      />
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          userDetails={userDetails}
          handleDelete={handleDelete}
          data={data}
          setData={setData}
          currentTeamId={team?.id}
          currentIterationId={iteration?.itNumber}
          team={team}
          iteration={iteration}
          useDarkMode={useDarkMode}
          isPermitted={isPermitted}
        />
        <TableContainer className="custom-scrollbar-table">
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
            className={"table"}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={data?.length}
              onClickResizeColumn={onClickResizeColumn}
              columnRefs={columnRefs}
              setColumnRefs={setColumnRefs}
              iteration={iteration}
              team={team}
              isPermitted={isPermitted}
            />
            <TableBody className="custom-scrollbar">
              {visibleRows.map((row, index) => {
                return (
                  <Row
                    className="custom-scrollbar"
                    key={row.id}
                    row={row}
                    index={index}
                    isSelected={isSelected}
                    handleClick={handleClick}
                    handleUpdateRow={handleUpdateRow}
                    showAutoHideAlert={showAutoHideAlert}
                    useDarkMode={useDarkMode}
                    isPermitted={isPermitted}
                  />
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  className="custom-scrollbar"
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100, 200]}
          component="div"
          count={data?.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}

function Row(props) {
  const {
    row,
    index,
    handleClick,
    isSelected,
    handleUpdateRow,
    showAutoHideAlert,
    useDarkMode,
    isPermitted,
  } = props;
  const [open, setOpen] = React.useState(false);

  const isItemSelected = isSelected(row.id);
  const labelId = `enhanced-table-checkbox-${index}`;
  const [openEdit, setOpenEdit] = React.useState(false);
  const [taskOpenEdit, setTaskOpenEdit] = React.useState(false);
  const [taskOpenAdd, setTaskOpenAdd] = React.useState(false);
  const [tasks, setTasks] = useState(row.tasks);

  const handleUpdateTaskList = (newTask) => {
    if (!tasks) {
      setTasks([newTask]);
      showAutoHideAlert("Task updated", "success", 5000);
    } else {
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      showAutoHideAlert("Task updated", "success", 5000);
    }
  };

  const handleUpdateTaskFromList = (updatedTask) => {
    const updatedTaskIndex = tasks.findIndex(
      (task) => task.id === updatedTask.id
    );
    if (updatedTaskIndex !== -1) {
      const updatedTasks = [...tasks];
      updatedTasks[updatedTaskIndex] = updatedTask;
      setTasks(updatedTasks);
      showAutoHideAlert("Task updated", "success", 5000);
    } else {
      setTasks([...tasks, updatedTask]);
    }
  };

  const handleEdit = (row) => {
    setOpenEdit(!openEdit);
  };

  const handleChangeUpdateRow = (updatedRow) => {
    handleUpdateRow(updatedRow);
    setOpenEdit(false);
  };

  const [taskToEdit, setTaskToEdit] = useState();

  const handleTaskEdit = (taskRow) => {
    setTaskToEdit(taskRow);
    setTaskOpenEdit(!taskOpenEdit);
  };

  const handleTaskAdd = () => {
    setTaskOpenAdd(!taskOpenAdd);
  };

  const handleTaskDelete = async (taskId) => {
    try {
      const response = await deleteTask(taskId);
      if (response) {
        const updatedTasks = tasks.filter((task) => task.id !== taskId);
        setTasks(updatedTasks);
        showAutoHideAlert("Task deleted", "success", 5000);
      } else {
        console.error(`Could not remove: ${taskId}`);
        showAutoHideAlert("Could not delete Task", "error", 5000);
      }
    } catch (error) {
      console.error(error);
      showAutoHideAlert("Could not delete Task", "error", 5000);
    }
  };

  return (
    <React.Fragment>
      {taskOpenEdit && (
        <TaskEditDialog
          setOpenEdit={setTaskOpenEdit}
          edit={true}
          userStoryId={row.id}
          previousTask={taskToEdit}
          handleUpdateTaskFromList={handleUpdateTaskFromList}
        />
      )}
      {taskOpenAdd && (
        <TaskEditDialog
          setOpenEdit={setTaskOpenAdd}
          edit={false}
          userStoryId={row.id}
          handleUpdateTaskList={handleUpdateTaskList}
        />
      )}
      {openEdit && (
        <UserStoryEditDialog
          setOpen={setOpenEdit}
          edit={true}
          userStory={row}
          handleChangeUpdateRow={handleChangeUpdateRow}
        />
      )}
      <TableRow
        hover
        role="checkbox"
        aria-checked={isItemSelected}
        tabIndex={-1}
        key={row.id}
        selected={isItemSelected}
        sx={{ cursor: "pointer", "& > *": { borderBottom: "unset" } }}
        className={`tableRow ${useDarkMode ? "dark-mode" : "light-mode"}`}
      >
        <TableCell
          className="tableCell"
          sx={{
            width: "64px",
            padding: "0",
            textAlign: "center",
            verticalAlign: "middle",
          }}
        >
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell
          padding="checkbox"
          className="tableCell resizable"
          sx={{
            width: "64px",
            padding: "0",
            textAlign: "center",
            verticalAlign: "middle",
          }}
        >
          <Checkbox
            disabled={!isPermitted()}
            onClick={(event) => handleClick(event, row.id)}
            color="pmLoginTheme"
            checked={isItemSelected}
            inputProps={{
              "aria-labelledby": labelId,
            }}
          />
        </TableCell>
        <TableCell
          className="tableCell resizable"
          sx={{
            width: "64px",
            padding: "0",
            textAlign: "center",
            verticalAlign: "middle",
          }}
        >
          <IconButton disabled={!isPermitted()} onClick={() => handleEdit(row)}>
            <ModeEditOutlineOutlinedIcon
              color={isPermitted() ? "pmLoginTheme" : "gray"}
            />
          </IconButton>
        </TableCell>

        <TableCell
          className="tableCell resizable"
          component="th"
          id={labelId}
          scope="row"
        >
          {row?.id}
        </TableCell>
        <TableCell
          className="tableCell resizable"
          component="th"
          id={labelId}
          scope="row"
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {row?.userStoryName}
        </TableCell>
        <TableCell
          align="right"
          className="tableCell resizable"
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {row?.storyPoints}
        </TableCell>
        <TableCell
          align="right"
          className="tableCell resizable"
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {row?.feature?.featureName}
        </TableCell>
        <TableCell
          align="right"
          className="tableCell resizable"
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {row?.assignedUser?.firstName} {row?.assignedUser?.lastName}
        </TableCell>
        <TableCell
          align="right"
          className="tableCell resizable"
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {formatUserStoryState(row?.state)}
        </TableCell>
        <TableCell
          align="right"
          className="tableCell resizable"
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            padding: "0px",
          }}
        >
          {row?.tags?.map((tag) => (
            <Chip
              sx={{ marginRight: "5px", marginTop: "0px", marginBottom: "0px" }}
              color="pmLoginTheme"
              label={tag.tagName}
              key={tag.id}
            />
          ))}
        </TableCell>
        <TableCell align="right" className="tableCell resizable"></TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Tasks
                <IconButton
                  disabled={!isPermitted()}
                  onClick={() => handleTaskAdd()}
                >
                  <AddCircleOutlineIcon
                    sx={{ color: isPermitted() ? "green" : "gray" }}
                  />
                </IconButton>
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: "64px" }} />
                    <TableCell sx={{ width: "64px" }} />
                    <TableCell sx={{ width: "20%" }}>Task number</TableCell>
                    <TableCell>Title</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tasks?.map((task, index) => {
                    return (
                      <TableRow key={task.id}>
                        <TableCell
                          sx={{
                            width: "64px",
                            padding: "0",
                            textAlign: "center",
                            verticalAlign: "middle",
                          }}
                        >
                          <IconButton
                            disabled={!isPermitted()}
                            onClick={() => handleTaskEdit(task)}
                          >
                            <ModeEditOutlineOutlinedIcon
                              color={isPermitted() ? "pmLoginTheme" : "gray"}
                            />
                          </IconButton>
                        </TableCell>
                        <TableCell
                          sx={{
                            width: "64px",
                            padding: "0",
                            textAlign: "center",
                            verticalAlign: "middle",
                          }}
                        >
                          <IconButton
                            disabled={!isPermitted()}
                            onClick={() => handleTaskDelete(task.id)}
                          >
                            <RemoveIcon
                              sx={{ color: isPermitted() ? "red" : "gray" }}
                            />
                          </IconButton>
                        </TableCell>

                        <TableCell
                          component="th"
                          scope="row"
                          sx={{ width: "20%" }}
                        >
                          {task.id}
                        </TableCell>
                        <TableCell>{task.taskName}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

function formatUserStoryState(state) {
  switch (state) {
    case "NEW":
      return "New";
    case "DEFINED":
      return "Defined";
    case "IN_PROGRESS":
      return "In Progress";
    case "READY":
      return "Ready";
    case "TEST":
      return "Test";
    case "TEST_READY":
      return "Test Ready";
    case "ACCEPTED":
      return "Accepted";
    case "CLOSED":
      return "Closed";
    default:
      return state;
  }
}
