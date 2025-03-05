import { ICard_Data_24256, WCard_Data_24256 } from "../scenes/game.js"

export default class Card {
    constructor(scene) {
        this.render = (x, y, cardType, side) => {
            let sprite
            let card
            if (side === "playerCard") {
                sprite = this.playerCardSprite
            } else {
                sprite = this.opponentCardSprite
            }

            // add.image: Phaser 3 built-in code (x-coordinate, y-coordinate, image referenced by name in game.js)
            if (cardType == "HCard") {
                card = scene.add.image(x, y, sprite).setInteractive().setData({
                    id: this.id,
                    element: "無",
                    points: -1,

                    side: side,
                    sprite: sprite,
                })
            }
            if (cardType == "ICard") {
                card = scene.add.image(x, y, sprite).setInteractive().setData({
                    id: this.id,
                    element: ICard_Data_24256[this.id].element,
                    series: ICard_Data_24256[this.id].series,
                    points: ICard_Data_24256[this.id].points,
                    rarity: ICard_Data_24256[this.id].points,
                    tag: ICard_Data_24256[this.id].tag,

                    side: side,
                    sprite: sprite,
                })
            }
            if (cardType == "WCard") {
                card = scene.add
                    .image(x, y, sprite)
                    .setInteractive()
                    .setData({
                        id: this.id,
                        side: side,
                        sprite: sprite,

                        name: WCard_Data_24256[this.id].name,
                        rarity: WCard_Data_24256[this.id].rarity,
                        sky: WCard_Data_24256[this.id].sky,
                        ground: WCard_Data_24256[this.id].ground,
                        person: WCard_Data_24256[this.id].person,
                        authorBuffs: WCard_Data_24256[this.id].authorBuffs,
                        ability: WCard_Data_24256[this.id].ability || "",
                        target: WCard_Data_24256[this.id].target || "",
                    })
            }
            if (cardType == "cardBack") {
                card = scene.add.image(x, y, sprite).setInteractive().setData({
                    id: this.id,
                    side: side,
                    sprite: sprite,
                })
            }

            if (side === "playerCard") {
                scene.input.setDraggable(card)
            }

            return card
        }
    }
}
