import React, { useState, useEffect } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import BackArrow from "@material-ui/icons/KeyboardBackspace";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Typography,
  Button,
} from "@material-ui/core";
import orderBy from "lodash/orderBy";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import DashboardHeader from "./DashboardHeader";
import "./style.css";
import { Link } from "react-router-dom";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  selectDropdown: { color: "#fff", backgroundColor: "#1b1f38" },
  menuItem: {
    "&:hover": {
      backgroundColor: "#3b3f58",
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  },
}));

const createData = (_id, id, title, date, status, department, compId) => ({
  _id,
  id,
  title,
  date,
  status,
  department,
  compId,
});

export default function ReportD({
  type,
  match,
  data,
  direction,
  setDirection,
  columnTosort,
  setColumnToSort,
}) {
  const classes = useStyles();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState(data);

  console.log(data);

  useEffect(() => {
    setRows(
      data.map((doc) =>
        createData(
          doc._id,
          doc.id,
          doc.title,
          doc.date,
          doc.status,
          doc.department,
          doc.compId
        )
      )
    );
  }, [data]);

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  const handleSort = (columnName) => {
    if (columnTosort === columnName && direction === "asc")
      setDirection("desc");
    else {
      setColumnToSort(columnName);
      setDirection("asc");
    }
    setRows(orderBy(rows, columnTosort, direction));
  };

  return (
    <>
      <br />
      <div>
        <ReactHTMLTableToExcel
          id="test-table-xls-button"
          className="download-table-xls-button"
          table="table-to-xls"
          filename="Report_for_Admin"
          sheet="tablexls"
          buttonText="Download Report"
        />
      </div>
      <br />

      <TableContainer component={Paper}>
        <Table
          id="table-to-xls"
          className={classes.table}
          aria-label="simple table"
        >
          <TableHead style={{ backgroundColor: "orange" }}>
            <TableRow>
              <StyledTableCell>
                <div onClick={() => handleSort("id")}>Id</div>
              </StyledTableCell>
              <StyledTableCell align="right">
                <div onClick={() => handleSort("title")}>Request Title</div>
              </StyledTableCell>
              <StyledTableCell align="right">
                <div onClick={() => handleSort("date")}>Date</div>
              </StyledTableCell>
              <StyledTableCell align="right">
                <div onClick={() => handleSort("status")}>Status</div>
              </StyledTableCell>
              <StyledTableCell align="right">
                <div onClick={() => handleSort("department")}>Departement</div>
              </StyledTableCell>
              <StyledTableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <StyledTableRow key={row.id}>
                <TableCell component="th" scope="row">
                  <Typography
                    style={{
                      fontWeight: 600,
                      fontFamily: `Verdana, Arial, Helvetica, sans-serif`,
                    }}
                  >
                    {" "}
                    {page * 10 + index + 1}
                  </Typography>
                </TableCell>
                <StyledTableCell align="right">{row.title}</StyledTableCell>
                <StyledTableCell align="right">{row.date}</StyledTableCell>
                <StyledTableCell align="right">{row.status}</StyledTableCell>
                <StyledTableCell align="right">
                  {row.department}
                </StyledTableCell>
              </StyledTableRow>
            ))}
            {emptyRows > 0 && (
              <StyledTableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
