import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";
import { useState, useEffect } from "react";
import { getAllBlocked } from "../service/UsersInfo";
import { unlockUsers, removeUsers } from "../service/UsersInfo";

const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "username", headerName: "Username", width: 230 },
  { field: "firstName", headerName: "First name", width: 230 },
  { field: "lastName", headerName: "Last name", width: 230 },
  { field: "email", headerName: "Email", width: 330 },
];

export default function RequestAdd() {
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    getAllBlocked().then((response) => {
      setData(response);
    });
  }, []);

  const handleUnlockAccounts = () => {
    unlockUsers(selectedRows)
      .then((response) => {
        const unlockedUserIds = response.map((user) => user.id);
        const updatedData = data.filter(
          (user) => !unlockedUserIds.includes(user.id)
        );
        setSelectedRows([]);
        setData(updatedData);
      })
      .catch((error) => {
        console.error("Error while unlocking accounts", error);
      });
  };

  const handleDeleteAccounts = () => {
    removeUsers(selectedRows)
      .then((response) => {
        const unlockedUserIds = response.map((user) => user.id);
        const updatedData = data.filter(
          (user) => !unlockedUserIds.includes(user.id)
        );
        setSelectedRows([]);
        setData(updatedData);
      })
      .catch((error) => {
        console.error("Error while unlocking accounts", error);
      });
  };

  const selectionHandler = (ids) => {
    if (data && ids) {
      const searchedRows = ids.map((id) => data.find((row) => row.id === id));
      setSelectedRows(searchedRows)
    }
  };

  return (
    <Box
      sx={{
        width: "100% - 64px",
        marginLeft: "64px",
        marginTop: "84px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      {" "}
      <Box>
        <Button
          sx={{ m: 1, width: "35ch", height: "6ch" }}
          variant="outlined"
          color="pmLoginTheme"
          onClick={() => {
            handleUnlockAccounts();
          }}
        >
          Accepts users
        </Button>
        <Button
          sx={{ m: 1, width: "35ch", height: "6ch" }}
          variant="outlined"
          color="pmLoginTheme"
          onClick={() => {
            handleDeleteAccounts();
          }}
        >
          Delete requests and users
        </Button>
      </Box>
      <DataGrid
        sx={{ minWidth: 700, width: "70%", maxWidth: "80%" }}
        rows={data}
        columns={columns}
        disableSelectionOnClick
        onRowSelectionModelChange={(ids) => selectionHandler(ids)}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
      />
    </Box>
  );
}
