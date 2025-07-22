import { createSlice } from "@reduxjs/toolkit";
import { calculateAngle } from "../../utils/formulas";
import createFlyingObjects from "./createFlyingObjects";
import moveBalls from "./moveCannonBalls";
import checkCollisions from "./checkCollisions"; // ✅ Add this

const initialState = {
  angle: 45,
  gameState: {
    started: false,
    kills: 0,
    lives: 3,
    flyingObjects: [],
    lastObjectCreatedAt: new Date().getTime(),
    cannonBalls: [],
  },
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    moveObjects: (state, action) => {
      const mousePosition = action.payload || { x: 0, y: 0 };
      const now = Date.now();

      const newState = createFlyingObjects(state);
      let flyingObjects = newState.gameState.flyingObjects.filter(
        (obj) => now - obj.createdAt < 4000
      );

      let cannonBalls = moveBalls(state.gameState.cannonBalls);

      const { x, y } = mousePosition;
      const angle = calculateAngle(0, 0, x, y);

      // ✅ Handle collisions
      const objectsDestroyed = checkCollisions(cannonBalls, flyingObjects);
      const cannonBallsDestroyed = objectsDestroyed.map(
        (obj) => obj.cannonBallId
      );
      const flyingDiscsDestroyed = objectsDestroyed.map(
        (obj) => obj.flyingDiscId
      );

      cannonBalls = cannonBalls.filter(
        (ball) => !cannonBallsDestroyed.includes(ball.id)
      );
      flyingObjects = flyingObjects.filter(
        (disc) => !flyingDiscsDestroyed.includes(disc.id)
      );

      return {
        ...newState,
        angle,
        gameState: {
          ...newState.gameState,
          cannonBalls,
          flyingObjects,
        },
      };
    },

    startGame: (state) => {
      state.gameState.started = true;
      state.gameState.kills = 0;
      state.gameState.lives = 3;
      state.gameState.flyingObjects = [];
      state.gameState.cannonBalls = [];
      state.gameState.lastObjectCreatedAt = Date.now();
    },

    updateGameState: (state, action) => {
      const newState = action.payload;
      state.gameState.flyingObjects = newState.flyingObjects;
      state.gameState.lastObjectCreatedAt = newState.lastObjectCreatedAt;
    },

    shoot: (state, action) => {
      if (!state.gameState.started) return;

      const { cannonBalls } = state.gameState;
      if (cannonBalls.length >= 2) return;

      const { x, y } = action.payload;
      const angle = calculateAngle(0, 0, x, y);
      const id = Date.now();

      const cannonBall = {
        position: { x: 0, y: 0 },
        angle,
        id,
      };

      state.gameState.cannonBalls.push(cannonBall);
    },
  },
});

export const { moveObjects, startGame, updateGameState, shoot } =
  gameSlice.actions;
export default gameSlice.reducer;
