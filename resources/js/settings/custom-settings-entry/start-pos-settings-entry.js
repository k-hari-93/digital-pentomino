class StartPosSettingsEntry extends CustomSettingsEntry {
    constructor() {
        super("boardCustomization", "initialPiecePos");
    }

    create(settingsEntry) {
        let div = document.createElement("div");
        div.id = this._name;
        div.name = this._name;

        let saveButton = SettingsForm.createButton("Use current positions", {});
        saveButton.onclick = (event) => this.handleClickedOnSave(event, div);
        div.appendChild(saveButton);
        div.appendChild(document.createElement("br"));
        let clearButton = SettingsForm.createButton("Clear", {});
        clearButton.onclick = (event) => this.handleClickedOnClear(event, div);
        div.appendChild(clearButton);
        div.appendChild(document.createElement("br"));
        div.appendChild(SettingsForm.createLabel("Start positions: "));
        let resultLabel = SettingsForm.createLabel("None saved");
        resultLabel.id = "startPiecePosLabel";
        resultLabel.name = "startPiecePosLabel";
        div.appendChild(resultLabel);
        div.appendChild(document.createElement("br"));

        return div;
    }

    handleClickedOnSave(event, div) {
        console.log("save");
    }

    handleClickedOnClear(event, div) {
        console.log("clear");
    }

    collect(formElement) {
        return undefined;
    }

    update(heading, subheading, schemaEntry, selectedValue, formElement) {
        // TODO
    }

    parseSettingsToSeed(schemaEntry, settingsValue) {
        // TODO
    }

    parseFromSeed(schemaEntry, remainingSeed, settingsEntry, key, seed) {
        // TODO
    }
}