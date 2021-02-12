class PD {

    constructor() {
        /**
         * Front-end interface always call FrontController instead of GameController.
         */
        var fController = new FrontController();
        this.gameController = fController.controller;
        this.loadBoard("board_6x10");

        this.visual = new Visual(this);
        this.reset();
    }

    rotateClkWise(){
        this.visual.rotateClkWise();
        this.visual.showNumberOfPossibleSolutions();
    }

    rotateAntiClkWise() {
        this.visual.rotateAntiClkWise();
        this.visual.showNumberOfPossibleSolutions();
    }

    flipH(){
        this.visual.flipH();
        this.visual.showNumberOfPossibleSolutions();
    }

    flipV(){
        this.visual.flipV();
        this.visual.showNumberOfPossibleSolutions();
    }

    reset(){
       this.gameController.resetGame();
       this.visual.clear();
       this.visual.showNumberOfPossibleSolutions();
    }

    loadBoard(board){
        let gameObject = GameLoader.getGameObject(board);
        this.allSolutions = GameLoader.getGamesFromSolutionsConfig(board);
        this.boardSize = gameObject.boardSize;
        this.boardShape = gameObject.boardShape;
        this.gameHeight = gameObject.gameHeight;
        this.gameWidth = gameObject.gameWidth;
        this.blockedCells = gameObject.blockedCells;

        this.boardStartX = Math.floor((this.gameHeight - this.boardSize[0]) / 2);
        this.boardStartY = Math.floor((this.gameWidth - this.boardSize[1]) / 2);
        this.gameController.createGame(
                                    [this.boardStartX, this.boardStartY],
                                    this.boardSize,
                                    this.boardShape);

        this.visual = new Visual(this);
        this.visual.showNumberOfPossibleSolutions();
    }

    hints(){
       return this.gameController.getHint();
    }

     callHintAI(){
        this.visual.callHintAI();
    }
}



// this.ui.load();
// document.getElementById("btnBoardSelect").onclick = () => { this.loadBoard('board_6x10'); }; -->