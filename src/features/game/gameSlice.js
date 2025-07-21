import { createSlice } from "@reduxjs/toolkit";
import { calculateAngle } from "../../utils/formulas";

const initialState = {
  angle: 45,
  gameState: {
    started: false,
    kills: 0,
    lives: 3,
  },
  flyingObjects: [],
  lastObjectCreatedAt: new Date(),
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    moveObjects: (state, action) => {
      const { x, y } = action.payload || {};
      if (x === undefined || y === undefined) return;
      state.angle = calculateAngle(0, 0, x, y);
    },
    startGame: (state) => {
      state.gameState.started = true;
      state.gameState.kills = 0;
      state.gameState.lives = 3;
    },
  },
});

export const { moveObjects, startGame } = gameSlice.actions;
export default gameSlice.reducer;
