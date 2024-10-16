import CardStorage from "../helpers/CardStorage"
import DeckHandler from "../helpers/DeckHandler"
import GameHandler from "../helpers/GameHandler"
import InteractiveHandler from "../helpers/InteractiveHandler"
import SocketHandler from "../helpers/SocketHandler"
import UIHandler from "../helpers/UIHandler"
import ZoneHandler from "../helpers/ZoneHandler"
import { InputText, TextArea } from "phaser3-rex-plugins/templates/ui/ui-components.js"

// 編號/名稱/等級/天/地/人屬性
// 無屬性填 ["火", "水", "木", "金", "土"]

// 火/水/木/金/土屬性加成
// 例子: [0, 50, 0, -20, 0] 指水+50, 金-20.
export const WCard_Data_23246 = {
    "23246_W001": {
        ID: "23246_W001",
        name: "李煜",
        rarity: 2,
        sky: ["金", "水"],
        ground: ["土", "水", "木"],
        person: ["火", "水", "金"],
        authorBuffs: [0, 50, 0, -20, 0],
    },

    "23246_W002": {
        ID: "23246_W002",
        name: "孟子",
        rarity: 2,
        sky: ["土", "火"],
        ground: ["水", "火", "土"],
        person: ["木", "火", "金"],
        authorBuffs: [40, 0, 0, 0, 10],
    },

    "23246_W009": {
        ID: "23246_W009",
        name: "李商隱",
        rarity: 3,
        sky: ["水"],
        ground: ["火", "水", "木", "金", "土"],
        person: ["火", "水", "木", "金", "土"],
        authorBuffs: [0, 20, 0, 0, 0],
    },

    "23246_W010": {
        ID: "23246_W010",
        name: "李白",
        rarity: 4,
        sky: ["木", "水", "火"],
        ground: ["火", "水", "木", "金", "土"],
        person: ["火", "水", "木", "金", "土"],
        authorBuffs: [60, 60, 0, 0, 0],
    },

    "23246_W016": {
        ID: "23246_W016",
        name: "童年孟子",
        rarity: 1,
        sky: ["水"],
        ground: ["土", "水"],
        person: ["火", "水"],
        authorBuffs: [0, 20, 0, 0, 0],
    },
}
// 靈感卡：編號/名稱/屬性/系列/靈感值
export const ICard_Data_23246 = {
    "23246_I002": { ID: "23246_I002", name: "幻想", element: "水", series: "袁枚系列", points: 60 },
    "23246_I006": { ID: "23246_I006", name: "瞠視", element: "水", series: "袁枚系列", points: 50 },
    "23246_I007": { ID: "23246_I007", name: "文墨", element: "土", series: "袁枚系列", points: 40 },
    "23246_I008": { ID: "23246_I008", name: "野史", element: "金", series: "袁枚系列", points: 40 },
    "23246_I013": { ID: "23246_I013", name: "曉花", element: "水", series: "袁枚系列", points: 10 },

    "23246_I019": { ID: "23246_I019", name: "雲母", element: "金", series: "中秋系列", points: 70 },
    "23246_I020": { ID: "23246_I020", name: "曉星", element: "水", series: "中秋系列", points: 60 },
    "23246_I021": { ID: "23246_I021", name: "靈藥", element: "火", series: "中秋系列", points: 20 },
    "23246_I022": { ID: "23246_I022", name: "夜心", element: "水", series: "中秋系列", points: 90 },
    "23246_I024": { ID: "23246_I024", name: "明月", element: "火", series: "中秋系列", points: 30 },

    "23246_I029": { ID: "23246_I029", name: "缾罍", element: "金", series: "詩經系列", points: 80 },
    "23246_I030": { ID: "23246_I030", name: "青蒿", element: "木", series: "詩經系列", points: 50 },
    "23246_I031": { ID: "23246_I031", name: "劬勞", element: "水", series: "詩經系列", points: 0 },
    "23246_I034": { ID: "23246_I034", name: "雨雪", element: "水", series: "詩經系列", points: 40 },
    "23246_I037": { ID: "23246_I037", name: "荇菜", element: "水", series: "詩經系列", points: 20 },
    "23246_I039": { ID: "23246_I039", name: "木瓜", element: "木", series: "詩經系列", points: 60 },
    "23246_I040": { ID: "23246_I040", name: "相鼠", element: "土", series: "詩經系列", points: 50 },

    "23246_I045": { ID: "23246_I045", name: "蔽日", element: "木", series: "楚辭系列", points: 50 },
    "23246_I046": { ID: "23246_I046", name: "矢墜", element: "火", series: "楚辭系列", points: 90 },
    "23246_I047": { ID: "23246_I047", name: "驂馬", element: "火", series: "楚辭系列", points: 70 },
    "23246_I049": { ID: "23246_I049", name: "漁父", element: "水", series: "楚辭系列", points: 60 },
    "23246_I051": { ID: "23246_I051", name: "芙蓉", element: "木", series: "楚辭系列", points: 10 },
    "23246_I055": { ID: "23246_I055", name: "得閒", element: "水", series: "楚辭系列", points: 70 },

    "23246_I059": { ID: "23246_I059", name: "冠者", element: "土", series: "孔子系列", points: 20 },
    "23246_I064": { ID: "23246_I064", name: "犬馬", element: "土", series: "孔子系列", points: 80 },
    "23246_I068": { ID: "23246_I068", name: "貧賤", element: "土", series: "孔子系列", points: 50 },

    "23246_I070": { ID: "23246_I070", name: "棄甲", element: "金", series: "孟子系列", points: 0 },
    "23246_I071": { ID: "23246_I071", name: "數罟", element: "土", series: "孟子系列", points: 0 },
    "23246_I072": { ID: "23246_I072", name: "魚鼈", element: "水", series: "孟子系列", points: 80 }, //roll dice
    "23246_I074": { ID: "23246_I074", name: "雞豚", element: "土", series: "孟子系列", points: 80 }, //roll dice
    "23246_I075": { ID: "23246_I075", name: "狗彘", element: "木", series: "孟子系列", points: 80 }, //roll dice
    "23246_I076": { ID: "23246_I076", name: "餓莩", element: "火", series: "孟子系列", points: 50 },
    "23246_I077": { ID: "23246_I077", name: "四善", element: "火", series: "孟子系列", points: 40 },
    "23246_I079": { ID: "23246_I079", name: "釁鐘", element: "金", series: "孟子系列", points: 50 },
    "23246_I081": { ID: "23246_I081", name: "秋毫", element: "木", series: "孟子系列", points: 40 },
    "23246_I082": { ID: "23246_I082", name: "輿薪", element: "木", series: "孟子系列", points: 70 },
    "23246_I083": { ID: "23246_I083", name: "不能", element: "水", series: "孟子系列", points: 80 },
    "23246_I084": { ID: "23246_I084", name: "折枝", element: "木", series: "孟子系列", points: 50 },
}

export const HCard_Data_23246 = {
    "23246_H001": { ID: "23246_H001" },
    "23246_H013": { ID: "23246_H013" },
    "23246_H025": { ID: "23246_H025" },
    "23246_H034": { ID: "23246_H034" },
    "23246_H036": { ID: "23246_H036" },
    "23246_H042": { ID: "23246_H042" },
    "23246_H044": { ID: "23246_H044" },
    "23246_H045": { ID: "23246_H045" },
    "23246_H046": { ID: "23246_H046" },
    "23246_H049": { ID: "23246_H049" },
    "23246_H050": { ID: "23246_H050" },
    "23246_H051": { ID: "23246_H051" },
    "23246_H052": { ID: "23246_H052" },
    "23246_H054": { ID: "23246_H054" },
    "23246_H055": { ID: "23246_H055" },
}

export default class Game extends Phaser.Scene {
    constructor() {
        super({
            key: "Game",
        })
    }

    preload() {
        const wCards = ["W001", "W002", "W009", "W010", "W016"]
        const iCards = [
            "I002",
            "I006",
            "I007",
            "I008",
            "I013",
            "I019",
            "I020",
            "I021",
            "I022",
            "I024",
            "I029",
            "I030",
            "I031",
            "I034",
            "I037",
            "I039",
            "I040",
            "I045",
            "I046",
            "I047",
            "I049",
            "I051",
            "I055",
            "I059",
            "I064",
            "I068",
            "I070",
            "I071",
            "I072",
            "I074",
            "I075",
            "I076",
            "I077",
            "I079",
            "I081",
            "I082",
            "I083",
            "I084",
        ]
        const hCards = [
            "H001",
            "H013",
            "H025",
            "H034",
            "H036",
            "H042",
            "H044",
            "H045",
            "H046",
            "H049",
            "H050",
            "H051",
            "H052",
            "H054",
            "H055",
        ]

        // Function to load images
        const loadImages = (prefix, cardArray, path) => {
            cardArray.forEach((card) => {
                this.load.image(`${prefix}_${card}`, require(`../../public/assets/23246/${path}/${prefix}_${card}.jpg`).default)
            })
        }

        // Prefix / card number / path
        loadImages("23246", wCards, "WCard")
        loadImages("23246", iCards, "ICard")
        loadImages("23246", hCards, "HCard")

        this.load.image("H001B", require("../../public/assets/Back/H001B.png").default)
        this.load.image("H001B_Filped", require("../../public/assets/Back/H001B_Filped.png").default)
        this.load.image("W001B", require("../../public/assets/Back/W001B.png").default)
        this.load.image("BG", require("../../public/assets/Back/WoodBackground.jpg").default)

        this.load.audio("BGM1", require("../sfx/BGM1.mp3").default)
        this.load.audio("flipCard1", require("../sfx/flipCard1.mp3").default)
        this.load.audio("flipCard2", require("../sfx/flipCard2.wav").default)
        this.load.audio("flipCard3", require("../sfx/flipCard3.wav").default)
        this.load.audio("dragCard", require("../sfx/dragCard.wav").default)
    }

    create() {
        // window.addEventListener("beforeunload", function (event) {
        //     // Optional: Inform the user about unsaved changes
        //     const confirmationMessage = "You have unsaved changes. Are you sure you want to leave?"
        //     event.returnValue = confirmationMessage // Standard for most browsers
        //     return confirmationMessage // For older browsers
        // })

        this.setupSounds()

        this.cameras.main.roundPixels = true
        // Set scale mode
        this.scale.scaleMode = Phaser.Scale.ScaleModes.NEAREST
        // Ensure the canvas doesn't smooth images
        this.scale.canvas.setAttribute("image-rendering", "pixelated")
        // Check if the canvas exists
        // if (this.sys.game.canvas) {
        //     const context = this.sys.game.canvas.getContext('2d');
        //     // Check if the context and imageSmoothingQuality are supported
        //     if (context && 'imageSmoothingQuality' in context) {
        //         context.imageSmoothingQuality = 'high';
        //     } else {
        //         console.warn('Canvas context or imageSmoothingQuality is not supported in this browser.');
        //     }
        // } else {
        //     console.warn('Canvas element not found.');
        // }

        this.CardStorage = new CardStorage(this)
        this.DeckHandler = new DeckHandler(this)
        this.GameHandler = new GameHandler(this)
        this.SocketHandler = new SocketHandler(this)
        this.ZoneHandler = new ZoneHandler(this)
        this.UIHandler = new UIHandler(this)
        this.InteractiveHandler = new InteractiveHandler(this)

        this.UIHandler.inputText = this.UIHandler.buildInputTextField(this.UIHandler.inputText)
        this.UIHandler.buildLobby()

        // let backgroundImage = this.add.image(0, 0, 'BG');
        // backgroundImage.setOrigin(0, 0);
        // backgroundImage.setDepth(0); // Set a depth level for the background
        // backgroundImage.disableInteractive();
    }

    setupSounds = () => {
        this.backgroundMusic = this.sound.add("BGM1")
        this.backgroundMusic.setLoop(true)
        this.backgroundMusic.play()
        this.backgroundMusic.setVolume(0.5)

        this.sound.add("flipCard1")
        this.sound.add("flipCard2")
        this.sound.add("flipCard3")
        this.sound.add("dragCard")
    }

    update() {}
}
