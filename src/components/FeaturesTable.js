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
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { visuallyHidden } from "@mui/utils";
import Collapse from "@mui/material/Collapse";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveIcon from "@mui/icons-material/Remove";
import { deleteUserStory } from "../service/UserStoryUser";
import AutoHideAlert from "./AutoHideAlert";
import { useUserRoles } from "../service/UserRolesProvider";
import FeatureDialog from "./FeatureDialog";

const headCells = [
  {
    id: "featureId",
    numeric: true,
    disablePadding: false,
    label: "ID",
    field: "featureId",
  },
  {
    id: "featureName",
    numeric: false,
    disablePadding: false,
    label: "\u00A0Feature\u00A0Name",
    field: "featureName",
  },
  {
    id: "storyPoints",
    numeric: true,
    disablePadding: false,
    label: "All\u00A0Story\u00A0Points",
    field: "storyPoints",
  },
];

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
  if (orderBy === "featureId" || orderBy === "storyPoints") {
    return order === "desc"
      ? (a, b) => descendingComparator(b.id, a.id)
      : (a, b) => descendingComparator(a.id, b.id);
  }
  if (orderBy === "featureName") {
    return order === "desc"
      ? (a, b) => alphanumSort(b.featureName, a.featureName)
      : (a, b) => alphanumSort(a.featureName, b.featureName);
  }
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

const DEFAULT_MIN_WIDTH_CELL = 75;
const DEFAULT_MAX_WIDTH_CELL = 1000;

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort, onClickResizeColumn, columnRefs } =
    props;

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead className="tableHead">
      <TableRow>
        <TableCell className="tableCell resizable" sx={{ width: "64px" }} />
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
  const { isPermitted, setEditOpen } = props;

  return (
    <Toolbar>
      <Typography color="inherit" variant="subtitle1" component="div">
        Features
      </Typography>

      <Tooltip title="Add new Feature" align="left">
        <IconButton disabled={!isPermitted()} onClick={() => setEditOpen(true)}>
          <AddCircleOutlineIcon
            sx={{ color: isPermitted() ? "green" : "gray" }}
          />
        </IconButton>
      </Tooltip>
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function FeatureTable(props) {
  const { userDetails, useDarkMode, data, setData } = props;

  const [visibleRows, setVisibleRows] = useState([]);
  const [order, setOrder] = React.useState("desc");
  const [orderBy, setOrderBy] = React.useState("featureId");
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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
    let columnsInfo = localStorage.getItem("featureColumnsInfo");
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
    localStorage.setItem("featureColumnsInfo", JSON.stringify(columnsInfo));
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

  const { userRoles } = useUserRoles();
  const isPermitted = () => {
    return (
      userRoles?.includes("EDITING") ||
      userRoles?.includes("ADMINISTRATOR") ||
      userRoles?.includes("PROJECT_SUPERVISOR")
    );
  };

  const [editOpen, setEditOpen] = useState(false);

  return (
    <Box>
      {editOpen && (
        <FeatureDialog
          data={data}
          setData={setData}
          setOpenEdit={setEditOpen}
          edit={false}
          showAutoHideAlert={showAutoHideAlert}
          userDetails={userDetails}
        />
      )}
      <AutoHideAlert
        alertOpen={alertOpen}
        alertType={alertType}
        alertMessage={alertMessage}
        setAlertOpen={setAlertOpen}
      />
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar
          userDetails={userDetails}
          data={data}
          setData={setData}
          useDarkMode={useDarkMode}
          isPermitted={isPermitted}
          setEditOpen={setEditOpen}
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
            className={"table"}
          >
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={data?.length}
              onClickResizeColumn={onClickResizeColumn}
              columnRefs={columnRefs}
              setColumnRefs={setColumnRefs}
              isPermitted={isPermitted}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                return (
                  <Row
                    data={data}
                    setData={setData}
                    key={row.id}
                    row={row}
                    index={index}
                    showAutoHideAlert={showAutoHideAlert}
                    useDarkMode={useDarkMode}
                    isPermitted={isPermitted}
                  />
                );
              })}
              {emptyRows > 0 && (
                <TableRow
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
    useDarkMode,
    isPermitted,
    data,
    setData,
    showAutoHideAlert,
  } = props;
  const [open, setOpen] = React.useState(false);

  const labelId = `enhanced-table-checkbox-${index}`;
  const [userStories, setUserStories] = useState(row.userStories);

  const [editOpen, setEditOpen] = useState(false);
  const [selectedToEdit, setSelectedToEdit] = useState();

  const handleEdit = (row) => {
    setSelectedToEdit(row);
    setEditOpen(true);
  };

  const handleDeleteUserStory = (userStory) => {
    try {
      deleteUserStory(userStory.id).then((response) => {
        if (response) {
          const index = userStories.findIndex(
            (userStory) => userStory.id === response.id
          );
          const newUserStories = [...userStories];
          newUserStories.splice(index, 1);
          setUserStories(newUserStories);
          showAutoHideAlert("User Story removed", "success", 5000);
        }
      });
    } catch (error) {
      console.error(error);
      showAutoHideAlert("Error while removing User Story", "error", 5000);
    }
  };

  return (
    <React.Fragment>
      {editOpen && (
        <FeatureDialog
          data={data}
          setData={setData}
          setOpenEdit={setEditOpen}
          edit={true}
          feature={selectedToEdit}
          showAutoHideAlert={showAutoHideAlert}
        />
      )}
      <TableRow
        hover
        role="checkbox"
        tabIndex={-1}
        key={row.id}
        sx={{ cursor: "pointer", "& > *": { borderBottom: "unset" } }}
        className={`tableRow ${useDarkMode ? "dark-mode" : "light-mode"}`}
      >
        <TableCell
          className="tableCell resizable"
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
          {row?.featureName}
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
          {row?.allStoryPoints}
        </TableCell>
        <TableCell align="right" className="tableCell resizable"></TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                User Stories
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: "64px" }} />
                    <TableCell sx={{ width: "10%" }}>US ID</TableCell>
                    <TableCell>UserStory Name</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {userStories?.map((userStory, index) => {
                    return (
                      <TableRow key={userStory.id}>
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
                            onClick={() => {
                              handleDeleteUserStory(userStory);
                            }}
                          >
                            <RemoveIcon
                              sx={{ color: isPermitted() ? "red" : "gray" }}
                            />
                          </IconButton>
                        </TableCell>

                        <TableCell component="th" scope="row">
                          {userStory.id}
                        </TableCell>
                        <TableCell>{userStory.userStoryName}</TableCell>
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
