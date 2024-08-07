import ZoneHandler from "./ZoneHandler"

export default class UIHandler {
    constructor(scene) {
        this.zoneHandler = new ZoneHandler(scene)
        this.inputText = {}
        // <------------------------------------ Zone ------------------------------------>
        this.BuildZones = () => {
            scene.dropZone1 = this.zoneHandler.renderZone(189, 458, 330 / 3.25, 430 / 3.25)
            scene.dropZone2 = this.zoneHandler.renderZone(90, 575, 330 / 3.25, 430 / 3.25)
            scene.dropZone3 = this.zoneHandler.renderZone(280, 575, 330 / 3.25, 430 / 3.25)
            scene.dropZone4 = this.zoneHandler.renderZone(189, 690, 330 / 3.25, 430 / 3.25)
            scene.dropZone1.setName("dropZone1")
            scene.dropZone2.setName("dropZone2")
            scene.dropZone3.setName("dropZone3")
            scene.dropZone4.setName("dropZone4")
        }
        this.BuildZoneOutline = () => {
            this.zoneHandler.renderOutlineGrid(220, 270, 330, 430)
        }
        this.BuildPlayerAreas = () => {
            scene.playerHandArea = scene.add.rectangle(200, 880, 350, 230)
            scene.playerHandArea.setStrokeStyle(4, 0xff69b4)
            scene.playerDeckArea = scene.add.rectangle(375, 695, 78, 115)
            scene.playerDeckArea.setStrokeStyle(4, 0x00ffff)
            scene.playerRubbishBinArea = scene.add.rectangle(470, 695, 78, 115)
            scene.playerRubbishBinArea.setStrokeStyle(4, 0x00ffff)

            scene.opponentHandArea = scene.add.rectangle(200, -85, 350, 230)
            scene.opponentHandArea.setStrokeStyle(4, 0xff69b4)
            scene.opponentDeckArea = scene.add.rectangle(375, 112, 78, 115)
            scene.opponentDeckArea.setStrokeStyle(4, 0x00ffff)
            scene.opponentRubbishBinArea = scene.add.rectangle(470, 112, 78, 115)
            scene.opponentRubbishBinArea.setStrokeStyle(4, 0x00ffff)
        }
        // <------------------------------------ Room number (top right) ------------------------------------>
        this.buildPlayerNumberText = (playerNumber) => {
            scene.playerNumberText = scene.add.text(350, 250, "你是: 玩家 ").setFontSize(20).setFontFamily("Trebuchet MS")
            if (playerNumber == 1) {
                scene.playerNumberText.text = "你是: 玩家1"
            } else {
                scene.playerNumberText.text = "你是: 玩家2"
            }
        }
        // <------------------------------------ Player turn ------------------------------------>
        this.BuildPlayerTurnText = () => {
            scene.playerTurnText = scene.add.text(350, 300, "等待另一位玩家抽卡...").setFontSize(20).setFontFamily("Trebuchet MS")
        }
        this.setPlayerTurnText = (b) => {
            if (b === true) {
                scene.playerTurnText.text = "你的回合"
            } else {
                scene.playerTurnText.text = "對方的回合"
            }
        }
        // <------------------------------------ Inpsriation points ------------------------------------>
        this.buildPlayerPointText = () => {
            scene.playerPointText = scene.add.text(350, 550, " ").setFontSize(20).setFontFamily("Trebuchet MS")
        }
        this.buildOpponentPointText = () => {
            scene.opponentPointText = scene.add.text(350, 200, " ").setFontSize(20).setFontFamily("Trebuchet MS")
        }
        this.setPlayerPointText = (points) => {
            scene.playerPointText.text = "靈感值:" + points
        }
        this.setOpponentPointText = (points) => {
            scene.opponentPointText.text = "對方靈感值:" + points
        }
        // <------------------------------------ Points (60 to win) ------------------------------------>
        this.BuildWhoWinText = (whoWin) => {
            if (whoWin == 1) {
                scene.whoWinText = scene.add.text(350, 450, "玩家1勝利!", { fontSize: 20, fontFamily: "Trebuchet MS", color: "#00ffff" })
            } else if (whoWin == 2) {
                scene.whoWinText = scene.add.text(350, 450, "玩家2勝利!", { fontSize: 20, fontFamily: "Trebuchet MS", color: "#00ffff" })
            } else if (whoWin == 0) {
                scene.whoWinText = scene.add.text(350, 450, "平手!", { fontSize: 20, fontFamily: "Trebuchet MS", color: "#00ffff" })
            }
        }
        this.BuildPlayerWinScoreText = () => {
            scene.winScoreText = scene.add.text(350, 500, "", { fontSize: 20, fontFamily: "Trebuchet MS", color: "#00ffff" })
        }
        this.SetPlayerWinScoreText = (totalWinScore) => {
            scene.winScoreText.text = "總分: " + totalWinScore
        }
        // <------------------------------------ Draw card (to be removed) ------------------------------------>
        this.BuildGameText = () => {
            scene.dealCardText = scene.add.text(350, 400, "點我抽卡").setFontSize(20).setFontFamily("Trebuchet MS")
            // OnPointerDown event
            scene.dealCardText.on("pointerdown", () => {
                const RNG = Math.floor(Math.random() * 3) + 1
                scene.sound.play(`flipCard${RNG}`)
                scene.socket.emit("dealCards", scene.socket.id, scene.GameHandler.currentRoomID, scene.GameHandler.opponentID)
                scene.dealCardText.disableInteractive()
            })
            // Control card color
            scene.dealCardText.on("pointerover", () => {
                scene.dealCardText.setColor("#fff5fa")
            })
            scene.dealCardText.on("pointerout", () => {
                scene.dealCardText.setColor("#00ffff")
            })
        }
        this.ActivateGameText = () => {
            if (scene.dealCardText != undefined || scene.dealCardText != null) {
                scene.dealCardText.setInteractive()
                scene.dealCardText.setColor("#00ffff")
            }
        }
        // <------------------------------------ Roll Dice ------------------------------------>
        this.BuildRollDiceText = () => {
            scene.rollDiceText1 = scene.add.text(350, 560, " ").setFontSize(20).setFontFamily("Trebuchet MS")
            scene.rollDiceText2 = scene.add.text(350, 590, " ").setFontSize(20).setFontFamily("Trebuchet MS")
        }
        this.setRollDiceText = (num1, num2) => {
            scene.rollDiceText1.text = "玩家1擲出:" + num1
            scene.rollDiceText2.text = "玩家2擲出:" + num2
        }
        this.hideRollDiceText = () => {
            scene.rollDiceText1.text = ""
            scene.rollDiceText2.text = ""
        }
        // <------------------------------------ Room ------------------------------------>
        this.BuildRoomNumberText = () => {
            scene.roomNumberText = scene.add.text(440, 20, "房間編號: ").setFontSize(20).setFontFamily("Trebuchet MS")
        }
        this.BuildCreateRoomText = () => {
            scene.createRoomText = scene.add.text(260, 380, "建立房間", { fontSize: 20, fontFamily: "Trebuchet MS", color: "#00ffff" })
            scene.createRoomText.setInteractive()
            scene.createRoomText.on("pointerdown", () => {
                const RNG = Math.floor(Math.random() * 3) + 1
                scene.sound.play(`flipCard${RNG}`)
                this.BuildPlayArea()
                let randomRoomId = this.generateRandomRoomID()
                scene.socket.emit("createRoom", randomRoomId)
                scene.createRoomText.visible = false
                scene.joinRoomText.visible = false
                scene.GameHandler.currentRoomID = randomRoomId
                scene.roomNumberText.text = "房間編號: " + randomRoomId
                this.inputText.visible = false
                this.HideInputTextDecation()
            })
            // Card color
            scene.createRoomText.on("pointerover", () => {
                scene.createRoomText.setColor("#fff5fa")
            })
            scene.createRoomText.on("pointerout", () => {
                scene.createRoomText.setColor("#00ffff")
            })
        }
        scene.socket.on("joinRoomSucceedSignal", () => {
            this.BuildPlayArea()
            scene.createRoomText.disableInteractive()
            scene.joinRoomText.disableInteractive()
            scene.roomNumberText.text = "房間編號: " + scene.UIHandler.GetInputTextContent(scene.UIHandler.inputText)

            scene.GameHandler.currentRoomID = scene.UIHandler.GetInputTextContent(scene.UIHandler.inputText)
            console.log("Current Room ID: " + scene.GameHandler.currentRoomID)
            scene.socket.emit("dealDeck", scene.socket.id, scene.GameHandler.currentRoomID)

            scene.createRoomText.visible = false
            scene.joinRoomText.visible = false
            this.inputText.destroy()
            this.HideInputTextDecation()
        })
        this.BuildJoinRoomText = () => {
            scene.joinRoomText = scene.add.text(260, 430, "加入房間", { fontSize: 20, fontFamily: "Trebuchet MS", color: "#00ffff" })
            scene.joinRoomText.setInteractive()
            scene.joinRoomText.on("pointerdown", () => {
                const RNG = Math.floor(Math.random() * 3) + 1
                scene.sound.play(`flipCard${RNG}`)
                scene.socket.emit("joinRoom", scene.UIHandler.GetInputTextContent(scene.UIHandler.inputText))
                // (Runs joinRoomSucceedSignal from server.js if success.)
            })
            // Card color
            scene.joinRoomText.on("pointerover", () => {
                scene.joinRoomText.setColor("#fff5fa")
            })
            scene.joinRoomText.on("pointerout", () => {
                scene.joinRoomText.setColor("#00ffff")
            })
        }

        // Main
        this.BuildPlayArea = () => {
            this.BuildZones()
            this.BuildZoneOutline()
            this.BuildPlayerAreas()
            this.BuildPlayerTurnText()
            this.BuildGameText()
            this.BuildRollDiceText()
            this.BuildPlayerWinScoreText()
        }
        this.BuildLobby = () => {
            this.BuildInputTextDecation()
            this.BuildRoomNumberText()
            this.BuildCreateRoomText()
            this.BuildJoinRoomText()
        }
        // Main
        this.BuildInputTextField = (inputText) => {
            inputText = scene.add.text(330, 510, "", { fixedWidth: 150, fixedHeight: 36 })
            inputText.setOrigin(0.5, 0.5)
            inputText.setInteractive().on("pointerdown", () => {
                const RNG = Math.floor(Math.random() * 3) + 1
                scene.sound.play(`flipCard${RNG}`)
                const editor = scene.rexUI.edit(inputText)
                const elem = editor.inputText.node
                elem.style.top = "-10px"
            })
            return inputText
        }
        this.GetInputTextContent = (inputText) => {
            return inputText.text
        }
        this.BuildInputTextDecation = () => {
            scene.inputTextRectangle = scene.rexUI.add.roundRectangle(300, 500, 100, 30, 0, 0x666666)
        }
        this.HideInputTextDecation = () => {
            scene.inputTextRectangle.setFillStyle(0x000000)
        }
        this.generateRandomRoomID = () => {
            // Generate a random number between 0 and 999999 (inclusive)
            const randomNumber = Math.floor(Math.random() * 1000000)

            // Convert the number to a string and pad it with leading zeros if needed
            const randomNumberString = randomNumber.toString().padStart(6, "0")

            return randomNumberString
        }
    }
}
