import { ICard_Data_23246, WCard_Data_23246 } from "../scenes/game.js"

export default class InteractiveHandler {
    constructor(scene) {
        // Section: Card preview
        // Create cardPreview on pointerdown

        let isCardPreviewActive = false
        //scene.cardPreview = scene.add.image(0, 0, "I001");
        //scene.cardPreview.setVisible(false);
        this.cardPreview = null

        scene.input.on("pointerdown", (event, gameObjects) => {
            let pointer = scene.input.activePointer
            // Check if gameObject is defined
            //console.log("isCardPreviewActive: " + isCardPreviewActive);
            // If not clicking anything gameObjects returns empty array, like this....... []
            //console.log(gameObjects);
            if ((gameObjects.length == 0 || gameObjects[0].type === "Zone") && isCardPreviewActive && this.cardPreview !== null) {
                this.cardPreview.setPosition(1250, 400)
                this.isCardPreviewActive = false
            }
            if (!gameObjects || gameObjects.length == 0) {
                return
            }
            if (gameObjects[0].type === "Image" && gameObjects[0].data.list.id !== "cardBack") {
                scene.sound.play("dragCard")
                console.log(gameObjects[0].data)
                if (this.cardPreview === null) {
                    this.cardPreview = scene.add.image(750, 400, gameObjects[0].data.values.sprite).setScale(0.7, 0.7)
                } else {
                    this.cardPreview.setTexture(gameObjects[0].data.values.sprite).setScale(0.7, 0.7)
                    this.cardPreview.setPosition(750, 400)
                }
                let tween = scene.tweens.add({
                    targets: this.cardPreview,
                    x: 465,
                    duration: 100,
                    ease: "Linear",
                    yoyo: false, // Don't yoyo (return to start position) after tween ends
                    repeat: 0,
                })
                isCardPreviewActive = true
                tween.play()
            }
        })

        scene.input.on("drag", (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX
            gameObject.y = dragY
        })
        scene.input.on("dragstart", (pointer, gameObject) => {
            gameObject.setTint(0xf0ccde)
            scene.children.bringToTop(gameObject)
        })

        scene.input.on("dragend", (pointer, gameObject, dropped) => {
            gameObject.setTint()
            if (!dropped) {
                gameObject.x = gameObject.input.dragStartX
                gameObject.y = gameObject.input.dragStartY
            }
        })

        // Card drop
        // 'drop' *** built-in function in Phaser 3
        // gameObject: Card
        scene.input.on("drop", (pointer, gameObject, dropZone) => {
            let isMatch = false
            let cardType = ""
            switch (dropZone.name) {
                case "dropZone1": //天
                    if (gameObject.getData("id").includes("H")) {
                        isMatch = false
                        cardType = "cardBack"
                    } else if (
                        !gameObject.getData("id").includes("I") ||
                        !scene.GameHandler.playerSkyElements.includes(gameObject.getData("element"))
                    ) {
                        isMatch = false
                        cardType = "cardBack"
                    } else {
                        isMatch = true
                        cardType = "ICard"
                    }
                    scene.GameHandler.skyCardZoneName = gameObject.getData("id")
                    break
                case "dropZone2": //地
                    if (gameObject.getData("id").includes("H")) {
                        isMatch = false
                        cardType = "cardBack"
                    } else if (
                        !gameObject.getData("id").includes("I") ||
                        !scene.GameHandler.playerGroundElements.includes(gameObject.getData("element"))
                    ) {
                        isMatch = false
                        cardType = "cardBack"
                    } else {
                        isMatch = true
                        cardType = "ICard"
                    }
                    scene.GameHandler.groundCardZoneName = gameObject.getData("id")
                    break
                case "dropZone3": //人
                    if (gameObject.getData("id").includes("H")) {
                        isMatch = false
                        cardType = "cardBack"
                    } else if (
                        !gameObject.getData("id").includes("I") ||
                        !scene.GameHandler.playerPersonElements.includes(gameObject.getData("element"))
                    ) {
                        isMatch = false
                        cardType = "cardBack"
                    } else {
                        isMatch = true
                        cardType = "ICard"
                    }
                    scene.GameHandler.personCardZoneName = gameObject.getData("id")
                    break
                case "dropZone4": //日
                    if (gameObject.getData("id").includes("I")) {
                        isMatch = false
                        cardType = "cardBack"
                    } else if (gameObject.getData("id").includes("H")) {
                        isMatch = false
                        cardType = "HCard"
                    }
                    scene.GameHandler.sunCardZoneName = gameObject.getData("id")
                    break
            }
            if (scene.GameHandler.isMyTurn && scene.GameHandler.gameState === "Ready" && dropZone.data.list.cards == 0) {
                const RNG = Math.floor(Math.random() * 3) + 1
                scene.sound.play(`flipCard${RNG}`)
                let authorBuffPts = 0
                let elementID = 99
                if (gameObject.getData("id").includes("I")) {
                    switch (gameObject.getData("element")) {
                        case "火":
                            elementID = 0
                            break
                        case "水":
                            elementID = 1
                            break
                        case "木":
                            elementID = 2
                            break
                        case "金":
                            elementID = 3
                            break
                        case "土":
                            elementID = 4
                            break
                        default:
                            break
                    }
                    authorBuffPts = scene.GameHandler.authorBuffs[elementID]
                }
                // 積分倍率計算(同屬雙倍,同靈感三倍)
                // 蓋牌無法獲得積分加倍
                if (gameObject.getData("id").includes("I") && dropZone.name !== "dropZone4") {
                    if (isMatch) {
                        scene.socket.emit("setCardType", scene.socket.id, elementID, gameObject.getData("points"))
                    } else {
                        scene.socket.emit("setCardType", scene.socket.id, -1, -1)
                    }
                }
                gameObject.x = dropZone.x
                gameObject.y = dropZone.y

                // calculatePoints does not affect dropZone 4
                if (isMatch) {
                    console.log("gameObject.getData(points)" + gameObject.getData("points"))
                    scene.socket.emit(
                        "cardPlayed",
                        gameObject.getData("id"),
                        scene.socket.id,
                        dropZone.name,
                        scene.GameHandler.currentRoomID,
                        cardType
                    )
                    scene.socket.emit(
                        "calculatePoints",
                        gameObject.getData("points") + authorBuffPts,
                        scene.socket.id,
                        dropZone.name,
                        scene.GameHandler.currentRoomID
                    )
                } else {
                    cardType === "cardBack" && gameObject.setTexture("H001B")
                    scene.socket.emit(
                        "cardPlayed",
                        gameObject.getData("id"),
                        scene.socket.id,
                        dropZone.name,
                        scene.GameHandler.currentRoomID,
                        cardType
                    )
                    scene.socket.emit("calculatePoints", 0 + authorBuffPts, scene.socket.id, dropZone.name, scene.GameHandler.currentRoomID)
                }
                scene.input.setDraggable(gameObject, false)
                scene.socket.emit("setCardsInServer", scene.socket.id, gameObject.getData("id"), scene.GameHandler.currentRoomID)
                scene.UIHandler.hideRollDiceText()
                dropZone.data.list.cards++
                scene.socket.emit("setAuthorBuff", scene.socket.id, authorBuffPts)
                scene.socket.emit("addCardCount", scene.socket.id, scene.GameHandler.opponentID, scene.GameHandler.currentRoomID)
            } else {
                gameObject.x = gameObject.input.dragStartX
                gameObject.y = gameObject.input.dragStartY
            }
        })

        //Debug
        scene.input.on("pointerdown", (pointer) => {
            // Get the x and y coordinates of the mouse pointer
            const x = pointer.x
            const y = pointer.y

            // Show the coordinates on the console
            //console.log(`Clicked at X: ${x}, Y: ${y}`);
        })
    }
}
