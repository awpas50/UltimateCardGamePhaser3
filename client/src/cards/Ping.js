import Card from "./card";

export default class Ping extends Card {
    constructor(scene) {
        super(scene);
        this.name = "ping";
        this.playerCardSprite = "cyanPing";
        this.opponentCardSprite = "magentaPing";
    }
}