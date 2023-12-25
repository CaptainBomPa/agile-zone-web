import * as React from "react";
import { Box, Button, IconButton } from "@mui/material";
import { useState, useEffect } from "react";
import { getAllTagsWithStats, addNewTag, removeTag } from "../service/Tags";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import RemoveIcon from "@mui/icons-material/Remove";

export default function ManageTags() {
  const [data, setData] = useState([]);
  const [newTagName, setNewTagName] = useState("");

  useEffect(() => {
    getAllTagsWithStats().then((response) => {
      setData(response);
    });
  }, []);

  const handleAddNewTag = () => {
    addNewTag(newTagName)
      .then((response) => {
        const updatedData = [...data, response];
        setData(updatedData);
        setNewTagName("");
      })
      .catch((error) => {
        console.error("Error while adding new tag", error);
      });
  };

  const handleRemoveTag = (tagId) => {
    console.log(data)
    console.log(tagId)
    removeTag(tagId)
      .then((response) => {
        const updatedData = data.filter((item) => item.id !== tagId);
        setData(updatedData);
      })
      .catch((error) => {
        console.error("Error while removing tag", error);
      });
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
        <TextField
          sx={{ m: 1, width: "35ch", height: "6ch" }}
          id="tagName"
          label="Add new tag"
          type="text"
          color="pmLoginTheme"
          value={newTagName}
          onChange={(e) => {
            setNewTagName(e.target.value);
          }}
        />
        <Button
          sx={{ m: 1, width: "35ch", height: "7ch" }}
          disabled={newTagName === ""}
          variant="outlined"
          color="pmLoginTheme"
          onClick={() => {
            handleAddNewTag();
          }}
        >
          ADD NEW TAG
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell width={50} />
              <TableCell>ID</TableCell>
              <TableCell>Tag&nbsp;Name</TableCell>
              <TableCell>Related&nbsp;UserStories&nbsp;count</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row" width={50}>
                  <IconButton onClick={() => handleRemoveTag(row.id)}>
                    <RemoveIcon sx={{ color: "red" }} />
                  </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.id}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.tagName}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.relatedItemCount}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
