const BOARD_NAME_DECIMALS_MIN = 3;
const BOARD_PENTOMINO_NUM_DECIMALS = 2;
const BOARD_POSITION_DECIMALS = 2;

class StartPosSettingsEntry extends CustomSettingsEntry {
    constructor(heading, subheading) {
        super(heading, subheading);
    }

    create(settingsEntry) {
        let div = document.createElement("div");
        div.id = this._name;
        div.name = this._name;

        let saveButton = SettingsForm.createButton("Save current board", {});
        saveButton.onclick = (event) => this.handleClickedOnSave(event, div);
        div.appendChild(saveButton);
        div.appendChild(document.createElement("br"));
        let clearButton = SettingsForm.createButton("Discard saved board", {});
        clearButton.onclick = (event) => this.handleClickedOnClear(event, div);
        div.appendChild(clearButton);
        div.appendChild(document.createElement("br"));
        let boardImg = SettingsForm.createImg("boardImg", undefined, {alt: "none"});
        boardImg.style.width = '30vw';
        div.appendChild(boardImg);
        div.appendChild(SettingsForm.createLabel("Saved board: "));
        let boardLabel = SettingsForm.createLabel("-");
        boardLabel.id = "boardLabel";
        boardLabel.name = "boardLabel";
        div.appendChild(boardLabel);

        let resultLabel = SettingsForm.createLabel("");
        resultLabel.style.display = 'none';
        resultLabel.id = "startPiecePosLabel";
        resultLabel.name = "startPiecePosLabel";
        div.appendChild(resultLabel);
        div.appendChild(document.createElement("br"));

        return div;
    }

    handleClickedOnSave(event, div) {
        let resultLabel = $(div).find("#startPiecePosLabel")[0];

        let game = new FrontController().controller.game();
        let seed = this.parseFromGameToSeed(game);
        resultLabel.innerHTML = seed;

        this.display(div, seed);
    }

    handleClickedOnClear(event, div) {
        let selectedValue = SettingsSchemaSingleton.getInstance().getSettingsSchema().boardCustomization.initialPiecePos.default;

        let resultLabel = $(div).find("#startPiecePosLabel")[0];
        resultLabel.innerHTML = selectedValue;

        let boardImg = $(div).find("#boardImg")[0];
        boardImg.src = undefined;
        boardImg.alt = "none";

        this.display(div, selectedValue);
    }

    collect(formElement) {
        let div = $(formElement).find("#" + this._name)[0];
        let resultLabel = $(div).find("#startPiecePosLabel")[0];
        return resultLabel.textContent;
    }

    update(heading, subheading, schemaEntry, selectedValue, formElement) {
        let div = $(formElement).find("#" + this._name)[0];
        let resultLabel = $(div).find("#startPiecePosLabel")[0];
        resultLabel.textContent = selectedValue;

        this.display(div, selectedValue);
    }

    display(div, selectedValue) {
        let boardLabel = $(div).find("#boardLabel")[0];
        let boardImg = $(div).find("#boardImg")[0];

        let boardSRows= new FrontController().controller.game().getBoard()._boardSRows;
        let boardSCols = new FrontController().controller.game().getBoard()._boardSCols;

        let game = this.parseFromSeedToGame(selectedValue);

        boardImg.src = "resources/images/boards/" + game.getName() + ".png";
        boardImg.alt = game.getName();

        let text = game.getName() + " ";

        game.getPentominoesOnBoard().forEach(p => {
            let pos = game.getPosition(p);
            text += p.name + "[" + (pos[0] + boardSRows) + "," + (pos[1] + boardSCols) + "] ";
        });

        boardLabel.innerHTML = text;
    }

    parseSettingsToSeed(schemaEntry, settingsValue) {
        return settingsValue;
    }

    parseFromSeed(schemaEntry, remainingSeed, settingsEntry, key, seed) {
        let n = parseInt(remainingSeed.substr(StartPosSettingsEntry.getBoardNameDecimals(), BOARD_PENTOMINO_NUM_DECIMALS));
        let seedEntryLength = StartPosSettingsEntry.getBoardNameDecimals() + BOARD_PENTOMINO_NUM_DECIMALS + n * 6;
        settingsEntry[key] = remainingSeed.substr(0, seedEntryLength);
        return seedEntryLength - 1;
    }

    processChangesToSettings(settingsValue, pd) {
        let game = this.parseFromSeedToGame(settingsValue);

        pd.loadBoard(game.getName());

        if (SettingsSingleton.getInstance().getSettings().boardCustomization.includePiecePos) {
            let boardSRows = new FrontController().controller.game().getBoard()._boardSRows;
            let boardSCols = new FrontController().controller.game().getBoard()._boardSCols;

            game.getPentominoesOnBoard().forEach(p => {
                let pos = game.getPosition(p);
                this.placePiece(p.name, pos[0] + boardSRows, pos[1] + boardSCols);

                let numRotationsMirrors = Pentomino.getNumOfRotationsMirrors(new Pentomino(p.name), p, 0, 0);
                for (let i = numRotationsMirrors[0]; i > 0; i--) this.rotatePieceClkwise(p);
                for (let i = numRotationsMirrors[1]; i > 0; i--) this.mirrorPieceH(p);
            });

            pd.visual.renderPieces();
        }
    }

    placePiece(pieceName, row, col) {
        let piece = pd.visual.pieces.filter(p => p.name === pieceName)[0];
        piece.updateTrayValue(0);
        pd.gameController.placePentomino(piece, row, col);
    }

    rotatePieceClkwise(pieceName) {
        let piece = pd.visual.pieces.filter(p => p.name === pieceName)[0];
        pd.gameController.rotatePentominoClkWise(piece);
    }

    mirrorPieceH(pieceName) {
        let piece = pd.visual.pieces.filter(p => p.name === pieceName)[0];
        pd.gameController.mirrorPentominoH(piece);
    }

    // === === === PARSE HELPER === === ===
    parseFromSeedToGame(seed) {
        let boardNameDecimals = StartPosSettingsEntry.getBoardNameDecimals();
        let boardName = StartPosSettingsEntry.parseIndexToBoardName(parseInt(seed.substr(0, boardNameDecimals)));

        let game = new Game(new Board([0, 0], [100, 100]), boardName);

        let n = parseInt(seed.substr(boardNameDecimals, BOARD_PENTOMINO_NUM_DECIMALS));

        for (let i = 0; i < n; i++) {
            let offset = boardNameDecimals + BOARD_PENTOMINO_NUM_DECIMALS;
            let name = seed.substr(i * 6 + offset, 1);
            let row = parseInt(seed.substr(i * 6 + offset + 1, BOARD_POSITION_DECIMALS));
            let col = parseInt(seed.substr(i * 6 + offset + 3, BOARD_POSITION_DECIMALS));
            let numRotMirCompressed = parseInt(seed.substr(i * 6 + offset + 5, 1));
            let numRotMir = [StartPosSettingsEntry.getNumClkwiseRotations(numRotMirCompressed),
                StartPosSettingsEntry.getNumMirrorH(numRotMirCompressed)];
            let pento = new Pentomino(name);
            game.placePentomino(pento, row,col);
            for (let j = numRotMir[0]; j > 0; j--) game.rotatePentominoClkWise(pento);
            for (let j = numRotMir[1]; j > 0; j--) game.mirrorPentominoH(pento);
        }

        return game;
    }

    parseFromGameToSeed(game) {
        let seed = "";

        seed += StartPosSettingsEntry.pad(StartPosSettingsEntry.parseBoardNameToIndex(game.getName()), StartPosSettingsEntry.getBoardNameDecimals());

        let pentominoesOnBoard = game.getPentominoesOnBoard();
        seed += StartPosSettingsEntry.pad(pentominoesOnBoard.length, BOARD_PENTOMINO_NUM_DECIMALS);

        let boardSRows= new FrontController().controller.game().getBoard()._boardSRows;
        let boardSCols = new FrontController().controller.game().getBoard()._boardSCols;

        pentominoesOnBoard.forEach(p => {
            let pos = game.getPosition(p);

            seed += p.name;
            seed += StartPosSettingsEntry.pad(pos[0] - boardSRows, BOARD_POSITION_DECIMALS);
            seed += StartPosSettingsEntry.pad(pos[1] - boardSCols, BOARD_POSITION_DECIMALS);
            let numRotationsMirrors = Pentomino.getNumOfRotationsMirrors(new Pentomino(p.name), p, 0, 0);
            seed += numRotationsMirrors[0] + 4 * numRotationsMirrors[1];
        });

        return seed;
    }

    // from https://stackoverflow.com/questions/2998784/how-to-output-numbers-with-leading-zeros-in-javascript
    static pad(num, minDecimals) {
        num = num.toString();
        while (num.length < minDecimals) num = "0" + num;
        return num;
    }

    static parseBoardNameToIndex(boardName) {
        let allBoardNames = baseConfigs.boards;
        return allBoardNames.findIndex(n => n === boardName);
    }

    static parseIndexToBoardName(index) {
        return baseConfigs.boards[index];
    }

    static getBoardNameDecimals() {
        return Math.max(BOARD_NAME_DECIMALS_MIN, SettingsParser.getNumOfDigits(baseConfigs.boards.length));
    }

    static getNumClkwiseRotations(x) {
        return x % 4;
    }

    static getNumMirrorH(x) {
        return x < 4 ? 0 : 1;
    }
}
