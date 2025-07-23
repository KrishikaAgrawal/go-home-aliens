import { createSlice } from "@reduxjs/toolkit";
import { calculateAngle } from "../../utils/formulas";
import createFlyingObjects from "./createFlyingObjects";
import moveBalls from "./moveCannonBalls";
import checkCollisions from "./checkCollisions";

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
      if (!state.gameState.started) return state;
      const mousePosition = action.payload || { x: 0, y: 0 };
      const newState = createFlyingObjects(state);

      const now = new Date().getTime();

      // Move cannonballs
      let cannonBalls = moveBalls(state.gameState.cannonBalls);

      // Filter out flying objects that have existed longer than 4 seconds
      let flyingObjects = newState.gameState.flyingObjects.filter(
        (object) => now - object.createdAt < 4000
      );

      // 🔻 Detect life loss
      const lostLife =
        state.gameState.flyingObjects.length > flyingObjects.length;
      let lives = state.gameState.lives;
      if (lostLife) {
        lives--;
      }

      // 🔻 Game over check
      let started = lives > 0;
      if (!started) {
        flyingObjects = [];
        cannonBalls = [];
        lives = 3;
      }

      const { x, y } = mousePosition;
      const angle = calculateAngle(0, 0, x, y);

      // 🔻 Detect collisions
      const objectsDestroyed = checkCollisions(cannonBalls, flyingObjects);
      const cannonBallsDestroyed = objectsDestroyed.map(
        (obj) => obj.cannonBallId
      );
      const flyingDiscsDestroyed = objectsDestroyed.map(
        (obj) => obj.flyingDiscId
      );

      // 🔻 Remove destroyed cannonballs and discs
      cannonBalls = cannonBalls.filter(
        (ball) => !cannonBallsDestroyed.includes(ball.id)
      );
      flyingObjects = flyingObjects.filter(
        (disc) => !flyingDiscsDestroyed.includes(disc.id)
      );

      // 🔻 Update kills
      const kills = state.gameState.kills + flyingDiscsDestroyed.length;

      return {
        ...newState,
        gameState: {
          ...newState.gameState,
          flyingObjects,
          cannonBalls,
          lives,
          started,
          kills,
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
