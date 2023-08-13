import { Board, N, State, isHole } from "./type";

export const boardToString = (b: Board, s: State) => {
  let buffer = "";

  for (let y = 0; y < N; y++) {
    ex: for (let x = 0; x < N; x++) {
      for (let i = b.n_rabbit; i--; ) {
        const { x: rx, y: ry } = s.rabbits[i];

        if (x === rx && y == ry) {
          buffer += (i === 0 && "🐰") || (i === 1 && "🐹") || (i === 2 && "🐨");
          continue ex;
        }
      }

      if (b.mushrooms.some((m) => m.x === x && m.y == y)) {
        buffer += "🍄";
        continue ex;
      }

      for (let i = b.foxes_direction.length; i--; ) {
        const { x: hx, y: hy } = s.fox_heads[i];

        if (x === hx && y == hy) {
          buffer += "🦊";
          continue ex;
        }

        if (
          (b.foxes_direction[i] && x === hx - 1 && y == hy) ||
          (!b.foxes_direction[i] && x === hx && y == hy - 1)
        ) {
          buffer += "🟧";
          continue ex;
        }
      }

      if (isHole(x, y)) {
        buffer += "🟤";
        continue ex;
      }

      // buffer += "⠀";
      buffer += "⬜️";
    }
    buffer += "\n";
  }

  return buffer;
};

export const animateInTerm = async (
  board: Board,
  states: State[],
  frameDuration = 800
) => {
  const { length } = boardToString(board, states[0]);

  for (let i = length; i--; ) {
    await new Promise<void>((r) => process.stdout.cursorTo(0, i, () => r()));
    process.stdout.clearLine(0);
  }

  for (const s of states) {
    const lines = boardToString(board, s).split("\n");

    for (let y = 0; y < lines.length; y++) {
      await new Promise<void>((r) => process.stdout.cursorTo(0, y, () => r()));
      process.stdout.write(lines[y]);
    }

    await new Promise<void>((r) => setTimeout(r, frameDuration));
  }
};
