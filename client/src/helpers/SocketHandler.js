import io from "socket.io-client"
import PositionHandler from "./PositionHandler"
import ScaleHandler from "./ScaleHandler"
import RotationHandler from "./RotationHandler"
import AbilityReader from "./AbilityReader"
import { ICard_Data_24256 } from "../scenes/game.js"

export default class SocketHandler {
    constructor(scene) {
        // Heroku URL
        // Default: localhost:3000 is where the server is.
        scene.socket = io("https://ultimate-card-game-f26046605e38.herokuapp.com")
        // scene.socket = io("http://localhost:3000/")

        //Create or join a room
        scene.socket.on("connect", () => {
            console.log("Connected!")
        })
        scene.socket.on("playersInRoom", (players) => {
            console.log("Players in the room:", players)
            scene.GameHandler.currentPlayersInRoom = players
            scene.GameHandler.opponentID = players.filter((player) => player !== scene.socket.id)

            // Extract the string from the array
            if (scene.GameHandler.opponentID.length === 1) {
                scene.GameHandler.opponentID = scene.GameHandler.opponentID[0]
                console.log("opponentID:", scene.GameHandler.opponentID)
            }
        })

        scene.socket.on("setPlayerTurnText", () => {
            let b = scene.GameHandler.getCurrentTurn()
            scene.UIHandler.setPlayerTurnText(b)
        })
        scene.socket.on("buildPlayerPointText", () => {
            scene.UIHandler.buildPlayerPointText()
        })
        scene.socket.on("setPlayerPointText", () => {
            let points = scene.GameHandler.getPlayerTotalPoint()
            scene.UIHandler.setPlayerPointText(points)
        })
        scene.socket.on("buildOpponentPointText", () => {
            scene.UIHandler.buildOpponentPointText()
        })
        scene.socket.on("setOpponentPointText", () => {
            let points = scene.GameHandler.getOpponentTotalPoint()
            scene.UIHandler.setOpponentPointText(points)
        })
        scene.socket.on("buildPlayerNumberText", (playerNumber) => {
            scene.UIHandler.buildPlayerNumberText(playerNumber)
        })
        scene.socket.on("hideRollDiceText", () => {
            scene.UIHandler.hideRollDiceText()
        })
        scene.socket.on("changeGameState", (gameState) => {
            scene.GameHandler.changeGameState(gameState)
        })
        scene.socket.on("readyToStartGame", (socketId) => {
            // 雙方玩家自動抽卡。其中一方會有延遲，如果指令同時進行可能會出問題
            if (scene.socket.id === socketId) {
                setTimeout(() => {
                    scene.socket.emit(
                        "dealCardsFirstRound",
                        scene.socket.id,
                        scene.GameHandler.currentRoomID,
                        scene.GameHandler.opponentID
                    )
                }, 100)
            } else {
                scene.socket.emit(
                    "dealCardsFirstRound",
                    scene.socket.id,
                    scene.GameHandler.currentRoomID,
                    scene.GameHandler.opponentID
                )
            }
        })

        scene.socket.on("addICardsHCardsInScene", (socketId, cardIdList) => {
            if (socketId === scene.socket.id) {
                // 玩家: 從server獲得卡ID (cardIdList: Array<string>)，根據卡ID新增卡牌。
                for (let i in cardIdList) {
                    let card
                    if (cardIdList[i].includes("I")) {
                        card = scene.DeckHandler.InstantiateCard(
                            PositionHandler.playerCardInHandArea.x + i * PositionHandler.playerCardInHandArea.gap,
                            PositionHandler.playerCardInHandArea.y + PositionHandler.playerCardInHandArea.waveEffectOffset[i],
                            "ICard",
                            cardIdList[i],
                            "playerCard"
                        )
                            .setScale(ScaleHandler.playerInHandCard.scaleX)
                            .setRotation(RotationHandler.playerInHandCard[i] * (Math.PI / 180))
                            .setDepth(i)
                        console.log(typeof card)
                        console.log(cardIdList[i])
                        scene.CardStorage.inHandStorage.push(card)
                    }
                    if (cardIdList[i].includes("H")) {
                        card = scene.DeckHandler.InstantiateCard(
                            PositionHandler.playerCardInHandArea.x + i * PositionHandler.playerCardInHandArea.gap,
                            PositionHandler.playerCardInHandArea.y + PositionHandler.playerCardInHandArea.waveEffectOffset[i],
                            "HCard",
                            cardIdList[i],
                            "playerCard"
                        )
                            .setScale(ScaleHandler.playerInHandCard.scaleX)
                            .setRotation(RotationHandler.playerInHandCard[i] * (Math.PI / 180))
                            .setDepth(i)
                        console.log(typeof card)
                        console.log(cardIdList[i])
                        scene.CardStorage.inHandStorage.push(card)
                    }
                    // scene.GameHandler.playerHand.push(card)
                    // let testMessage = card.getData('test');
                    // console.log(testMessage); // This should output: "test message"
                }
            } else {
                // 對手: 只會看到卡背
                for (let i in cardIdList) {
                    let card = scene.DeckHandler.InstantiateCard(
                        PositionHandler.opponentCardInHandArea.x + i * PositionHandler.opponentCardInHandArea.gap,
                        PositionHandler.opponentCardInHandArea.y,
                        "cardBack",
                        "cardBack",
                        "opponentCard"
                    ).setScale(ScaleHandler.opponentCardBack.scaleY)
                    scene.CardStorage.opponentCardBackStorage.push(card)
                }
            }
        })

        scene.socket.on("localCheckIfAbilityIsSearch", (socketId) => {
            // 玩家: 如果作者卡技能(ability)=搜尋,額外出牌
            // 可選目標(only choose 1): $element, $series, $id, $tag
            // 數量(required): $count
            if (socketId === scene.socket.id) {
                if (scene.GameHandler.ability !== "搜尋") {
                    return
                }
                const target = scene.GameHandler.target
                const element = AbilityReader.getValueByTag(target, "$element")
                const series = AbilityReader.getValueByTag(target, "$series")
                const id = AbilityReader.getValueByTag(target, "$id")
                const tag = AbilityReader.getValueByTag(target, "$tag")
                const count = Number(AbilityReader.getValueByTag(target, "$count"))
                console.log(`element: ${element}, series: ${series}, id: ${id}, tag: ${tag}, count: ${count}`)

                let filteredCardArray = []
                if (id !== null) {
                    filteredCardArray = [id]
                } else if (element !== null) {
                    filteredCardArray = Object.entries(ICard_Data_24256)
                        .filter(([_, card]) => card.element === element)
                        .map(([key]) => key)
                } else if (series !== null) {
                    filteredCardArray = Object.entries(ICard_Data_24256)
                        .filter(([_, card]) => card.series === series)
                        .map(([key]) => key)
                } else if (tag !== null) {
                    filteredCardArray = Object.entries(ICard_Data_24256)
                        .filter(([_, card]) => card.tag === tag)
                        .map(([key]) => key)
                }
                console.log("搜尋的卡組:")
                console.log(filteredCardArray)
                scene.socket.emit(
                    "serverAddExtraCardInHand",
                    scene.socket.id,
                    scene.GameHandler.currentRoomID,
                    filteredCardArray,
                    count === 0 ? 1 : count
                )
                // 對手: TODO (增加對應數量卡牌)
            }
        })

        scene.socket.on("localCheckIfAbilityIsMultiplier", (socketId) => {
            // 玩家: 如果作者卡技能(ability)=倍率加成
            if (socketId === scene.socket.id) {
                if (scene.GameHandler.ability !== "倍率加成") {
                    return
                }
                const target = scene.GameHandler.target
                const targetRules = scene.GameHandler.targetRules
                const multiplier = Number(AbilityReader.getValueByTag(target, "$multiplier"))
                const formula = AbilityReader.getValueByTag(targetRules, "$formula")
                const check = AbilityReader.getValueByTag(targetRules, "$check")
                console.log(`multiplier: ${multiplier}, formula: ${formula}, check: ${check}`)
                const realArray = JSON.parse(check)
                console.log(realArray)

                scene.socket.emit("serverSetSpecialMultiplierRules", scene.socket.id, multiplier, formula, check)
            }
        })

        scene.socket.on("deleteOneCardInHand", (socketId, cardIdToRemove) => {
            const fromArray = scene.CardStorage.inHandStorage
            const toArray = scene.CardStorage.inSceneStorage
            const isPlayer = socketId === scene.socket.id
            if (isPlayer) {
                fromArray.forEach((item) => console.log(item))
                scene.CardStorage.changeCardToAnotherStorage(cardIdToRemove, fromArray, toArray)
            } else {
                // scene.CardStorage.opponentCardBackStorage.shift().destroy()
            }
            //scene.GameHandler.playerHand[2].destroy()
        })
        // * cardId: string * //
        scene.socket.on("dealOneCardInHand", (socketId, cardId, index) => {
            if (socketId === scene.socket.id) {
                console.log("[card index] " + index)
                const cardType = cardId.includes("I") ? "ICard" : cardId.includes("H") ? "HCard" : null

                if (cardType) {
                    const card = scene.DeckHandler.InstantiateCard(
                        PositionHandler.playerCardInHandArea.x + index * PositionHandler.playerCardInHandArea.gap,
                        PositionHandler.playerCardInHandArea.y +
                            PositionHandler.playerCardInHandArea.waveEffectOffset[index > 5 ? 5 : index],
                        cardType,
                        cardId,
                        "playerCard"
                    )
                        .setScale(ScaleHandler.playerInHandCard.scaleX)
                        .setRotation(RotationHandler.playerInHandCard[index > 5 ? 5 : index] * (Math.PI / 180))
                        .setDepth(index)
                    scene.CardStorage.inHandStorage.push(card)
                }
                // scene.GameHandler.playerHand.push(card)
            } else {
                // let card = scene.DeckHandler.InstantiateCard(85 + index * 35, 0, "cardBack", "cardBack", "opponentCard").setScale(
                //     0.26
                // )
                // scene.CardStorage.opponentCardBackStorage.push(card)
            }
        })

        scene.socket.on("addWCardsInScene", (socketId, cardId) => {
            const isPlayer = socketId === scene.socket.id
            const newCard = scene.DeckHandler.InstantiateCard(
                isPlayer ? PositionHandler.playerAuthorCard.x : PositionHandler.opponentAuthorCard.x,
                isPlayer ? PositionHandler.playerAuthorCard.y : PositionHandler.opponentAuthorCard.y,
                "WCard",
                cardId,
                "authorCard"
            ).setScale(
                isPlayer ? ScaleHandler.playerAuthorCard.scaleX : ScaleHandler.opponentAuthorCard.scaleX,
                isPlayer ? ScaleHandler.playerAuthorCard.scaleY : ScaleHandler.opponentAuthorCard.scaleY
            )

            if (isPlayer) {
                scene.CardStorage.wCardStorage.push(newCard)
            } else {
                scene.CardStorage.opponentCardStorage.push(newCard)
            }
        })

        scene.socket.on("setAuthorData", (socketId, authorCardName) => {
            //Author card
            if (socketId === scene.socket.id) {
                scene.GameHandler.setPlayerAuthorData(authorCardName) //Player side
            } else {
                scene.GameHandler.setOpponentAuthorData(authorCardName) //Opponent side
            }
        })
        scene.socket.on("setAuthorRarity", (socketId, authorCardName) => {
            //Author card
            if (socketId === scene.socket.id) {
                scene.GameHandler.setPlayerAuthorRarity(authorCardName) //Player side
                console.log("playerAuthorRarity: " + scene.GameHandler.playerAuthorRarity)
            } else {
                scene.GameHandler.setOpponentAuthorRarity(authorCardName) //Opponent side
                console.log("opponentAuthorRarity: " + scene.GameHandler.opponentAuthorRarity)
            }
        })
        scene.socket.on("RollDice", (socketId, roll1, roll2) => {
            const [playerDiceValue, opponentDiceValue] = socketId === scene.socket.id ? [roll1, roll2] : [roll2, roll1]

            // Display the results
            console.log("playerDiceValue: " + playerDiceValue)
            console.log("opponentDiceValue: " + opponentDiceValue)

            // Update GameHandler with the determined values
            scene.GameHandler.playerDiceValue = playerDiceValue
            scene.GameHandler.opponentDiceValue = opponentDiceValue
        })

        scene.socket.on("decideWhichPlayerFirstTurn", (socketId, roll1, roll2) => {
            const { playerAuthorRarity, opponentAuthorRarity, playerDiceValue, opponentDiceValue } = scene.GameHandler
            if (
                // 1. 等級較高
                playerAuthorRarity > opponentAuthorRarity ||
                // 2. 等級一樣但擲骰勝利時成為先手
                (playerAuthorRarity === opponentAuthorRarity && playerDiceValue > opponentDiceValue)
            ) {
                scene.GameHandler.setTurn(true)
                scene.QuestionCardHandler.initQuestionCard()
            } else {
                scene.GameHandler.setTurn(false)
            }

            // 如果是玩家2 顯示數字需要反轉
            if (playerAuthorRarity === opponentAuthorRarity) {
                scene.UIHandler.setRollDiceText(
                    socketId === scene.socket.id ? roll1 : roll2,
                    socketId === scene.socket.id ? roll2 : roll1
                )
            }
        })

        scene.socket.on("localInitQuestionCard", (socketId) => {
            console.log("localInitQuestionCard")
            console.log(socketId)
            console.log(scene.socket.id)
            if (socketId === scene.socket.id) {
                scene.QuestionCardHandler.initQuestionCard()
            }
        })

        // Called in server.js
        // Where does Player 2 cards display in Player 1 scene??
        // * cardName: String, socketId: string, dropZoneName: string, cardType: ICard/Wcard/HCard * //
        scene.socket.on("localInstantiateOpponentCard", (cardName, socketId, dropZoneName, cardType) => {
            console.log(
                "cardName: " + cardName + " socketId:" + socketId + " dropZoneID:" + dropZoneName + " cardType: " + cardType
            )
            if (socketId !== scene.socket.id) {
                // scene.CardStorage.opponentCardBackStorage.shift().destroy()
                const scaleX = ScaleHandler.opponentInHandCard.scaleX
                const scaleY =
                    cardType === "cardBack" ? ScaleHandler.opponentCardBack.scaleY : ScaleHandler.opponentInHandCard.scaleY
                let gameObject
                switch (dropZoneName) {
                    case "dropZone1": //天
                        gameObject = scene.DeckHandler.InstantiateCard(
                            PositionHandler.opponentSkyCard.x,
                            PositionHandler.opponentSkyCard.y,
                            cardType,
                            cardName,
                            "opponentCard"
                        ).setScale(scaleX, scaleY)
                        break
                    case "dropZone2": //地
                        gameObject = scene.DeckHandler.InstantiateCard(
                            PositionHandler.opponentGroundCard.x,
                            PositionHandler.opponentGroundCard.y,
                            cardType,
                            cardName,
                            "opponentCard"
                        ).setScale(scaleX, scaleY)
                        break
                    case "dropZone3": //人
                        gameObject = scene.DeckHandler.InstantiateCard(
                            PositionHandler.opponentPersonCard.x,
                            PositionHandler.opponentPersonCard.y,
                            cardType,
                            cardName,
                            "opponentCard"
                        ).setScale(scaleX, scaleY)
                        break
                    case "dropZone4": //日
                        gameObject = scene.DeckHandler.InstantiateCard(
                            PositionHandler.opponentSunCard.x,
                            PositionHandler.opponentSunCard.y,
                            cardType,
                            cardName,
                            "opponentCard"
                        ).setScale(scaleX, scaleY)
                        break
                }

                scene.CardStorage.opponentCardStorage.push(gameObject)
            }
        })
        // * pointsString: String, socketId: string, dropZoneName: string * //
        scene.socket.on("calculatePoints", (pointsString, socketId, dropZoneName) => {
            let points = parseInt(pointsString)
            if (socketId === scene.socket.id) {
                switch (dropZoneName) {
                    case "dropZone1": //天
                        scene.GameHandler.setPlayerSkyPoint(points)
                        break
                    case "dropZone2": //地
                        scene.GameHandler.setPlayerGroundPoint(points)
                        break
                    case "dropZone3": //人
                        scene.GameHandler.setPlayerPersonPoint(points)
                        break
                    default:
                        break
                }
            } else {
                switch (dropZoneName) {
                    case "dropZone1": //天
                        scene.GameHandler.setOpponentSkyPoint(points)
                        break
                    case "dropZone2": //地
                        scene.GameHandler.setOpponentGroundPoint(points)
                        break
                    case "dropZone3": //人
                        scene.GameHandler.setOpponentPersonPoint(points)
                        break
                    default:
                        break
                }
            }
            scene.GameHandler.setPlayerTotalPoint()
            scene.GameHandler.setOpponentTotalPoint()
            console.log(
                "Player: " + scene.GameHandler.playerTotalPoints + " " + "Opponent: " + scene.GameHandler.opponentTotalPoints
            )
        })

        scene.socket.on("setTurn", (turn) => {
            scene.GameHandler.setTurn(turn)
        })

        scene.socket.on("changeTurn", () => {
            scene.GameHandler.changeTurn()
        })

        scene.socket.on("setPlayerWinText", (whoWin) => {
            scene.UIHandler.BuildWhoWinText(whoWin)
        })

        scene.socket.on("setPlayerWinScoreText", (scores, socketId) => {
            if (socketId === scene.socket.id) {
                scene.GameHandler.playerTotalWinScore = scores
            }
            scene.UIHandler.setPlayerWinScoreText(scene.GameHandler.playerTotalWinScore)
        })

        scene.socket.on("setPlayerLoseScoreText", (scores, socketId) => {
            if (socketId !== scene.socket.id) {
                scene.GameHandler.opponentTotalWinScore = scores
            }
            scene.UIHandler.setOpponentWinScoreText(scene.GameHandler.opponentTotalWinScore)
        })

        scene.socket.on("localGetWhichPlayerWin", (socketId) => {
            socketId === scene.socket.id ? scene.Toast.showPermanentToast("勝利") : scene.Toast.showPermanentToast("失敗")
        })

        scene.socket.on("clearLocalBattleField", (socketIdToStartLater) => {
            console.log("clearLocalBattleField")
            // Destroy objects in all storage arrays
            scene.CardStorage.inSceneStorage.forEach((object) => {
                if (object && object.destroy) {
                    object.destroy()
                }
            })
            scene.CardStorage.wCardStorage.forEach((object) => {
                if (object && object.destroy) {
                    object.destroy()
                }
            })
            scene.CardStorage.opponentCardStorage.forEach((object) => {
                if (object && object.destroy) {
                    object.destroy()
                }
            })
            // Clear dropZone
            console.log(scene.ZoneHandler.dropZoneList)
            for (let i = 0; i < scene.ZoneHandler.dropZoneList.length; i++) {
                scene.ZoneHandler.dropZoneList[i].data.list.cards = 0
            }
            // Clear i points
            scene.GameHandler.setPlayerSkyPoint(0)
            scene.GameHandler.setPlayerGroundPoint(0)
            scene.GameHandler.setPlayerPersonPoint(0)
            scene.GameHandler.setOpponentSkyPoint(0)
            scene.GameHandler.setOpponentGroundPoint(0)
            scene.GameHandler.setOpponentPersonPoint(0)
            scene.UIHandler.setPlayerPointText(0)
            scene.UIHandler.setOpponentPointText(0)
            // UI
            scene.UIHandler.deleteWhoWinText()

            if (scene.socket.id === socketIdToStartLater) {
                setTimeout(() => {
                    scene.socket.emit(
                        "dealCardsAnotherRound",
                        scene.socket.id,
                        scene.GameHandler.currentRoomID,
                        scene.GameHandler.opponentID
                    )
                }, 100)
            } else {
                scene.socket.emit(
                    "dealCardsAnotherRound",
                    scene.socket.id,
                    scene.GameHandler.currentRoomID,
                    scene.GameHandler.opponentID
                )
            }
        })
    }
}
