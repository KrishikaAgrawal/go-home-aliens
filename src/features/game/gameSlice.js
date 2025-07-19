import { createSlice } from "@reduxjs/toolkit";
import { calculateAngle } from "../../utils/formulas";

const initialState = {
  angle: 45,
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
  },
});

export const { moveObjects } = gameSlice.actions;
export default gameSlice.reducer;
