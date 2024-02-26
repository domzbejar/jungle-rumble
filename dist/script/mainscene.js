import DummyData from "./helper/dummyData.js";
import DisplayBalance from "./displaybalance.js";
import BetOrder from "./helper/betorder.js";
let totalBetDisplayUI;
const apiResult = {
    sprite: "",
    index: null,
};
let globalBalance = 1200;
const global = {
    size: {
        width: 1080,
        height: 610
    },
    center: {
        x: 0,
        y: 0,
    },
    currentChipValue: 1,
    chipPosition: {
        x: 0,
        y: 0,
    },
    onProcess: false,
    isAutoProcess: false,
};
global.center.x = global.size.width / 2;
global.center.y = global.size.height / 2;
let noBalanceModal;
let noBet;
let bet = {
    "hawk": 0,
    "lion": 0,
    "chicken": 0,
    "ostrich": 0,
    "owl": 0,
    "panda": 0,
    "monkey": 0,
    "rabbit": 0,
    "blue": 0,
    "red": 0,
};
let betHistory = {
    "hawk": 0,
    "lion": 0,
    "chicken": 0,
    "ostrich": 0,
    "owl": 0,
    "panda": 0,
    "monkey": 0,
    "rabbit": 0,
    "blue": 0,
    "red": 0,
};
const sfxMarker = [
    { name: 'negative-tone-sfx', start: 0, duration: .6, config: { volume: .5 } },
    { name: 'submit-sfx', start: 1, duration: .5, config: { volume: .5 } },
    { name: 'chime-sfx', start: 2, duration: .5, config: { volume: .5 } },
    { name: 'chip-sfx', start: 3, duration: .5, config: { volume: .5 } },
    { name: 'clear-chips-sfx', start: 4, duration: .7, config: { volume: .5 } },
    { name: 'click-sfx', start: 5, duration: .3, config: { volume: .5 } },
    { name: 'deselect-sfx', start: 6, duration: .5, config: { volume: .5 } },
    { name: 'error-sfx', start: 7, duration: .5, config: { volume: .5 } },
    { name: 'jinggle-sfx', start: 8, duration: 1.5, config: { volume: .5 } },
    { name: 'win-sfx', start: 10, duration: 1.3, config: { volume: .5 } },
];
export default class MainScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'MainScene',
            pack: {
                files: [
                    { type: 'image', key: 'loading-page', url: './assets/textures/loading-page.jpg', extension: 'jpg' }
                ]
            }
        });
        this.highlightBoxTweenGroup = [];
    }
    preload() {
        const loadingPage = this.add.image(global.center.x, global.center.y, 'loading-page');
        const bar = this.add.graphics();
        this.load.on('progress', (value) => {
            bar.clear();
            bar.fillStyle(0xd43838);
            bar.fillRect(40, 569, 1001 * value, 26);
        });
        this.load.on('complete', () => {
            bar.destroy();
            loadingPage.destroy();
        });
        this.load.setPath('assets/textures');
        this.load.atlas('main', 'mainui.png', 'mainui.json');
        this.load.atlas('animals', 'animals.png', 'animals.json');
        this.load.atlas('chips', 'chips.png', 'chips.json');
        this.load.atlas('history-marker', 'history-marker.png', 'history-marker.json');
        this.load.spine('hawk-spine', 'hawk-spine.json', ['hawk-spine.atlas'], true);
        this.load.spine('chicken-spine', 'chicken-spine.json', ['chicken-spine.atlas'], true);
        this.load.spine('animal-spine', 'animal-spine.json', ['animal-spine.atlas'], true);
        this.load.spine('ostrich-spine', 'ostrich-spine.json', ['ostrich-spine.atlas'], true);
        this.load.spine('lion-spine', 'lion-spine.json', ['lion-spine.atlas'], true);
        this.load.spine('egg-spine', 'egg-spine.json', ['egg-spine.atlas'], true);
        this.load.spine('monkey-spine', 'monkey-spine.json', ['monkey-spine.atlas'], true);
        this.load.spine('owl-spine', 'owl-spine.json', ['owl-spine.atlas'], true);
        this.load.audio('all-sfx', '../audio/all-sfx.mp3');
        this.load.bitmapFont('skarjan', 'skarjan.png', 'skarjan.xml');
        this.load.spritesheet('coin', 'coin.png', { frameWidth: 75, frameHeight: 75 });
    }
    create() {
        var _a;
        this.add.image(global.center.x, global.center.y, "main", "bg2.png");
        this.add.image(global.center.x, global.center.y, "main", "trees.png").setDepth(2).setScale(1.02);
        this.add.image(120, 590, "main", 'bal-bg.png').setDepth(2);
        const balanceGlitterEmitter = this.add.particles(0, 0, 'main', {
            x: 32,
            y: 590,
            frame: ['glitter.png'],
            frequency: -1,
            quantity: 2,
            scale: { start: 1, end: 0 },
            lifespan: { min: 300, max: 400 },
            speed: { min: 50, max: 100 },
            rotate: { start: 1, end: 270 },
            blendMode: "SCREEN"
        }).setDepth(4);
        const balanceCoin = this.add.sprite(35, 590, 'coin').setDepth(12).setScale(.3).setVisible(false);
        this.add.image(120, 560, "main", 'total-bg.png').setDepth(10);
        totalBetDisplayUI = this.add.text(120, 560, '0', {
            color: '#ffffff',
            fontSize: 20,
            fontFamily: "Arial,Trebuchet,Sans-serif",
        }).setDepth(10).setOrigin(.5);
        const displaybalance = new DisplayBalance(this, 'displayBalance');
        displaybalance.Init(120, 590, globalBalance, 2);
        noBalanceModal = this.add.container();
        const noBalanceOverlay = this.add.graphics();
        noBalanceOverlay.fillStyle(0x000000, .7);
        noBalanceOverlay.fillRect(0, 0, global.size.width, global.size.height);
        const noBalance = this.add.image(global.center.x, global.center.y - 80, "main", 'no-balance.png');
        const noBalanceBtn = this.add.image(global.center.x, global.center.y + 40, "main", 'btn-no-balance.png').setInteractive();
        noBalanceModal.add([noBalanceOverlay, noBalance, noBalanceBtn]);
        noBalanceModal.setDepth(99).setVisible(false);
        noBalanceBtn.on('pointerdown', () => {
            this.sound.play('all-sfx', sfxMarker[6]);
            noBalanceModal.setVisible(false);
            ClearAllChips();
        });
        noBet = this.add.image(global.center.x, global.center.y - 80, "main", 'no-bets.png').setVisible(false).setDepth(20);
        const historyPanel = new HistoryPanel(this, 'historyPanel', 215, 125);
        const hawkBtn = new BetButton(this, global.center.x - 165, 210, 'btn-hawk.png', "hawk", 12);
        const lionBtn = new BetButton(this, global.center.x + 165, 210, 'btn-lion.png', "lion", 12).setInteractive();
        const chickenBtn = new BetButton(this, global.center.x - 275, 315, 'btn-chicken.png', "chicken", 8).setInteractive();
        const ostrichBtn = new BetButton(this, global.center.x - 165, 315, 'btn-ostrich.png', "ostrich", 8).setInteractive();
        const owlBtn = new BetButton(this, global.center.x - 55, 315, 'btn-owl.png', "owl", 6).setInteractive();
        const pandaBtn = new BetButton(this, global.center.x + 55, 315, 'btn-panda.png', "panda", 8).setInteractive();
        const monkeyBtn = new BetButton(this, global.center.x + 165, 315, 'btn-monkey.png', "monkey", 8).setInteractive();
        const rabbitBtn = new BetButton(this, global.center.x + 275, 315, 'btn-rabbit.png', "rabbit", 6).setInteractive();
        const blueBtn = new BetButton(this, global.center.x - 165, 420, 'btn-blue.png', "blue", 1.95).setInteractive();
        const redBtn = new BetButton(this, global.center.x + 165, 420, 'btn-red.png', "red", 1.95).setInteractive();
        const rays1 = this.add.image(200, 200, 'main', 'rays1.png').setBlendMode("ADD").setDepth(4).setVisible(false);
        const rays2 = this.add.image(200, 200, 'main', 'rays2.png').setBlendMode("SCREEN").setDepth(4).setScale(1.2).setVisible(false);
        const ray1Tween = this.tweens.add({
            targets: rays1,
            duration: 2000,
            repeat: -1,
            rotation: Phaser.Math.DegToRad(360)
        }).pause();
        const ray2Tween = this.tweens.add({
            targets: rays2,
            duration: 2000,
            repeat: -1,
            rotation: Phaser.Math.DegToRad(-360),
        }).pause();
        const glitterEmitter = this.add.particles(0, 0, 'main', {
            x: 0,
            y: 0,
            frame: ['glitter.png'],
            frequency: -1,
            quantity: 2,
            scale: { start: 1, end: 0 },
            lifespan: { min: 300, max: 600 },
            speed: { min: 150, max: 300 },
            rotate: { start: 1, end: 270 },
            blendMode: "SCREEN"
        }).setDepth(4);
        const animalButton = {
            "hawk": hawkBtn,
            "lion": lionBtn,
            "chicken": chickenBtn,
            "ostrich": ostrichBtn,
            "owl": owlBtn,
            "panda": pandaBtn,
            "monkey": monkeyBtn,
            "rabbit": rabbitBtn,
            "red": redBtn,
            "blue": blueBtn,
        };
        betButtonGroup: BetButton;
        const betButtonGroup = [hawkBtn, lionBtn, chickenBtn, ostrichBtn, owlBtn, pandaBtn, monkeyBtn, rabbitBtn, blueBtn, redBtn];
        const submitBtn = this.add.image(1020, 560, 'main', 'btn-submit.png').setInteractive().setDepth(9).setScale(.8).setInteractive();
        const autoBtn = this.add.image(1020, 560 - 200, 'main', 'btn-auto.png').setInteractive().setDepth(9).setScale(.8).setInteractive();
        const stopBtn = this.add.image(1020, 560 - 200, 'main', 'btn-stop.png').setVisible(false).setInteractive().setDepth(9).setScale(.8).setInteractive();
        const clearBtn = this.add.image(1020, 560 - 100, 'main', 'btn-clear.png').setInteractive().setDepth(9).setScale(.8).setInteractive();
        let chipEffects;
        chipEffects = [];
        function chipData(selected, amt) {
            return {
                isSelected: selected,
                amount: amt
            };
        }
        const chipButtonGroup = this.add.group();
        const chip1 = this.add.image(global.center.x - 255, 595, 'chips', 'chip-1.png').setData({ 'isSelected': true, 'amount': 1 }).setDepth(16).setScale(1).setInteractive();
        const chip5 = this.add.image(global.center.x - 170, 595, 'chips', 'chip-5.png').setData({ 'isSelected': false, 'amount': 5 }).setDepth(16).setScale(.7).setInteractive();
        const chip10 = this.add.image(global.center.x - 85, 595, 'chips', 'chip-10.png').setData({ 'isSelected': false, 'amount': 10 }).setDepth(16).setScale(.7).setInteractive();
        const chip50 = this.add.image(global.center.x, 595, 'chips', 'chip-50.png').setData({ 'isSelected': false, 'amount': 50 }).setDepth(16).setScale(.7).setInteractive();
        const chip100 = this.add.image(global.center.x + 85, 595, 'chips', 'chip-100.png').setData({ 'isSelected': false, 'amount': 100 }).setDepth(16).setScale(.7).setInteractive();
        const chip500 = this.add.image(global.center.x + 170, 595, 'chips', 'chip-500.png').setData({ 'isSelected': false, 'amount': 500 }).setDepth(16).setScale(.7).setInteractive();
        const chip1000 = this.add.image(global.center.x + 255, 595, 'chips', 'chip-1000.png').setData({ 'isSelected': false, 'amount': 1000 }).setDepth(16).setScale(.7).setInteractive();
        chipButtonGroup.addMultiple([chip1, chip5, chip10, chip50, chip100, chip500, chip1000]);
        global.chipPosition.x = chip1.x;
        global.chipPosition.y = chip1.y;
        chipButtonGroup.getChildren().forEach((item, i) => {
            var _a;
            const sprite = item;
            chipEffects[i] = (_a = sprite.postFX) === null || _a === void 0 ? void 0 : _a.addBloom(0x000000, 0, 0, 10, 1);
            chipEffects[0].strength = 2;
            sprite.on('pointerdown', () => {
                if (noBalanceModal.visible || sprite.data.values.isSelected)
                    return;
                chipButtonGroup.getChildren().forEach((_item, ii) => {
                    const s = _item;
                    s.setScale(.7);
                    s.data.values.isSelected = false;
                    const bloom = chipEffects[ii];
                    bloom.strength = 1;
                });
                this.sound.play('all-sfx', sfxMarker[3]);
                global.currentChipValue = sprite.data.values.amount;
                global.chipPosition.x = sprite.x;
                global.chipPosition.y = sprite.y;
                sprite.data.values.isSelected = true;
                sprite.setActive(true);
                sprite.setScale(1);
                chipEffects[i].strength = 2;
                console.log(global.currentChipValue);
            }).on('pointerover', () => {
                if (sprite.data.values.isSelected)
                    return;
                sprite.setScale(.9);
            }).on('pointerout', () => {
                if (sprite.data.values.isSelected)
                    return;
                sprite.setScale(.7);
            });
        });
        const boxGroup = this.add.group({
            key: 'main',
            frame: 'box2.png',
            quantity: 26,
            setXY: {
                x: 0,
                y: 0
            },
            setOrigin: {
                x: .5,
                y: .5
            },
            setScale: {
                x: 1,
                y: 1
            }
        });
        const highlightBox = this.add.group({
            key: 'main',
            frame: 'box-selected.png',
            quantity: 26,
            setXY: {
                x: 0,
                y: 0
            },
            setOrigin: {
                x: .5,
                y: .5
            },
            setScale: {
                x: 1,
                y: 1
            },
            setAlpha: {
                value: 0
            }
        });
        this.highlightBoxTweenGroup = [];
        highlightBox.getChildren().forEach((item, i) => {
            const itemSprite = item;
            const itemTween = this.tweens.add({
                targets: itemSprite,
                alpha: 1,
                yoyo: true,
                duration: 200,
                callbackScope: this,
                onStart: (tween) => {
                },
                onComplete: () => {
                    itemTween.restart().pause();
                },
                paused: true
            });
            this.highlightBoxTweenGroup.push(itemTween);
        });
        const animalGroup = this.add.group({
            key: 'animals',
            frame: ['hawk.png', 'owl.png', 'chicken.png', 'ostrich.png', 'egg.png', 'panda.png', 'monkey.png', 'rabbit.png', 'lion.png',
                'owl.png', 'ostrich.png', 'panda.png', 'rabbit.png',
                'hawk.png', 'owl.png', 'chicken.png', 'ostrich.png', 'egg.png', 'panda.png', 'monkey.png', 'rabbit.png', 'lion.png',
                'owl.png', 'chicken.png', 'monkey.png', 'rabbit.png'
            ],
            setXY: {
                x: 0,
                y: 0
            },
            setOrigin: {
                x: .5,
                y: .5
            },
            setScale: {
                x: 1,
                y: 1
            },
            setDepth: {
                value: 10
            }
        }).setVisible(false);
        Phaser.Actions.PlaceOnRectangle(animalGroup.getChildren(), new Phaser.Geom.Rectangle(165, 45, 751, 475));
        Phaser.Actions.PlaceOnRectangle(boxGroup.getChildren(), new Phaser.Geom.Rectangle(165, 48, 751, 475));
        Phaser.Actions.PlaceOnRectangle(highlightBox.getChildren(), new Phaser.Geom.Rectangle(165, 48, 751, 475));
        animalGroup.getChildren().forEach((item, i) => {
            const sprite = item;
            if (sprite.frame.name === 'egg.png') {
                sprite.setVisible(true);
            }
        });
        const eggSpine = this.add.spine(0, 0, 'egg-spine', 'idle', false).setDepth(9).setVisible(false);
        const hawkSpine1 = this.add.spine(165, 45, 'hawk-spine', 'idle', true).setScale(.22).setDepth(9);
        const owlSpine1 = this.add.spine(260, 45, 'owl-spine', 'idle', true).setScale(.4).setDepth(9);
        const chickenSpine1 = this.add.spine(353, 45, 'chicken-spine', 'idle2', true).setScale(.42).setDepth(9);
        const ostrichSpine1 = this.add.spine(449, 50, 'ostrich-spine', 'idle', true).setScale(.4).setDepth(9);
        const pandaSpine1 = this.add.spine(636, 47, 'animal-spine', 'idle', true).setScale(.4).setSkinByName('panda').setDepth(9);
        const monkeySpine1 = this.add.spine(730, 50, 'monkey-spine', 'idle', true).setScale(.4).setDepth(9);
        const rabbitSpine1 = this.add.spine(825, 50, 'animal-spine', 'idle', true).setScale(.4).setSkinByName('rabbit').setDepth(9);
        const lionSpine1 = this.add.spine(915, 47, 'lion-spine', 'idle', true).setScale(.4).setDepth(9);
        const owlSpine2 = this.add.spine(915, 142, 'owl-spine', 'idle', true).setScale(.4).setDepth(9);
        const ostrichSpine2 = this.add.spine(915, 237, 'ostrich-spine', 'idle', true).setScale(.4).setDepth(9);
        const pandaSpine2 = this.add.spine(915, 335, 'animal-spine', 'idle', true).setScale(.4).setSkinByName('panda').setDepth(9);
        const rabbitSpine2 = this.add.spine(915, 425, 'animal-spine', 'idle', true).setScale(.4).setSkinByName('rabbit').setDepth(9);
        const hawkSpine2 = this.add.spine(915, 520, 'hawk-spine', 'idle', true).setScale(.22).setDepth(9);
        const owlSpine3 = this.add.spine(820, 520, 'owl-spine', 'idle', true).setScale(.4).setDepth(9);
        const chickenSpine2 = this.add.spine(727, 523, 'chicken-spine', 'idle2', true).setScale(.42).setDepth(9);
        const ostrichSpine3 = this.add.spine(633, 522, 'ostrich-spine', 'idle', true).setScale(.4).setDepth(9);
        const pandaSpine3 = this.add.spine(445, 520, 'animal-spine', 'idle', true).setScale(.4).setSkinByName('panda').setDepth(9);
        const monkeySpine2 = this.add.spine(350, 520, 'monkey-spine', 'idle', true).setScale(.4).setDepth(9);
        const rabbitSpine3 = this.add.spine(257, 520, 'animal-spine', 'idle', true).setScale(.4).setSkinByName('rabbit').setDepth(9);
        const lionSpine2 = this.add.spine(165, 518, 'lion-spine', 'idle', true).setScale(.4).setDepth(9);
        const owlSpine4 = this.add.spine(165, 420, 'owl-spine', 'idle', true).setScale(.4).setDepth(9);
        const chickenSpine3 = this.add.spine(163, 328, 'chicken-spine', 'idle', true).setScale(.42).setDepth(9);
        const monkeySpine3 = this.add.spine(165, 237, 'monkey-spine', 'idle', true).setScale(.4).setDepth(9);
        const rabbitSpine4 = this.add.spine(165, 142, 'animal-spine', 'idle', true).setScale(.4).setSkinByName('rabbit').setDepth(9);
        const loseMsg = this.add.image(global.center.x, global.center.y - 80, "main", 'lose-msg.png').setDepth(9).setVisible(false);
        const winModal = this.add.container();
        this.anims.create({
            key: 'flip',
            frameRate: 30,
            frames: this.anims.generateFrameNumbers('coin'),
            repeat: -1
        });
        const coinEmitter = this.add.particles(0, 0, 'coin', {
            x: global.center.x - 80,
            y: global.center.y,
            frequency: -1,
            scale: .3,
            lifespan: { min: 700, max: 1200 },
            speed: { min: 250, max: 400 },
            rotate: { start: 1, end: 270 },
            moveToX: 30,
            moveToY: 590
        }).setDepth(99).setAnim('flip');
        balanceCoin.play('flip');
        const winGlitterEmitter = this.add.particles(0, 0, 'main', {
            x: global.center.x,
            y: global.center.y - 40,
            frame: ['glitter.png'],
            frequency: -1,
            quantity: 2,
            scale: { start: 1, end: 0 },
            lifespan: { min: 700, max: 1200 },
            speed: { min: 150, max: 300 },
            rotate: { start: 1, end: 270 },
            blendMode: "SCREEN"
        });
        const r1 = this.add.image(global.center.x, global.center.y - 40, 'main', 'rays1.png').setBlendMode("ADD").setScale(2.5).setVisible(true);
        const r2 = this.add.image(global.center.x, global.center.y - 40, 'main', 'rays2.png').setBlendMode("SCREEN").setScale(3).setVisible(true);
        const winbg = this.add.image(global.center.x, global.center.y - 30, 'main', 'win-bg.png').setScale(1.2);
        const ribbon = this.add.image(global.center.x, global.center.y - 85, 'main', 'ribbon-red.png').setScale(1.2);
        const winAnimal = this.add.image(global.center.x - 50, global.center.y - 95, 'animals', 'egg.png').setScale(1);
        const winAmountDisplay = this.add.bitmapText(global.center.x, global.center.y - 32, 'skarjan', '10000', 28).setOrigin(.5);
        winModal.add([winGlitterEmitter, r1, r2, winbg, ribbon, winAnimal, winAmountDisplay]);
        winModal.setVisible(false).setDepth(8);
        const r1Tween = this.tweens.add({
            targets: r1,
            duration: 2000,
            repeat: -1,
            rotation: Phaser.Math.DegToRad(360)
        }).pause();
        const r2Tween = this.tweens.add({
            targets: r2,
            duration: 2000,
            repeat: -1,
            rotation: Phaser.Math.DegToRad(-360),
        }).pause();
        submitBtn.on('pointerdown', () => {
            if (global.onProcess || noBalanceModal.visible)
                return;
            console.log("submit Btn");
            const betStatus = submitBets();
            console.log(betStatus);
            if (betStatus === 'nobalance') {
                return noBalanceModal.setVisible(true), this.sound.play('all-sfx', sfxMarker[7]);
            }
            if (betStatus === 'nobets') {
                return noBet.setVisible(true), this.sound.play('all-sfx', sfxMarker[7]);
            }
            this.sound.play('all-sfx', sfxMarker[1]);
            submitBtn.setFrame('btn-submit-selected.png');
            disableButtons();
            startProcess();
        });
        clearBtn.on('pointerdown', () => {
            if (global.onProcess || noBalanceModal.visible)
                return;
            this.sound.play('all-sfx', sfxMarker[4]);
            ClearAllChips();
            clearBtn.setFrame('btn-clear-selected.png');
        }).on('pointerup', () => {
            clearBtn.setFrame('btn-clear.png');
        }).on('pointerout', () => {
            clearBtn.setFrame('btn-clear.png');
        });
        autoBtn.on('pointerdown', () => {
            if (global.onProcess || noBalanceModal.visible)
                return;
            console.log("submit Btn");
            const betStatus = submitBets();
            console.log(betStatus);
            if (betStatus === 'nobalance') {
                return noBalanceModal.setVisible(true), this.sound.play('all-sfx', sfxMarker[7]);
            }
            if (betStatus === 'nobets') {
                return noBet.setVisible(true), this.sound.play('all-sfx', sfxMarker[7]);
            }
            this.sound.play('all-sfx', sfxMarker[1]);
            global.isAutoProcess = true;
            autoBtn.setVisible(false);
            stopBtn.setVisible(true);
            disableButtons();
            startProcess();
        });
        stopBtn.on('pointerdown', () => {
            if (stopBtn.isTinted)
                return;
            this.sound.play('all-sfx', sfxMarker[6]);
            stopBtn.setTint(Phaser.Display.Color.GetColor(100, 100, 100));
            global.isAutoProcess = false;
        });
        const disableButtons = (isDisable = true) => {
            if (isDisable) {
                submitBtn.setTint(Phaser.Display.Color.GetColor(100, 100, 100));
                clearBtn.setTint(Phaser.Display.Color.GetColor(100, 100, 100));
                autoBtn.setTint(Phaser.Display.Color.GetColor(100, 100, 100));
            }
            else {
                submitBtn.clearTint();
                clearBtn.clearTint();
                autoBtn.clearTint();
            }
        };
        const StartSelection = (animalIndex = null) => {
            clearHighlightBox();
            let chimeCounter = -1;
            this.tweens.addCounter({
                from: 0,
                to: highlightBox.getChildren().length - 1,
                duration: 2500,
                ease: 'Linear',
                onUpdate: (tweens, targets) => {
                    const index = Math.floor(targets.value);
                    if (chimeCounter != index) {
                        this.sound.play('all-sfx', sfxMarker[2]);
                    }
                    chimeCounter = index;
                    this.highlightBoxTweenGroup[index].play();
                },
                onComplete: () => {
                    if (animalIndex === null)
                        return;
                    EndSelection(animalIndex);
                }
            });
        };
        const RaysEffect = (isActive = true, x = 0, y = 0) => {
            if (isActive) {
                rays1.setVisible(true);
                rays2.setVisible(true);
                ray1Tween.play();
                ray2Tween.play();
                rays1.setPosition(x, y);
                rays2.setPosition(x, y);
                glitterEmitter.flow(60).setPosition(x, y);
            }
            else {
                rays1.setVisible(false);
                rays2.setVisible(false);
                ray1Tween.pause();
                ray2Tween.pause();
                glitterEmitter.flow(-1);
            }
        };
        const EndSelection = (animalIndex) => {
            let duration = (animalIndex < 5) ? 1000 : (animalIndex < 15) ? 2000 : 3000;
            let counter;
            let chimeCounter = -1;
            console.log(`animalIndex : ${animalIndex}`);
            this.tweens.addCounter({
                from: 0,
                to: animalIndex,
                duration: duration,
                ease: 'Sine.out',
                onUpdateScope: this,
                onUpdate: (tweens, targets, obj) => {
                    const index = Math.floor(targets.value);
                    if (counter !== index) {
                        this.sound.play('all-sfx', sfxMarker[2]);
                        if (!this.highlightBoxTweenGroup[index].isPlaying()) {
                            this.highlightBoxTweenGroup[index].duration = 3000;
                            this.highlightBoxTweenGroup[index].restart();
                            this.highlightBoxTweenGroup[index].play();
                        }
                    }
                    counter = index;
                },
                onComplete: () => {
                    const sbox = highlightBox.getChildren()[animalIndex];
                    sbox.setAlpha(1);
                    shakeAnimal(animalIndex);
                }
            });
        };
        const ShowWinAmount = (winAmount = 0, animal = 'egg') => {
            winModal.setVisible(true);
            r1Tween.play();
            r2Tween.play();
            console.log(animal);
            switch (animal) {
                case "hawk":
                case "owl":
                case "ostrich":
                case "chicken":
                    ribbon.setFrame('ribbon-blue.png');
                    break;
                default:
                    ribbon.setFrame('ribbon-red.png');
                    break;
            }
            winAnimal.setFrame(`${animal}.png`);
            winbg.setScale(0);
            ribbon.setScale(0);
            winAnimal.setScale(0);
            winGlitterEmitter.flow(200, 2);
            this.tweens.add({
                targets: [winbg, ribbon, winAnimal],
                duration: 300,
                ease: 'Back',
                easeParams: [5],
                scaleX: 1,
                scaleY: 1,
            });
            winAmountDisplay.setText("0");
            this.tweens.addCounter({
                from: 0,
                to: winAmount,
                duration: 1000,
                delay: 200,
                onStart: () => { },
                onUpdate: (tween, data) => {
                    winAmountDisplay.setText(data.value.toFixed(2));
                },
                onComplete: () => {
                    coinEmitter.flow(100);
                    setTimeout(() => {
                        balanceCoin.setVisible(true);
                        balanceGlitterEmitter.flow(10);
                    }, 1000);
                }
            });
        };
        const HideWinAmount = () => {
            coinEmitter.flow(-1);
            setTimeout(() => {
                balanceCoin.setVisible(false);
                balanceGlitterEmitter.flow(-1);
            }, 1000);
            this.tweens.add({
                targets: [winbg, ribbon, winAnimal],
                duration: 300,
                ease: 'Back',
                easeParams: [5],
                scaleX: 0,
                scaleY: 0,
                onComplete: () => {
                    winModal.setVisible(false);
                    winGlitterEmitter.flow(-1);
                    r1Tween.pause();
                    r2Tween.pause();
                }
            });
        };
        const shakeAnimal = (animalIndex) => {
            const sprite = animalGroup.getChildren()[animalIndex];
            if (apiResult.sprite === 'egg.png') {
                sprite.setVisible(false);
                eggSpine.setPosition(sprite.x, sprite.y).setVisible(true);
                eggSpine.play('break', false);
            }
            else {
                sprite.setVisible(true);
            }
            RaysEffect(true, sprite.x, sprite.y);
            this.sound.play('all-sfx', sfxMarker[8]);
            sprite.setAngle(-10);
            this.tweens.add({
                targets: animalGroup.getChildren()[animalIndex],
                rotation: {
                    value: Phaser.Math.DegToRad(10),
                    duration: 100,
                    repeat: 6,
                    yoyo: true,
                },
                scaleX: {
                    value: 1.3,
                    duration: 250,
                    yoyo: true,
                    repeat: 2,
                },
                scaleY: {
                    value: 1.3,
                    duration: 250,
                    yoyo: true,
                    repeat: 2,
                },
                onComplete: () => {
                    this.tweens.add({
                        targets: animalGroup.getChildren()[animalIndex],
                        rotation: 0,
                        duration: 100,
                    });
                    RaysEffect(false);
                    resultCallback();
                }
            });
        };
        const startProcess = () => {
            global.onProcess = true;
            const dummy = DummyData.getResult();
            console.log(dummy);
            apiResult.sprite = dummy.sprite;
            apiResult.index = dummy.groupIndex;
            StartSelection(apiResult.index);
        };
        const autoProcess = () => {
            console.log('AUTO PROCESS');
            const betStatus = submitBets();
            console.log(betStatus);
            if (betStatus === 'nobalance') {
                global.isAutoProcess = false;
                global.onProcess = false;
                noBalanceModal.setVisible(true);
                stopBtn.setVisible(false).clearTint();
                autoBtn.setVisible(true);
                disableButtons(false);
                this.sound.play('all-sfx', sfxMarker[7]);
                return;
            }
            else if (betStatus === 'nobets') {
                global.isAutoProcess = false;
                global.onProcess = false;
                noBet.setVisible(true);
                stopBtn.setVisible(false).clearTint();
                autoBtn.setVisible(true);
                disableButtons(false);
                this.sound.play('all-sfx', sfxMarker[7]);
                return;
            }
            this.sound.play('all-sfx', sfxMarker[1]);
            autoBtn.setVisible(false);
            stopBtn.setVisible(true);
            disableButtons();
            startProcess();
        };
        const reBet = () => {
            console.log(betHistory);
            BetOrder.TotalBetAmount = 0;
            for (let animal in betHistory) {
                const amount = betHistory[animal];
                console.log(`bet amount ${animal} : ${amount}`);
                if (amount > 0) {
                    animalButton[animal].ClearBets();
                    animalButton[animal].AddBet(amount);
                }
            }
            console.warn("REBET FINISH");
            console.log(BetOrder.TotalBetAmount);
        };
        const submitBets = () => {
            let status = "success";
            betButtonGroup.forEach((item, i) => {
                bet[item.animalType] = item.totalBet;
            });
            const order = BetOrder.PlaceBets(bet);
            console.log(`total SUbmit bets: ${order.totalAmount}`);
            if (order.totalAmount > displaybalance.balance) {
                status = "nobalance";
            }
            if (order.totalAmount === 0) {
                status = "nobets";
            }
            betHistory = bet;
            displaybalance.Deduct(order.totalAmount);
            return status;
        };
        const clearHighlightBox = () => {
            highlightBox.getChildren().forEach((item) => {
                const boxHiglights = item;
                boxHiglights.setAlpha(0);
            });
        };
        const ClearAllChips = () => {
            betButtonGroup.forEach((btn) => {
                btn.ClearBets();
            });
            BetOrder.TotalBetAmount = 0;
            totalBetDisplayUI.setText(BetOrder.TotalBetAmount.toString());
        };
        const readyProcess = () => {
            animalGroup.getChildren().forEach((item, i) => {
                const sprite = item;
                if (sprite.frame.name === 'egg.png') {
                    sprite.setVisible(true);
                }
                else {
                    sprite.setVisible(false);
                }
            });
            loseMsg.setVisible(false);
            eggSpine.setVisible(false);
            submitBtn.setFrame('btn-submit.png');
            ClearAllChips();
            HideWinAmount();
            betButtonGroup.forEach((item, i) => {
                const btn = item;
                btn.WinEffect(false);
            });
            if (global.isAutoProcess) {
                setTimeout(() => {
                    reBet();
                    setTimeout(() => {
                        autoProcess();
                    }, 200);
                }, 1500);
            }
            else {
                disableButtons(false);
                autoBtn.setVisible(true);
                stopBtn.setVisible(false).clearTint();
                global.onProcess = false;
                global.isAutoProcess = false;
            }
        };
        const resultCallback = () => {
            const animalName = apiResult.sprite.slice(0, -4);
            console.log(animalName);
            let totalWin = 0;
            historyPanel.AddHistory(animalName);
            if (animalName !== "egg") {
                const winColor = BetOrder.WinningColor(animalName);
                if (BetOrder.BetData[animalName] > 0) {
                    console.log('WINNER Animal');
                    animalButton[animalName].WinEffect(true, true);
                    const bet = BetOrder.BetData[animalName];
                    const winAmount = BetOrder.WinningOdds(animalName) * bet;
                    console.log(`result: ${animalName}, bet: %c${bet} %cx ${BetOrder.WinningOdds(animalName)}, %cwinAmount: ${winAmount}`, 'color: green', 'color: red', 'background-color: yellow; color : black;padding : 5px 10px');
                    totalWin += winAmount;
                    displaybalance.Add(winAmount);
                }
                else {
                    animalButton[animalName].WinEffect();
                }
                if (BetOrder.BetData[winColor] > 0) {
                    console.log('WINNER Color');
                    animalButton[winColor].WinEffect(true, true);
                    const bet = BetOrder.BetData[winColor];
                    const winAmount = BetOrder.WinningOdds(winColor) * bet;
                    console.log(`result: ${winColor}, bet: %c${bet} %cx ${BetOrder.WinningOdds(winColor)}, %cwinAmount: ${winAmount}`, 'color: green', 'color: red', 'background-color: ' + winColor + '; color : #fff ;padding : 5px 10px');
                    totalWin += winAmount;
                    displaybalance.Add(winAmount);
                }
                else {
                    animalButton[winColor].WinEffect();
                }
                if (BetOrder.BetData[animalName] > 0 || BetOrder.BetData[winColor] > 0) {
                    ShowWinAmount(totalWin, animalName);
                }
                else {
                    loseMsg.setVisible(true);
                }
                if (BetOrder.BetData[winColor] > 0 || BetOrder.BetData[animalName] > 0) {
                    this.sound.play('all-sfx', sfxMarker[9]);
                }
            }
            setTimeout(() => {
                readyProcess();
            }, 3000);
        };
        (_a = this.input.keyboard) === null || _a === void 0 ? void 0 : _a.on("keydown", (event) => {
            if (event.key === 'Enter') {
                const dummy = DummyData.getResult();
                console.log(dummy);
                historyPanel.AddHistory(dummy.sprite.slice(0, -4));
            }
            if (event.key === '1') {
                redBtn.WinEffect();
            }
            if (event.key === '2') {
                redBtn.WinEffect(false);
            }
            if (event.key === ' ') {
                autoProcess();
            }
            if (event.key === 'r') {
                reBet();
            }
        });
    }
    update(time, delta) {
    }
}
class BetButton extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, animalType, multiplier) {
        var _a, _b;
        super(scene, x, y, texture);
        this.totalBet = 0;
        this.maxBet = 1000;
        this.x = x;
        this.y = y;
        this.scene = scene;
        this.animalType = animalType;
        this.buttonSprite = scene.add.sprite(this.x, this.y, "main", texture).setInteractive();
        this.chipSpriteGroup = scene.add.group();
        const fx = (_a = this.buttonSprite.preFX) === null || _a === void 0 ? void 0 : _a.addBloom(0xffffff, 0, 0, 1.3, 1).setActive(false);
        this.fxPost = (_b = this.buttonSprite.postFX) === null || _b === void 0 ? void 0 : _b.addBloom(0xffffff, 0, 0, 1, 1);
        this.particleEmitter = this.scene.add.particles(0, 0, 'main', {
            frame: 'glitter.png',
            frequency: -150,
            quantity: 20,
            lifespan: { min: 1200, max: 1500 },
            speed: { min: 10, max: 30 },
            scale: { start: .8, end: 0 },
            emitZone: {
                source: this.buttonSprite.getBounds(),
                type: 'edge',
                quantity: 60,
            },
            gravityY: -20,
            blendMode: 'SCREEN',
        }).setDepth(2);
        this.flicker = this.scene.tweens.add({
            targets: this.fxPost,
            strength: 2,
            duration: 100,
            yoyo: true,
            repeat: -1,
            ease: 'sine.inout',
            paused: true,
        });
        this.buttonSprite.on('pointerdown', () => {
            if (global.onProcess || noBalanceModal.visible)
                return;
            if (noBet.visible) {
                noBet.setVisible(false);
            }
            this.AddBet();
        }).on('pointerover', () => {
            if (global.onProcess)
                return;
            fx === null || fx === void 0 ? void 0 : fx.setActive(true);
        }).on('pointerout', () => {
            fx === null || fx === void 0 ? void 0 : fx.setActive(false);
        });
        scene.add.existing(this.buttonSprite);
        this.totalBetDisplay = scene.add.text(this.x - (this.buttonSprite.width / 2) + 25, this.y - (this.buttonSprite.height / 2) + 11, this.totalBet.toString(), {
            color: "#ffffff",
            fontSize: 13,
            fontFamily: 'Tahoma, Arial, Sans-serif',
        }).setOrigin(0, .5).setShadow(0, 2, "#000000", 3, false, true);
        this.maxText = this.scene.add.text(this.x, this.y, '已达上限', {
            color: "#ffffff",
            fontSize: 18,
            fontStyle: 'bolder',
        }).setOrigin(.5).setVisible(false).setDepth(2).setShadow(0, 1, '#000', 3, false, true);
    }
    preUpdate(time, delta) {
        super.preUpdate(time, delta);
    }
    AddBet(amount = 0) {
        if (this.totalBet >= this.maxBet)
            return this.scene.sound.play('all-sfx', sfxMarker[0]);
        if (amount > 0) {
            this.totalBet = 0;
            if (amount >= this.maxBet) {
                this.totalBet = this.maxBet;
                BetOrder.TotalBetAmount += this.maxBet;
                this.maxText.setVisible(true);
                this.buttonSprite.setTint(Phaser.Display.Color.GetColor(150, 150, 150));
            }
            else {
                this.totalBet += amount;
                BetOrder.TotalBetAmount += amount;
            }
            this.AmountToChips(this.totalBet);
        }
        else {
            if (this.maxBet > this.totalBet + global.currentChipValue) {
                this.totalBet += global.currentChipValue;
                BetOrder.TotalBetAmount += global.currentChipValue;
                this.ChipEffect();
            }
            else {
                BetOrder.TotalBetAmount -= this.totalBet;
                this.ClearBets();
                this.totalBet = this.maxBet;
                BetOrder.TotalBetAmount += this.totalBet;
                this.ChipEffect(this.totalBet);
                this.maxText.setVisible(true);
                this.buttonSprite.setTint(Phaser.Display.Color.GetColor(150, 150, 150));
            }
        }
        totalBetDisplayUI.setText(BetOrder.TotalBetAmount.toFixed(2).toString());
        this.scene.sound.play('all-sfx', sfxMarker[5]);
        this.scene.sound.play('all-sfx', sfxMarker[3]);
        this.totalBetDisplay.setText(this.totalBet.toString());
    }
    ChipEffect(chipDenom) {
        const chipSprite = (chipDenom) ? `chip-${chipDenom}.png` : `chip-${global.currentChipValue}.png`;
        const chip = this.scene.add.sprite(global.chipPosition.x, global.chipPosition.y, 'chips', chipSprite).setScale(.15);
        const imgBounds = this.buttonSprite.getBounds();
        const randomX = Phaser.Math.RND.between(imgBounds.left + 25, imgBounds.right - 25);
        const randomY = Phaser.Math.RND.between(imgBounds.top + 25, imgBounds.bottom - 25);
        this.chipSpriteGroup.addMultiple([chip]);
        this.scene.tweens.add({
            targets: chip,
            duration: 500,
            ease: 'Sine.out',
            x: randomX,
            y: randomY,
            rotation: Phaser.Math.DegToRad(Phaser.Math.Between(90, 360) * 3),
        });
    }
    WinEffect(isOn = true, withParticle = false) {
        if (isOn) {
            if (withParticle) {
                this.particleEmitter.flow(5, 2);
            }
            this.flicker.play();
        }
        else {
            this.particleEmitter.flow(-1);
            this.flicker.restart();
            this.flicker.pause();
            this.fxPost.strength = 1;
        }
    }
    ClearBets() {
        this.totalBet = 0;
        this.totalBetDisplay.setText(this.totalBet.toString());
        this.chipSpriteGroup.clear(true, true);
        this.maxText.setVisible(false);
        this.buttonSprite.clearTint();
    }
    AmountToChips(amount) {
        const chipDenom = AmountToDenom(amount);
        console.log(chipDenom);
        chipDenom.forEach((denom, i) => {
            console.log(i);
            this.ChipEffect(denom);
        });
    }
}
function AmountToDenom(amount) {
    let total = amount;
    const result = [];
    while (total > 0) {
        if (total >= 1000) {
            total -= 1000;
            result.push(1000);
        }
        else if (total >= 500) {
            total -= 500;
            result.push(500);
        }
        else if (total >= 100) {
            total -= 100;
            result.push(100);
        }
        else if (total >= 50) {
            total -= 50;
            result.push(50);
        }
        else if (total >= 10) {
            total -= 10;
            result.push(10);
        }
        else if (total >= 5) {
            total -= 5;
            result.push(5);
        }
        else {
            total -= 1;
            result.push(1);
        }
    }
    return result;
}
class HistoryPanel extends Phaser.GameObjects.GameObject {
    constructor(scene, type, x, y) {
        super(scene, type);
        this.animalHistory = [];
        this.x = x;
        this.y = y;
        const bg = scene.add.image(this.x, this.y, "main", 'history-bg.png').setOrigin(0, .5);
        this.animalGroup = scene.add.group();
        this.colorGroup = scene.add.group();
    }
    AddHistory(animal) {
        const getColor = (animal) => {
            let res = 'blank';
            if (animal === 'hawk' || animal === 'chicken' || animal === 'ostrich' || animal === 'owl') {
                res = 'blue';
            }
            if (animal === 'lion' || animal === 'panda' || animal === 'monkey' || animal === 'rabbit') {
                res = 'red';
            }
            return res;
        };
        const maxHistoryCount = 23;
        this.animalHistory.unshift(animal);
        this.animalHistory.splice(maxHistoryCount, this.animalHistory.length - maxHistoryCount);
        this.colorGroup.clear(true, true);
        this.animalGroup.clear(true, true);
        this.animalHistory.forEach((animal, i) => {
            const animalImg = this.scene.add.image(this.x, this.y, 'history-marker', `${animal}.png`);
            const colorImg = this.scene.add.image(this.x, this.y, 'history-marker', `${getColor(animal)}.png`).setScale(.9);
            if (i === 0) {
                this.scene.tweens.add({
                    targets: [colorImg, animalImg],
                    duration: 200,
                    scaleX: 1.3,
                    scaleY: 1.3,
                    yoyo: true,
                });
            }
            this.animalGroup.addMultiple([animalImg]);
            this.colorGroup.addMultiple([colorImg]);
        });
        Phaser.Actions.SetXY(this.colorGroup.getChildren(), this.x + 15, this.y - 10, 28);
        Phaser.Actions.SetXY(this.animalGroup.getChildren(), this.x + 15, this.y + 10, 28);
    }
}
