import React from "react";
import { useSelector } from "react-redux";

const Game = () => {
  const message = useSelector((state) => state.game.message);

  return (
    <div>
      <h1>{message}</h1>
    </div>
  );
};

export default Game;
