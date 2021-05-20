import React, { useState } from "react";
import ChessTable from "./ChessTable";
import PlayerDashboard from "./PlayerDashboard";
import Button from "@material-ui/core/Button";
import StateHistory from "./StateHistory";

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
  const [isStateUpdated, SetIsStateUpdated] = useState(true);
  const [newSimulation, SetNewSimulation] = useState(false);
  const [isGameOver, SetGameOver] = useState(false);
  const [isGamePaused, SetGamePaused] = useState(false);
  const [timeOut, setTimeOut] = useState(); //Keep track of game loop setInterval ID, so that when we pause we can clearInterval it

  async function randomInitialization() {
    if (isGameOver) {
      SetGameOver(false);
    }
    //Set Pieces to null
    //Execute the functions in a secvential manner
    if (pieces.length !== 0) {
      //If the pieces array is not null, make it so
      await SetPieces(function (previous) {
        previous = [];
        return previous;
      });
      //Tell the StateHistory to clear itself
      SetNewSimulation(true);
      SetGamePaused(false);
    }
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
    //Set IsStateUpdated to false for StateHistory rendering
    SetIsStateUpdated(false);
  }

  async function pieceMoveSimulation(pieceName) {
    //Parse the pieceName parameter to get the piece type and piece color
    const pieceNameSplit = pieceName.split("_");
    const pieceType = pieceNameSplit[0];
    const pieceColor = pieceNameSplit[1];
    //Get the current position
    //Get the current position
    var vertPosition = null;
    var horPosition = null;
    pieces.forEach(function (piece) {
      if (piece.pieceName === pieceName) {
        vertPosition = piece.verticalPosition;
        horPosition = piece.horizontalPosition;
      }
    });
    //Construct an array of permitted positions for the random selection
    //For this, 2 iterators will pe used to iterate through every possible permitted position
    //Only within the bounds
    var vertIterator = vertPosition;
    var horIterator = horPosition;
    var permitedPositions = [];
    //Select a random Position for the piece, according to its type`s rules
    switch (pieceType) {
      case "bishop":
        //A bishop can move only within diagonals
        //First subcase, the iterator will go left and down until reached board bounds
        while (
          String.fromCharCode(vertIterator.charCodeAt(0) + 1) <= "8" &&
          String.fromCharCode(horIterator.charCodeAt(0) + 1) <= "h"
        ) {
          vertIterator = String.fromCharCode(vertIterator.charCodeAt(0) + 1);
          horIterator = String.fromCharCode(horIterator.charCodeAt(0) + 1);
          permitedPositions.push(horIterator + vertIterator);
        }
        //Restore iterator values to the original positions
        vertIterator = vertPosition;
        horIterator = horPosition;
        //Second subcase, the iterator will go left and up until reached board bounds
        while (
          String.fromCharCode(vertIterator.charCodeAt(0) - 1) >= "1" &&
          String.fromCharCode(horIterator.charCodeAt(0) + 1) <= "h"
        ) {
          vertIterator = String.fromCharCode(vertIterator.charCodeAt(0) - 1);
          horIterator = String.fromCharCode(horIterator.charCodeAt(0) + 1);
          permitedPositions.push(horIterator + vertIterator);
        }
        //Restore iterator values to the original positions
        vertIterator = vertPosition;
        horIterator = horPosition;
        //Third subcase, the iterator will go right and down until reached board bounds
        while (
          String.fromCharCode(vertIterator.charCodeAt(0) + 1) <= "8" &&
          String.fromCharCode(horIterator.charCodeAt(0) - 1) >= "a"
        ) {
          vertIterator = String.fromCharCode(vertIterator.charCodeAt(0) + 1);
          horIterator = String.fromCharCode(horIterator.charCodeAt(0) - 1);
          permitedPositions.push(horIterator + vertIterator);
        }
        //Restore iterator values to the original positions
        vertIterator = vertPosition;
        horIterator = horPosition;
        //Fourth subcase, the iterator will go right and up until reached board bounds
        while (
          String.fromCharCode(vertIterator.charCodeAt(0) - 1) >= "1" &&
          String.fromCharCode(horIterator.charCodeAt(0) - 1) >= "a"
        ) {
          vertIterator = String.fromCharCode(vertIterator.charCodeAt(0) - 1);
          horIterator = String.fromCharCode(horIterator.charCodeAt(0) - 1);
          permitedPositions.push(horIterator + vertIterator);
        }
        //Restore iterator values to the original positions
        vertIterator = vertPosition;
        horIterator = horPosition;

        break;

      case "queen":
        //Diagonal moves
        //First subcase, the iterator will go left and down until reached board bounds
        while (
          String.fromCharCode(vertIterator.charCodeAt(0) + 1) <= "8" &&
          String.fromCharCode(horIterator.charCodeAt(0) + 1) <= "h"
        ) {
          vertIterator = String.fromCharCode(vertIterator.charCodeAt(0) + 1);
          horIterator = String.fromCharCode(horIterator.charCodeAt(0) + 1);
          permitedPositions.push(horIterator + vertIterator);
        }
        //Restore iterator values to the original positions
        vertIterator = vertPosition;
        horIterator = horPosition;
        //Second subcase, the iterator will go left and up until reached board bounds
        while (
          String.fromCharCode(vertIterator.charCodeAt(0) - 1) >= "1" &&
          String.fromCharCode(horIterator.charCodeAt(0) + 1) <= "h"
        ) {
          vertIterator = String.fromCharCode(vertIterator.charCodeAt(0) - 1);
          horIterator = String.fromCharCode(horIterator.charCodeAt(0) + 1);
          permitedPositions.push(horIterator + vertIterator);
        }
        //Restore iterator values to the original positions
        vertIterator = vertPosition;
        horIterator = horPosition;
        //Third subcase, the iterator will go right and down until reached board bounds
        while (
          String.fromCharCode(vertIterator.charCodeAt(0) + 1) <= "8" &&
          String.fromCharCode(horIterator.charCodeAt(0) - 1) >= "a"
        ) {
          vertIterator = String.fromCharCode(vertIterator.charCodeAt(0) + 1);
          horIterator = String.fromCharCode(horIterator.charCodeAt(0) - 1);
          permitedPositions.push(horIterator + vertIterator);
        }
        //Restore iterator values to the original positions
        vertIterator = vertPosition;
        horIterator = horPosition;
        //Fourth subcase, the iterator will go right and up until reached board bounds
        while (
          String.fromCharCode(vertIterator.charCodeAt(0) - 1) >= "1" &&
          String.fromCharCode(horIterator.charCodeAt(0) - 1) >= "a"
        ) {
          vertIterator = String.fromCharCode(vertIterator.charCodeAt(0) - 1);
          horIterator = String.fromCharCode(horIterator.charCodeAt(0) - 1);
          permitedPositions.push(horIterator + vertIterator);
        }
        //Restore iterator values to the original positions
        vertIterator = vertPosition;
        horIterator = horPosition;

        //Besides diagonal, also horizontal and vertical
        //First subcase, the iterator will go straight up until it reached board bounds
        while (String.fromCharCode(vertIterator.charCodeAt(0) - 1) >= "1") {
          vertIterator = String.fromCharCode(vertIterator.charCodeAt(0) - 1);
          permitedPositions.push(horIterator + vertIterator);
        }
        //Restore iterator values to the original positions
        vertIterator = vertPosition;
        horIterator = horPosition;
        //Second subcase, the iterator will go straight down until it reached board bounds
        while (String.fromCharCode(vertIterator.charCodeAt(0) + 1) <= "8") {
          vertIterator = String.fromCharCode(vertIterator.charCodeAt(0) + 1);
          permitedPositions.push(horIterator + vertIterator);
        }
        //Restore iterator values to the original positions
        vertIterator = vertPosition;
        horIterator = horPosition;
        //Third subcase, the iterator will go right until reached board bounds
        while (String.fromCharCode(horIterator.charCodeAt(0) - 1) >= "a") {
          horIterator = String.fromCharCode(horIterator.charCodeAt(0) - 1);
          permitedPositions.push(horIterator + vertIterator);
        }
        //Restore iterator values to the original positions
        vertIterator = vertPosition;
        horIterator = horPosition;

        //Fourth subcase, the iterator will go left until reached board bounds
        while (String.fromCharCode(horIterator.charCodeAt(0) + 1) <= "h") {
          horIterator = String.fromCharCode(horIterator.charCodeAt(0) + 1);
          permitedPositions.push(horIterator + vertIterator);
        }
        //Restore iterator values to the original positions
        vertIterator = vertPosition;
        horIterator = horPosition;

        break;

      case "knight":
        //Check the the knight`s 8 permitted positions
        //One Down, Two Left
        if (
          String.fromCharCode(vertIterator.charCodeAt(0) - 1) >= "1" &&
          String.fromCharCode(horIterator.charCodeAt(0) - 2) >= "a"
        ) {
          permitedPositions.push(
            String.fromCharCode(horIterator.charCodeAt(0) - 2) +
              String.fromCharCode(vertIterator.charCodeAt(0) - 1)
          );
        }
        //Two Down, One Left
        if (
          String.fromCharCode(vertIterator.charCodeAt(0) - 2) >= "1" &&
          String.fromCharCode(horIterator.charCodeAt(0) - 1) >= "a"
        ) {
          permitedPositions.push(
            String.fromCharCode(horIterator.charCodeAt(0) - 1) +
              String.fromCharCode(vertIterator.charCodeAt(0) - 2)
          );
        }
        //Two Up, One Left
        if (
          String.fromCharCode(vertIterator.charCodeAt(0) + 2) <= "8" &&
          String.fromCharCode(horIterator.charCodeAt(0) - 1) >= "a"
        ) {
          permitedPositions.push(
            String.fromCharCode(horIterator.charCodeAt(0) - 1) +
              String.fromCharCode(vertIterator.charCodeAt(0) + 2)
          );
        }
        //Two Left, One Up
        if (
          String.fromCharCode(vertIterator.charCodeAt(0) + 1) <= "8" &&
          String.fromCharCode(horIterator.charCodeAt(0) - 2) >= "a"
        ) {
          permitedPositions.push(
            String.fromCharCode(horIterator.charCodeAt(0) - 2) +
              String.fromCharCode(vertIterator.charCodeAt(0) + 1)
          );
        }
        //Two Right, One up
        if (
          String.fromCharCode(vertIterator.charCodeAt(0) + 1) <= "8" &&
          String.fromCharCode(horIterator.charCodeAt(0) + 2) <= "h"
        ) {
          permitedPositions.push(
            String.fromCharCode(horIterator.charCodeAt(0) + 2) +
              String.fromCharCode(vertIterator.charCodeAt(0) + 1)
          );
        }
        //Two Up, One Right
        if (
          String.fromCharCode(vertIterator.charCodeAt(0) + 2) <= "8" &&
          String.fromCharCode(horIterator.charCodeAt(0) + 1) <= "h"
        ) {
          permitedPositions.push(
            String.fromCharCode(horIterator.charCodeAt(0) + 1) +
              String.fromCharCode(vertIterator.charCodeAt(0) + 2)
          );
        }
        //Two Right, One Down
        if (
          String.fromCharCode(vertIterator.charCodeAt(0) - 1) >= "1" &&
          String.fromCharCode(horIterator.charCodeAt(0) + 2) <= "h"
        ) {
          permitedPositions.push(
            String.fromCharCode(horIterator.charCodeAt(0) + 2) +
              String.fromCharCode(vertIterator.charCodeAt(0) - 1)
          );
        }
        //Two Down, One Right
        if (
          String.fromCharCode(vertIterator.charCodeAt(0) - 2) >= "1" &&
          String.fromCharCode(horIterator.charCodeAt(0) + 1) <= "h"
        ) {
          permitedPositions.push(
            String.fromCharCode(horIterator.charCodeAt(0) + 1) +
              String.fromCharCode(vertIterator.charCodeAt(0) - 2)
          );
        }
        break;
      default:
        break;
    }

    var min = 0;
    var max = permitedPositions.length - 1;
    let validMove;

    //Warnings bypass functions (no variable changes in loops / unsafe)
    var changeValidMove = function () {
      validMove = !validMove;
    };
    var getRandomPosition = function () {
      return randomPosition;
    };
    var getValidMove = function () {
      return validMove;
    };

    do {
      //Now that we have a permitted positions array, pick a random one
      var randomIndex = Math.floor(Math.random() * (max - min + 1)) + min;
      var randomPosition = permitedPositions[randomIndex];
      validMove = true; //Assume that the picked position is valid

      await SetPieces(function (previous) {
        //Check if a piece already on this position
        previous.forEach(function (piece) {
          if (
            piece.horizontalPosition + piece.verticalPosition ===
            getRandomPosition()
          ) {
            //Check if same color
            if (piece.pieceName.split("_")[1] === pieceColor) {
              //Same color, so invalid move
              //Pick a new randomPosition and repeat the process
              changeValidMove();
            } else {
              //Different color
              //Eliminate the piece / Set its position parameters to z9
              piece.horizontalPosition = "z";
              piece.verticalPosition = "9";
            }
          }
        });
        return previous;
      });
      //If validMove, update the piece position
      if (getValidMove()) {
        await SetPieces(function (previous) {
          previous.forEach((piece) => {
            if (piece.pieceName === pieceName) {
              //Update the piece coordinates
              piece.horizontalPosition = getRandomPosition().split("")[0];
              piece.verticalPosition = getRandomPosition().split("")[1];
            }
          });
          SetIsStateUpdated(false);
          return previous;
        });
      }
    } while (!validMove);
  }

  async function gameSimulation() {
    if (!isGamePaused) {
      let turn = "w";
      var getTurn = function () {
        return turn;
      };
      //Execute the moves within a set time interval, so that we can see each move

      setTimeOut((previous) => {
        var newInterval = setInterval(async function () {
          let availablePieces = [];
          pieces.forEach((piece) => {
            //If piece not eliminated
            if (
              piece.pieceName.split("_")[1] === getTurn() &&
              piece.horizontalPosition !== "z"
            ) {
              availablePieces.push(piece.pieceName);
            }
          });
          if (availablePieces.length === 0) {
            //Game Over
            //Change GameOver State
            SetGameOver(true);

            clearInterval(newInterval);
          } else {
            //Pick a random piece
            var randomIndex = Math.floor(
              Math.random() * availablePieces.length
            );
            var randomPiece = availablePieces[randomIndex];
            await pieceMoveSimulation(randomPiece);

            turn = turn === "w" ? "b" : "w";
          }
        }, 5);
        return newInterval;
      });

      SetGamePaused(true);
    } else {
      clearInterval(timeOut);
      SetGamePaused(false);
    }
  }

  return (
    <div className="app-content_wrapper">
      <div className="app-content__top-part">
        <PlayerDashboard pieces={pieces} playerLetter="A" playerColor="w" />
        <div>
          <ChessTable pieces={pieces} />
        </div>
        <PlayerDashboard pieces={pieces} playerLetter="B" playerColor="b" />
        {/* <button onClick={showPieces}>Show Pieces</button> */}
      </div>
      <div className="app-content__game-over">
        <h1 style={{ display: isGameOver ? "block" : "none" }}>Game Over</h1>
      </div>
      <div className="app-content__middle-part">
        <Button
          variant="contained"
          color="primary"
          onClick={randomInitialization}
        >
          New Simulation
        </Button>
        <Button variant="contained" color="primary" onClick={gameSimulation}>
          Start
        </Button>
        <Button variant="contained" color="primary" onClick={gameSimulation}>
          Pause
        </Button>
      </div>
      <div className="app-content__table-part">
        <StateHistory
          pieces={pieces}
          piecesUpdated={isStateUpdated}
          piecesSetStateUpdated={SetIsStateUpdated}
          newSimulation={newSimulation}
          SetNewSimulation={SetNewSimulation}
        />
      </div>
    </div>
  );
}

export default App;
