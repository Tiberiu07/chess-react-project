import React, { useState } from "react";
import ChessTable from "./ChessTable";

class Piece {
  pieceName;
  image;
  verticalPosition;
  horizontalPosition;
  constructor(pieceName, image, verticalPosition, horizontalPosition) {
    this.pieceName = pieceName;
    this.image = image;
    this.verticalPosition = verticalPosition;
    this.horizontalPosition = horizontalPosition;
  }
}

function App() {
  const verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];
  const horizontalAxis = ["h", "g", "f", "e", "d", "c", "b", "a"];
  const [pieces, SetPieces] = useState([]);

  function randomInitialization() {
    const piecesNames = [
      "bishop_b",
      "bishop_w",
      "knight_b",
      "knight_w",
      "queen_b",
      "queen_w",
    ];
    for (var i = 0; i < piecesNames.length; i++) {
      //Get the piece name
      let pieceName = piecesNames[i];
      //Generate random position -> rand number between 0 and 7
      let verticalPosition = verticalAxis[Math.floor(Math.random() * 8)];
      let horizontalPosition = horizontalAxis[Math.floor(Math.random() * 8)];
      //Generate the img source string
      let imgSource = "assets/images/" + pieceName + ".png";
      //Update the pieces array with the new values
      SetPieces(function (previous) {
        return [
          ...previous,
          new Piece(pieceName, imgSource, verticalPosition, horizontalPosition),
        ];
      });
    }
  }

  return (
    <div onClick={randomInitialization}>
      <ChessTable pieces={pieces} />
    </div>
  );
}

export default App;
