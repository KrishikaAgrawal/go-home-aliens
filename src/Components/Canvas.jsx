import React from "react";
import PropTypes from "prop-types";
import Sky from "./Sky";
import Ground from "./Ground";
import CannonBase from "./CannonBase";
import CannonPipe from "./CannonPipe";
import CannonBall from "./CannonBall";
import CurrentScore from "./CurrentScore";
import FlyingObject from "./FlyingObject";
import Heart from "./Heart";
import StartGame from "./StartGame";
import Title from "./Title";

import { useSelector } from "react-redux";

const Canvas = ({ angle, trackMouse, onClick, cannonBalls }) => {
  const gameHeight = 1200;
  const viewBox = [
    window.innerWidth / -2,
    100 - gameHeight,
    window.innerWidth,
    gameHeight,
  ];

  const gameStarted = useSelector((state) => state.game.gameState.started);
  const flyingObjects = useSelector(
    (state) => state.game.gameState.flyingObjects
  );
  
  const gameKills = useSelector((state) => state.game.gameState.kills);
  const gameLives = useSelector((state) => state.game.gameState.lives);
  const lives = [];
  for (let i = 0; i < gameLives; i++) {
    const heartPosition = {
      x: -180 - i * 70,
      y: 35,
    };
    lives.push(<Heart key={i} position={heartPosition} />);
  }

  return (
    <svg
      id="aliens-go-home-canvas"
      preserveAspectRatio="xMaxYMax none"
      viewBox={viewBox}
      onMouseMove={trackMouse}
      onClick={onClick}
    >
      <defs>
        <filter id="shadow">
          <feDropShadow dx="1" dy="1" stdDeviation="2" />
        </filter>
      </defs>
      <Sky />
      <Ground />
      {cannonBalls.map((cannonBall) => (
        <CannonBall key={cannonBall.id} position={cannonBall.position} />
      ))}
      <CannonPipe rotation={angle} />
      <CannonBase />
      <CurrentScore score={gameKills} />
      {!gameStarted && (
        <>
          <Title />
          <StartGame />
        </>
      )}
      {gameStarted &&
        flyingObjects.map((obj) => (
          <FlyingObject key={obj.id} position={obj.position} />
        ))}
      {lives}
      
    </svg>
  );
};

Canvas.propTypes = {
  angle: PropTypes.number.isRequired,
  trackMouse: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  cannonBalls: PropTypes.array.isRequired,
};


export default Canvas;
