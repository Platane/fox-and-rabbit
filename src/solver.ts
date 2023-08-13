import { Board, State, around4, isHole, isInside } from "./type";

export const getNextStates = (b: Board, s: State) => {
  const nexts: State[] = [];

  const freeCell = (x: number, y: number) => {
    if (b.mushrooms.some((m) => m.x === x && m.y === y)) return false;

    for (let i = b.n_rabbit; i--; ) {
      const { x: rx, y: ry } = s.rabbits[i];

      if (rx === x && ry === y) return false;
    }

    for (let i = b.n_fox; i--; ) {
      const { x: hx, y: hy } = s.fox_heads[i];
      const fox_direction = b.foxes_direction[i];

      if (
        (hx === x && hy === y) ||
        (fox_direction && hx - 1 === x && hy === y) ||
        (!fox_direction && hx === x && hy - 1 === y)
      )
        return false;
    }

    return true;
  };

  // move foxes
  for (let i = b.n_fox; i--; ) {
    const { x: hx, y: hy } = s.fox_heads[i];
    const fox_direction = b.foxes_direction[i];

    s.fox_heads[i].x = 9999;

    if (fox_direction) {
      if (isInside(hx + 1, hy) && freeCell(hx + 1, hy))
        nexts.push({
          ...s,
          fox_heads: s.fox_heads.map((r, j) =>
            i === j ? { x: hx + 1, y: hy } : r
          ),
        });

      if (isInside(hx - 2, hy) && freeCell(hx - 2, hy))
        nexts.push({
          ...s,
          fox_heads: s.fox_heads.map((r, j) =>
            i === j ? { x: hx - 1, y: hy } : r
          ),
        });
    } else {
      if (isInside(hx, hy + 1) && freeCell(hx, hy + 1))
        nexts.push({
          ...s,
          fox_heads: s.fox_heads.map((r, j) =>
            i === j ? { x: hx, y: hy + 1 } : r
          ),
        });

      if (isInside(hx, hy - 2) && freeCell(hx, hy - 2))
        nexts.push({
          ...s,
          fox_heads: s.fox_heads.map((r, j) =>
            i === j ? { x: hx, y: hy - 1 } : r
          ),
        });
    }

    s.fox_heads[i].x = hx;
  }

  // move rabbits
  for (let i = b.n_rabbit; i--; ) {
    const { x: rx, y: ry } = s.rabbits[i];

    for (const a of around4) {
      let k = 1;

      while (true) {
        let jx = rx + a.x * k;
        let jy = ry + a.y * k;

        if (!isInside(jx, jy)) break;

        if (freeCell(jx, jy)) {
          if (k > 1) {
            nexts.push({
              ...s,
              rabbits: s.rabbits.map((r, j) =>
                i === j ? { x: jx, y: jy } : r
              ),
            });
          }
          break;
        }

        k++;
      }
    }
  }

  return nexts;
};

const getStateHash = (s: State) =>
  s.rabbits.map(({ x, y }) => x + "" + y).join("") +
  s.fox_heads.map(({ x, y }) => x + "" + y).join("");

const isFinish = (board: Board, state: State) => {
  for (let i = board.n_rabbit; i--; ) {
    const { x: rx, y: ry } = state.rabbits[i];
    if (!isHole(rx, ry)) return false;
  }

  return true;
};

export const solve = (board: Board, state0: State) => {
  const closeList = new Set<string>();
  const openList: { state: State; parent: any | null }[] = [
    { state: state0, parent: null },
  ];
  closeList.add(getStateHash(state0));

  while (openList.length) {
    const o = openList.shift()!;
    const { state } = o;

    for (const s of getNextStates(board, state)) {
      const hash = getStateHash(s);
      if (!closeList.has(hash)) {
        if (isFinish(board, s)) {
          const l = [s];
          let p = o;
          while (p) {
            l.unshift(p.state);
            p = p.parent;
          }
          return l;
        }

        openList.push({ state: s, parent: o });
        closeList.add(hash);
      }
    }
  }
};
