if(typeof require != 'undefined') {
    Pentomino = require('./pentomino.js');
    Board = require('./board.js');
    Game = require('./game.js');
}

class HintAI {

    getHint(game) {
        let solutions = this.getMockSolutions();
        let closestSolution = this.getClosesSolution(game, solutions);
        return this.getNextCommandToSolution(game, closestSolution);
    }

    // --- --- --- Closest Solution --- --- ---
    /**
     *  Priority:
     *  - Perfect pentominoes on the board (Correct position, correct angle, correct mirroring)
     *  - Pentominoes that need one operation to be perfect
     *  - Pentominoes that need two operations to be perfect
     *  - etc.
     * @param game
     * @param solutions
     * @returns {*}
     */
    getClosesSolution(game, solutions) {
        // FIXME
        return solutions[0];
    }

    // --- --- --- Pursue Closest Solution --- --- ---
    /**
     * Returns the next command that, when executed, brings the game closer to the solution.
     * @param game
     * @param solution
     * @returns {null}
     */
    getNextCommandToSolution(game, solution) {
        let command = null;

        if (game.getPentominoes().length === 0) {
            throw new Error("game is empty");
        }

        game.getPentominoes().some(pentomino =>  {
            if (!this.isPerfectPentomino(game, solution, pentomino, solution.getPentominoByName(pentomino.name))) {
                command = this.getNextCommandOfPentominoToSolution(game, solution, pentomino);
                return true;
            }
            return false;
        });
        return command;
    }

    /**
     * Returns a command of a specific pentomino, that brings the game closer to the solution
     * @param game
     * @param solution
     * @param gamePentomino
     * @param solutionPentomino
     */
    getNextCommandOfPentominoToSolution(game, solution, gamePentomino, solutionPentomino) {
        if (game.isPlacedOnBoard(gamePentomino)) {
            if (solution.isPlacedOnBoard(solutionPentomino)) {
                // problem lies inside board
                return this.getNextCommandOfPentominoOnBoardToSolution(game, solution, gamePentomino, solutionPentomino);
            } else {
                // place should be outside board
                let gamePentominoPos = game.getPositionOfPentomino(gamePentomino);
                // FIXME - add to tray
                return new RemoveCommand(game, gamePentomino, gamePentominoPos[0], gamePentominoPos[1]);
            }
        } else {
            if (solution.isPlacedOnBoard(solutionPentomino)) {
                // pentomino should be on board
                let solutionPentominoPosition = solutionPentomino.getPositionOfPentomino(solutionPentomino);
                return new PlaceCommand(game, gamePentomino, solutionPentominoPosition[0], solutionPentominoPosition[1]);
            } else {
                // perfect pentomino
                throw Error("Pentomino " + gamePentomino.name + " is already placed correct.");
            }
        }
    }

    getNextCommandOfPentominoOnBoardToSolution(game, solution, gamePentomino, solutionPentomino) {
        // TODO
    }

    /**
     * Assumes that pentomino is placed on the board
     * @param game
     * @param solution
     * @param gamePentomino
     * @param solutionPentomino
     */
    isPerfectPentomino(game, solution, gamePentomino, solutionPentomino) {
        if (!game.isPlacedOnBoard(gamePentomino))
            return !solution.isPlacedOnBoard(solutionPentomino);
        else if (solution.isPlacedOnBoard(solutionPentomino)) {
            let gamePentominoPosition = game.getPositionOfPentomino(gamePentomino);
            let solutionPentominoPosition = solution.getPositionOfPentomino(solutionPentomino);
            return gamePentominoPosition[0] === solutionPentominoPosition[0]
                && gamePentominoPosition[1] === solutionPentominoPosition[1]
                && gamePentomino.sRepr.localeCompare(solutionPentomino.sRepr) === 0;
        } else {
            return false;
        }
    }

    getMockSolutions() {
        let solutions = [];

        let X = new Pentomino('X');
        let T = new Pentomino('T');
        let L = new Pentomino('L');
        let U = new Pentomino('U');
        let N = new Pentomino('N');
        let F = new Pentomino('F');
        let I = new Pentomino('I');
        let P = new Pentomino('P');
        let Z = new Pentomino('Z');
        let V = new Pentomino('V');
        let W = new Pentomino('W');
        let Y = new Pentomino('Y');

        let game1 = new Game(new Board([0, 0], [5, 7]));

        game1.placePentomino(L, 3, 0);

        game1.placePentomino(F, 1, 1);
        game1.mirrorPentominoV(F);

        game1.placePentomino(I, 0, 4);
        game1.rotatePentominoClkWise(I);

        game1.placePentomino(N, 1, 3);
        game1.rotatePentominoClkWise(N);
        game1.mirrorPentominoH(N);

        game1.placePentomino(P, 4, 2);
        game1.rotatePentominoClkWise(P);

        game1.placePentomino(U, 3, 4);
        game1.rotatePentominoClkWise(U);

        game1.placePentomino(Y, 3, 5);
        game1.rotatePentominoAntiClkWise(Y);
        game1.mirrorPentominoH(Y);

        game1.display();

        let X2 = new Pentomino('X');
        let T2 = new Pentomino('T');
        let L2 = new Pentomino('L');
        let U2 = new Pentomino('U');
        let N2 = new Pentomino('N');
        let F2 = new Pentomino('F');
        let I2 = new Pentomino('I');
        let P2 = new Pentomino('P');
        let Z2 = new Pentomino('Z');
        let V2 = new Pentomino('V');
        let W2 = new Pentomino('W');
        let Y2 = new Pentomino('Y');

        let game2 = new Game(new Board([0, 0], [5, 7]));

        game2.placePentomino(L2, 3, 0);

        game2.placePentomino(I2, 0, 4);
        game2.rotatePentominoClkWise(I2);

        game2.placePentomino(F2, 1, 1);
        game2.mirrorPentominoV(F2);

        game2.placePentomino(P2, 1, 4);
        game2.rotatePentominoAntiClkWise(P2);

        game2.placePentomino(X2, 3, 2);

        game2.placePentomino(U2, 2, 6);
        game2.rotatePentominoAntiClkWise(U2);

        game2.placePentomino(Y2, 3, 4);
        game2.mirrorPentominoV(Y2);

        game2.display();

        solutions.push(game1);
        solutions.push(game2);
        return solutions;
    }
}

if(typeof module != 'undefined') {
    module.exports = HintAI;
}
