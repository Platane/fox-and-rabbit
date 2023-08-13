import { games } from "./games";
import { solve } from "./solver";
import { animateInTerm, boardToString } from "./tty";

(async () => {
  const { board, state } = games[1];

  const steps = solve(board, state);

  console.log(boardToString(board, state));

  // for (const s of steps ?? []) console.log(boardToString(board, s));

  if (steps) {
    console.log("solution in ", steps.length - 1, "steps");

    await new Promise((r) => setTimeout(r, 800));

    animateInTerm(board, steps, 400);
  } else console.log("could not found any solution");
})();
