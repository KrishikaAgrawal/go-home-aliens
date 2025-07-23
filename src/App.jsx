import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { getCanvasPosition } from "./utils/formulas";
import { moveObjects, shoot, updateGameState } from "./features/game/gameSlice";
import Canvas from "./Components/Canvas";
import createFlyingObjects from "./features/game/createFlyingObjects";

const App = () => {
  const dispatch = useDispatch();
  const angle = useSelector((state) => state.game.angle);
  const gameState = useSelector((state) => state.game.gameState);

  const canvasMousePosition = useRef(null);

  const handleShoot = (event) => {
    const position = getCanvasPosition(event);
    dispatch(shoot(position));
  };

  // Game animation loop
  useEffect(() => {
    const interval = setInterval(() => {
      if (canvasMousePosition.current) {
        dispatch(moveObjects(canvasMousePosition.current));
      }
    }, 10);
    return () => clearInterval(interval);
  }, [dispatch]);

  // Spawn flying objects
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch((dispatch, getState) => {
        const newState = createFlyingObjects(getState().game);
        dispatch(updateGameState(newState.gameState));
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [dispatch]);

  // Handle canvas resize
  useEffect(() => {
    const handleResize = () => {
      const cnv = document.getElementById("aliens-go-home-canvas");
      if (cnv) {
        cnv.style.width = `${window.innerWidth}px`;
        cnv.style.height = `${window.innerHeight}px`;
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  
  const trackMouse = (event) => {
    canvasMousePosition.current = getCanvasPosition(event);
  };

  return (
    <Canvas
      angle={angle}
      trackMouse={trackMouse}
      onClick={handleShoot}
      cannonBalls={gameState.cannonBalls} 
    />
  );
};

App.propTypes = {
  angle: PropTypes.number,
};

export default App;
