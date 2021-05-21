import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import shortid from "shortid";

const columns = [
  { id: "White_Bishop", label: "White_Bishop", minWidth: 100, align: "center" },
  { id: "Black_Bishop", label: "Black_Bishop", minWidth: 100, align: "center" },
  { id: "White_Knight", label: "White_Knight", minWidth: 100, align: "center" },
  { id: "Black_Knight", label: "Black_Knight", minWidth: 100, align: "center" },
  { id: "White_Queen", label: "White_Queen", minWidth: 100, align: "center" },
  { id: "Black_Queen", label: "Black_Queen", minWidth: 100, align: "center" },
];

//Create new row
function createData(
  White_Bishop,
  Black_Bishop,
  White_Knight,
  Black_Knight,
  White_Queen,
  Black_Queen
) {
  White_Bishop = White_Bishop === "z9" ? "X" : White_Bishop;
  Black_Bishop = Black_Bishop === "z9" ? "X" : Black_Bishop;
  White_Knight = White_Knight === "z9" ? "X" : White_Knight;
  Black_Knight = Black_Knight === "z9" ? "X" : Black_Knight;
  White_Queen = White_Queen === "z9" ? "X" : White_Queen;
  Black_Queen = Black_Queen === "z9" ? "X" : Black_Queen;
  return {
    White_Bishop,
    Black_Bishop,
    White_Knight,
    Black_Knight,
    White_Queen,
    Black_Queen,
  };
}

var rows = [
  //   createData("G7", "G9", "G8", "F2", "A2", "B5"),
  //   createData("A5", "B5", "B7", "A1", "G7", "G9"),
];

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 440,
    backgroundColor: "#779556",
    fontWeight: 600,
  },
});

export default function StateHistory(props) {
  function handleRowClick(event) {
    //Get the row positions for each piece
    var piecesPositions = [];
    var piecesObjects = event.target.parentElement.children;
    for (var pieceObject of piecesObjects) {
      piecesPositions.push(pieceObject.innerText);
    }
    //Swap the positions so that piecesPositions array will match pieces state array, regarding piece order
    //Swap every 2 elements
    for (var i = 0; i < piecesPositions.length; i = i + 2) {
      [piecesPositions[i], piecesPositions[i + 1]] = [
        piecesPositions[i + 1],
        piecesPositions[i],
      ];
    }
    props.onRowClick(piecesPositions);
  }

  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  if (props.piecesUpdated === false) {
    //Check if new simulation was called
    if (props.newSimulation === true) {
      //Delete the old History
      rows = [];
      //Set the newSimulation hook set to false
      props.SetNewSimulation(false);
    }
    //If the state was updated, but it does not coincide with the table
    //Update the table with pieces data
    var piecesPositions = [];
    props.pieces.forEach((piece) => {
      piecesPositions[piece.pieceName] =
        piece.horizontalPosition + piece.verticalPosition;
    });
    rows = [
      createData(
        piecesPositions["bishop_w"],
        piecesPositions["bishop_b"],
        piecesPositions["knight_w"],
        piecesPositions["knight_b"],
        piecesPositions["queen_w"],
        piecesPositions["queen_b"]
      ),
      ...rows,
    ];
    props.piecesSetStateUpdated(true);
  }

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={shortid.generate()}
                  >
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell
                          onClick={handleRowClick}
                          key={column.id}
                          align={column.align}
                        >
                          {column.format && typeof value === "number"
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
