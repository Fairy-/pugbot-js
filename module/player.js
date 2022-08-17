class Player {
    constructor(name,id) {
        this.name = name;
        this.id = id;
        this.createtimestamp = Date.now();
    }

    createTimestamp() {
        this.createtimestamp = Date.now();
    }

    setTimestamp(timestamp) {
        this.createTimestamp = timestamp;
    }
}
module.exports = Player