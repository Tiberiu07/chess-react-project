import React from "react";

function Tile(props) {
  //If sum of indexes even -> render the white tile
  //If sum of indexes odd -> render the black tile
  //If image property passed is null -> do not show the image
  if (props.indexesSum % 2 === 0 && props.img !== null) {
    return (
      <div id={props.id} className="chessSquare chessSquare__white">
        <img src={props.img} alt="chess piece" />
      </div>
    );
  } else if (props.indexesSum % 2 !== 0 && props.img !== null) {
    return (
      <div id={props.id} className="chessSquare chessSquare__black">
        <img src={props.img} alt="chess piece" />
      </div>
    );
  } else if (props.indexesSum % 2 === 0) {
    return <div id={props.id} className="chessSquare chessSquare__white"></div>;
  } else {
    return <div id={props.id} className="chessSquare chessSquare__black"></div>;
  }
}

export default Tile;
