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

const Canvas = ({ angle, trackMouse }) => {
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

  return (
    <svg
      id="aliens-go-home-canvas"
      preserveAspectRatio="xMaxYMax none"
      viewBox={viewBox}
      onMouseMove={trackMouse}
    >
      <defs>
        <filter id="shadow">
          <feDropShadow dx="1" dy="1" stdDeviation="2" />
        </filter>
      </defs>
      <Sky />
      <Ground />
      <CannonPipe rotation={angle} />
      <CannonBase />
      <CannonBall position={{ x: 0, y: -100 }} />
      <CurrentScore score={10} />
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
      <Heart position={{ x: -300, y: 35 }} />
      {/* <StartGame onClick={() => console.log("Aliens, Go Home!")} />
      <Title /> */}
    </svg>
  );
};

Canvas.propTypes = {
  angle: PropTypes.number.isRequired,
  trackMouse: PropTypes.func.isRequired,
};

export default Canvas;
