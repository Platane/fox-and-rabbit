import { games } from "./games";
import { solve } from "./solver";
import { animateInTerm } from "./tty2";

(async () => {
  const { board, state } = games[1];

  const steps = solve(board, state);

  if (steps) {
    console.log("solution in ", steps.length - 1, "steps");

    await new Promise((r) => setTimeout(r, 800));

    animateInTerm(board, steps, 600);
  } else console.log("could not found any solution");
})();
