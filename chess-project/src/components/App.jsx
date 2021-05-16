import React, { useState } from "react";
import ChessTable from "./ChessTable";
import PlayerDashboard from "./PlayerDashboard";
import Button from "@material-ui/core/Button";

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

  async function randomInitialization() {
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
      let alreadySet = false;
      //Update the pieces array with the new values
      //Wait for the SetPieces async function to finish, so that we have the correct alreadySet Value
      await SetPieces(function (previous) {
        //Check if a piece is already placed in this position
        previous.forEach(function (element) {
          if (
            element.verticalPosition === verticalPosition &&
            element.horizontalPosition === horizontalPosition
          ) {
            alreadySet = true;
          }
        });
        if (alreadySet) {
          //Try again
          return [...previous];
        } else {
          return [
            ...previous,
            new Piece(
              pieceName,
              imgSource,
              verticalPosition,
              horizontalPosition
            ),
          ];
        }
      });
      if (alreadySet) {
        //retry to find a new position for the current piece
        i--;
        continue;
      }
    }
  }

  //Debugging purposes. To be eliminated in the final version.
  function showPieces() {
    if (pieces.length === 0) {
      console.log("Empty Array");
    } else {
      pieces.forEach(function (element) {
        console.log(element);
      });
    }
  }

  function clickedFirst() {
    console.log("Clicked button");
  }

  return (
    <div className="app-content_wrapper">
      <div className="app-content__top-part">
        <PlayerDashboard playerLetter="A" playerColor="w" />
        <div onClick={randomInitialization}>
          <ChessTable pieces={pieces} />
        </div>
        <PlayerDashboard playerLetter="B" playerColor="b" />
        {/* <button onClick={showPieces}>Show Pieces</button> */}
      </div>
      <div className="app-content__middle-part">
        <Button variant="contained" color="primary" onClick={clickedFirst}>
          New Simulation
        </Button>
        <Button variant="contained" color="primary" onClick={clickedFirst}>
          Start
        </Button>
        <Button variant="contained" color="primary" onClick={clickedFirst}>
          Pause
        </Button>
      </div>
    </div>
  );
}

export default App;
