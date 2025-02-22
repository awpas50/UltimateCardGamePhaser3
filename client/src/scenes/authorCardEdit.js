import AuthorCardDeckEditHandler from "../card_edit_scene/AuthorCardDeckEditHandler"
import Toast from "../helpers/Toast"

export default class AuthorCardEdit extends Phaser.Scene {
    constructor() {
        super({
            key: "AuthorCardEdit",
        })
    }

    preload() {
        // missing W013
        const wCards = [
            "W001",
            "W002",
            "W003",
            "W004",
            "W005",
            "W006",
            "W007",
            "W008",
            "W009",
            "W010",
            "W011",
            "W012",
            "W014",
            "W015",
            "W016",
            "W017",
        ]
        // Function to load images
        const loadImages = (prefix, cardArray, path, format) => {
            cardArray.forEach((card) => {
                this.load.image(
                    `${prefix}${card}`,
                    require(`../../public/assets/23246/${path}/${prefix}${card}.${format}`).default
                )
            })
        }
        // Prefix / card number / path
        loadImages("23246_", wCards, "WCard", "jpg")

        this.load.image("H001B", require("../../public/assets/Test/H001B.png").default)
        this.load.image("H001B_Filped", require("../../public/assets/Test/H001B_Filped.png").default)
        this.load.image("W001B", require("../../public/assets/Test/W001B.png").default)
        this.load.image("BG", require("../../public/assets/Test/WoodBackground.jpg").default)

        this.load.audio("BGM1", require("../sfx/BGM1.mp3").default)
        this.load.audio("flipCard1", require("../sfx/flipCard1.mp3").default)
        this.load.audio("flipCard2", require("../sfx/flipCard2.wav").default)
        this.load.audio("flipCard3", require("../sfx/flipCard3.wav").default)
        this.load.audio("dragCard", require("../sfx/dragCard.wav").default)

        // this.load.glsl("wipeShader", require("../shaders/linearwipe.glsl").default)
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
        this.AuthorCardDeckEditHandler = new AuthorCardDeckEditHandler(this)
        this.Toast = new Toast(this)

        this.AuthorCardDeckEditHandler.initUI()
    }

    setupSounds = () => {
        this.sound.add("flipCard1")
        this.sound.add("flipCard2")
        this.sound.add("flipCard3")
        this.sound.add("dragCard")
    }
}
