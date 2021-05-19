import { Switch } from "@material-ui/core";
import React from "react";
import shortid from "shortid";

function PlayerDashboard(props) {
  return (
    <div className="player-dashboard__wrapper">
      <h1>Player {props.playerLetter}</h1>
      <div className="images__wrapper">
        {props.pieces.map(function (piece) {
          //If color not okay, skip piece
          if (piece.pieceName.split("_")[1] !== props.playerColor) {
            //Skip this element
          } else {
            var pieceName = piece.pieceName.split("_")[0];
            var imgSource =
              "assets/images/" + pieceName + "_" + props.playerColor + ".png";
            //Check if element defined or not
            if (piece.horizontalPosition === "z") {
              imgSource = "assets/images/close.png";
            }
            return (
              <img key={shortid.generate()} src={imgSource} alt="board piece" />
            );
          }
        })}
      </div>
    </div>
  );
}

export default PlayerDashboard;
