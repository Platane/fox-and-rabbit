import { Board, State } from "./type";

export const games: { board: Board; state: State }[] = [
  {
    board: {
      foxes_direction: [true],
      n_fox: 1,
      n_rabbit: 3,
      mushrooms: [
        { x: 3, y: 0 },
        { x: 2, y: 2 },
        { x: 0, y: 3 },
      ],
    },
    state: {
      fox_heads: [{ x: 1, y: 1 }],
      rabbits: [
        { x: 3, y: 1 },
        { x: 3, y: 4 },
        { x: 4, y: 2 },
      ],
    },
  },

  {
    board: {
      foxes_direction: [false],
      n_fox: 1,
      n_rabbit: 2,
      mushrooms: [{ x: 2, y: 4 }],
    },
    state: {
      fox_heads: [{ x: 3, y: 2 }],
      rabbits: [
        { x: 4, y: 4 },
        { x: 3, y: 3 },
      ],
    },
  },

  {
    board: {
      foxes_direction: [true],
      n_fox: 0,
      n_rabbit: 3,
      mushrooms: [
        { x: 3, y: 1 },
        { x: 2, y: 0 },
        { x: 1, y: 0 },
      ],
    },
    state: {
      fox_heads: [{ x: 1, y: 3 }],
      rabbits: [
        { x: 0, y: 2 },
        { x: 3, y: 2 },
        { x: 4, y: 2 },
      ],
    },
  },
];
