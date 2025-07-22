import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { getCanvasPosition } from "./utils/formulas";
import { moveObjects } from "./features/game/gameSlice";
import Canvas from "./components/Canvas";
import createFlyingObjects from "./features/game/createFlyingObjects";
import { updateGameState } from "./features/game/gameSlice";

const App = () => {
  const dispatch = useDispatch();
  const angle = useSelector((state) => state.game.angle);
  const canvasMousePosition = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (canvasMousePosition.current) {
        dispatch(moveObjects(canvasMousePosition.current));
      }
    }, 10);
    return () => clearInterval(interval);
  }, [dispatch]);

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch((dispatch, getState) => {
        const newState = createFlyingObjects(getState().game);
        dispatch(updateGameState(newState.gameState)); // new action you'll define
      });
    }, 1000); // every second

    return () => clearInterval(interval);
  }, [dispatch]);

  // ✅ Handle canvas responsiveness
  useEffect(() => {
    const handleResize = () => {
      const cnv = document.getElementById("aliens-go-home-canvas");
      if (cnv) {
        cnv.style.width = `${window.innerWidth}px`;
        cnv.style.height = `${window.innerHeight}px`;
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial call

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const trackMouse = (event) => {
    canvasMousePosition.current = getCanvasPosition(event);
  };

  return <Canvas angle={angle} trackMouse={trackMouse}  />;
};

App.propTypes = {
  angle: PropTypes.number,
};

export default App;
