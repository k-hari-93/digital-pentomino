
class CommandNode {
    constructor(command) {
        if (!(command instanceof Command)) {
            throw new Error("Invalid Commands: " + Command);
        }
        this._key = Math.random().toString(36).slice(-10); /* key length: 10 */
        this._command = command;
        this._parent = this;
        this._takeBranch = undefined;
        this._takeBranchLeft = undefined;
        this._takeBranchRight = undefined;
        this._childMap = [];
    }

    AddChild(commandNode) {
        if (!(commandNode instanceof CommandNode)) {
            throw new Error("Invalid CommandNode");
        }
        commandNode._parent = this;
        this._childMap.push(commandNode);
    }

    AddBranchLeft(source){
        this._takeBranchLeft = source;
    }

    AddBranchRight(source){
        this._takeBranchRight = source;
    }

    ChildTopNode() {
        if (this._childMap.length == 0) {
            return undefined;
        }
        else {
            return this._childMap[this._childMap.length - 1];
        }
    }

    Children() {
        return this._childMap;
    }

    Key() {
        return this._key;
    }

    Command() {
        return this._command;
    }

    Parent() {
        return this._parent;
    }

    BranchLeft(){
        return this._takeBranchLeft;
    }

    BranchRight(){
        return this._takeBranchRight;
    }

}

if (typeof module != 'undefined') {
    module.exports = Command;
}
