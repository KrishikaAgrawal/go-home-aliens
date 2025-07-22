import { createSlice } from "@reduxjs/toolkit";
import { calculateAngle } from "../../utils/formulas";
import createFlyingObjects from "./createFlyingObjects";

const initialState = {
  angle: 45,
  gameState: {
    started: false,
    kills: 0,
    lives: 3,
    flyingObjects: [],
    lastObjectCreatedAt: Date.now(),
  },
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    moveObjects: (state, action) => {
      // const { x, y } = action.payload || {};
      // if (x === undefined || y === undefined) return;
      // state.angle = calculateAngle(0, 0, x, y);
      const mousePosition = action.payload || { x: 0, y: 0 };
      const newState = createFlyingObjects(state);
      const now = new Date().getTime();
      const flyingObjects = newState.gameState.flyingObjects.filter(
        (object) => now - object.createdAt < 4000
      );

      const { x, y } = mousePosition;
      const angle = calculateAngle(0, 0, x, y);
      return {
        ...newState,
        gameState: {
          ...newState.gameState,
          flyingObjects,
        },
        angle,
      };
    },
    startGame: (state) => {
      state.gameState.started = true;
      state.gameState.kills = 0;
      state.gameState.lives = 3;
    },
    updateGameState: (state, action) => {
      const newState = action.payload;
      state.flyingObjects = newState.flyingObjects;
      state.lastObjectCreatedAt = newState.lastObjectCreatedAt;
    },
  },
});

export const { moveObjects, startGame, updateGameState } = gameSlice.actions;
export default gameSlice.reducer;
