import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TableHead,
  TextField,
} from "@mui/material";
import { useStore } from "./store";
import TablePaginationActions from "./components/TablePaginationActions";



export default function CustomPaginationActionsTable() {
  const navigate = useNavigate();
  const { data, fetchData, isLoading, error } = useStore((state) => state);
  const [search, setSearch] = useState("");
  const [filterQuery, setFilterQuery] = React.useState("all");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  useEffect(() => {
    fetchData();
  }, []);

  let keys = ["title", "author", "date", "genre"];

  let filteredData = data?.filter((row) => {
    if (filterQuery === "all") {
      return keys.some((key) => {
        return row[key].toString().toLowerCase().includes(search.toLowerCase());
      });
    } else
      return row[filterQuery]
        .toString()
        .toLowerCase()
        .includes(search.toLowerCase());
  });

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredData.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (isLoading) {
    return <>Loading...</>;
  }

  if (error) {
    return <>Error loading page</>;
  }

  return (
    <>
      <Stack direction={"row"} spacing={4} mb={4}>
        <TextField
          id="outlined-basic"
          label="Search"
          variant="outlined"
          value={search || ""}
          placeholder={"Enter text"}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0)
          }}
        />
        <FormControl>
          <InputLabel>Filter</InputLabel>
          <Select
            value={filterQuery}
            label="Filter"
            onChange={(e) => setFilterQuery(e.target.value)}
          >
            <MenuItem value={"title"}>Title</MenuItem>
            <MenuItem value={"author"}>Author</MenuItem>
            <MenuItem value={"date"}>Date</MenuItem>
            <MenuItem value={"genre"}>Genre</MenuItem>
            <MenuItem value={"all"}>All</MenuItem>
          </Select>
        </FormControl>
      </Stack>
      {filteredData?.length ? (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Author</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Genre</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? filteredData.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : filteredData
              ).map((row) => {
                return (
                  <TableRow
                    onClick={() => navigate(`/book/${row.id}`)}
                    style={{ cursor: "pointer" }}
                    key={row.id}
                  >
                    <TableCell>{row.title}</TableCell>
                    <TableCell>{row.author}</TableCell>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.genre}</TableCell>
                  </TableRow>
                );
              })}

              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                  colSpan={2}
                  count={filteredData?.length}
                  rowsPerPage={rowsPerPage}
                  page={filteredData.length <= rowsPerPage ? 0 : page}
                  SelectProps={{
                    inputProps: {
                      "aria-label": "rows per page",
                    },
                    native: true,
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      ) : null}
    </>
  );
}
