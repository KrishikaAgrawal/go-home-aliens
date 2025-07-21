import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { getCanvasPosition } from "./utils/formulas";
import { moveObjects } from "./features/game/gameSlice";
import Canvas from "./components/Canvas";

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

  return <Canvas angle={angle} trackMouse={trackMouse} />;
};

App.propTypes = {
  angle: PropTypes.number,
};

export default App;
