import React from "react";

function PlayerDashboard(props) {
  const assets = ["bishop", "knight", "queen"];
  return (
    <div className="player-dashboard__wrapper">
      <h1>Player {props.playerLetter}</h1>
      <div>
        {assets.map(function (element) {
          var imgSource =
            "assets/images/" + element + "_" + props.playerColor + ".png";
          return <img key={imgSource} src={imgSource} alt="board piece" />;
        })}
      </div>
    </div>
  );
}

export default PlayerDashboard;
