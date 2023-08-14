import { Board, N, State, isHole } from "./type";

const boardToGrid = (board: Board, stateA: State, stateB: State, t: number) => {
  const EMPTY = "ㅤ";

  const grid = Array.from({ length: N * 3 }, () =>
    Array.from({ length: N * 3 }, () => EMPTY)
  );

  for (let x = N; x--; )
    for (let y = N; y--; )
      grid[y * 3 + 1][x * 3 + 1] = isHole(x, y) ? "🟤" : "🔹";

  for (const { x, y } of board.mushrooms) {
    grid[y * 3 + 1][x * 3 + 1] = "🍄";
  }

  for (let i = board.n_fox; i--; ) {
    const pA = stateA.fox_heads[i];
    const pB = stateB.fox_heads[i];
    const dir = board.foxes_direction[i];

    const l = (Math.abs(pA.x - pB.x) + Math.abs(pA.y - pB.y)) * 3;

    const k = Math.floor(t * l);

    const u = l === 0 ? 0 : k / l;

    const ex = Math.round(u * (pB.x * 3) + (1 - u) * (pA.x * 3));
    const ey = Math.round(u * (pB.y * 3) + (1 - u) * (pA.y * 3));

    grid[ey + 1][ex + 1] = "🦊";

    if (dir) {
      grid[ey + 1][ex + 1 - 1] = "🟧";
      grid[ey + 1][ex + 1 - 2] = "🟧";
      grid[ey + 1][ex + 1 - 3] = "🟧";
    } else {
      grid[ey + 1 - 1][ex + 1] = "🟧";
      grid[ey + 1 - 2][ex + 1] = "🟧";
      grid[ey + 1 - 3][ex + 1] = "🟧";
    }
  }

  for (let i = board.n_rabbit; i--; ) {
    const emoji =
      (i === 0 && "🐰") || (i === 1 && "🐹") || (i === 2 && "🐨") || "";

    const pA = stateA.rabbits[i];
    const pB = stateB.rabbits[i];

    const l = (Math.abs(pA.x - pB.x) + Math.abs(pA.y - pB.y)) * 3;

    const k = Math.floor(t * l);

    if (k === 0) {
      grid[pA.y * 3 + 1][pA.x * 3 + 1] = emoji;
    } else if (k === l) {
      grid[pB.y * 3 + 1][pB.x * 3 + 1] = emoji;
    } else {
      const u = k / l;

      const uy = Math.abs(pA.x - pB.x) !== 0 ? -1 : 0;
      const ux = Math.abs(pA.y - pB.y) !== 0 ? -1 : 0;

      const ex = Math.round(u * (pB.x * 3) + (1 - u) * (pA.x * 3)) + ux;
      const ey = Math.round(u * (pB.y * 3) + (1 - u) * (pA.y * 3)) + uy;

      grid[ey + 1][ex + 1] = emoji;
    }
  }

  return grid;
};

/**
 * draw the board as emoji,
 * clear and redraw lines to animate it
 */
export const animateInTerm = async (
  board: Board,
  states: State[],
  frameDuration = 800
) => {
  const { length } = boardToGrid(board, states[0], states[0], 0);

  for (let i = length; i--; ) {
    await new Promise<void>((r) => process.stdout.cursorTo(0, i, () => r()));
    process.stdout.clearLine(0);
  }

  for (let i = 0; i < states.length; i++) {
    const stateA = states[Math.max(0, i - 1)];
    const stateB = states[i];

    const N = 24;
    for (let k = N; k--; ) {
      const lines = boardToGrid(board, stateA, stateB, 1 - k / N);

      for (let y = 0; y < lines.length; y++) {
        await new Promise<void>((r) =>
          process.stdout.cursorTo(0, y, () => r())
        );
        process.stdout.write(lines[y].join(""));
      }

      await wait((frameDuration * 0.4) / N);
    }

    await wait(frameDuration * 0.6);
  }
};

const wait = (delay = 100) => new Promise<void>((r) => setTimeout(r, delay));
