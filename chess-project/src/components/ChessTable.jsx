import React from "react";
import Tile from "./Tile";

const verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];
const horizontalAxis = ["h", "g", "f", "e", "d", "c", "b", "a"];

//Piece class
// class Piece {
//   pieceName;
//   image;
//   verticalPosition;
//   horizontalPosition;
//   constructor(pieceName, image, verticalPosition, horizontalPosition) {
//     this.pieceName = pieceName;
//     this.image = image;
//     this.verticalPosition = verticalPosition;
//     this.horizontalPosition = horizontalPosition;
//   }
// }

//ArrayList with all the pieces
//Most probably in App
// const pieces = [];
// pieces.push(new Piece("bishop_b", "assets/images/bishop_b.png", "8", "a"));

function ChessTable(props) {
  //Render the table
  var table = [];
  for (var i = 0; i < verticalAxis.length; i++) {
    for (var j = 0; j < horizontalAxis.length; j++) {
      const indexesSum = i + j;
      let image = null;
      let pieceName = null;
      //Check if the current tile has a piece defined on it
      const verticalPos = verticalAxis[i];
      const horizontalPos = horizontalAxis[j];

      props.pieces.forEach(function (p) {
        if (
          p.verticalPosition === verticalPos &&
          p.horizontalPosition === horizontalPos
        ) {
          image = p.image;
          pieceName = p.pieceName;
        }
      });

      table.push(
        <Tile
          key={horizontalAxis[j] + verticalAxis[i]}
          id={horizontalAxis[j] + verticalAxis[i]}
          indexesSum={indexesSum}
          img={image}
          pieceName={pieceName}
        />
      );
    }
  }

  return <div className="chessBoard">{table}</div>;
}

export default ChessTable;
