export type Board = {
  n_rabbit: number;
  n_fox: number;
  foxes_direction: boolean[];
  mushrooms: { x: number; y: number }[];
};

export type State = {
  rabbits: { x: number; y: number }[];
  fox_heads: { x: number; y: number }[];
};

export const around4 = [
  { x: 0, y: 1 },
  { x: 0, y: -1 },
  { x: 1, y: 0 },
  { x: -1, y: 0 },
] as const;

export const N = 5;

export const isInside = (x: number, y: number) =>
  x >= 0 && y >= 0 && x < N && y < N;

export const isHole = (x: number, y: number) =>
  (x === 0 && y === 0) ||
  (x === 0 && y === N - 1) ||
  (x === N - 1 && y === N - 1) ||
  (x === N - 1 && y === 0) ||
  (x === (N - 1) / 2 && y === (N - 1) / 2);
