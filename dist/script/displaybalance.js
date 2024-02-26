export default class DisplayBalance extends Phaser.GameObjects.GameObject {
    constructor(scene, type) {
        super(scene, type);
        this.scene = scene;
        this.balanceDisplay = this.scene.add.text(0, 0, '', {
            color: "#ecbc1d",
            fontSize: 20,
            fontFamily: "Arial,Trebuchet,Sans-serif",
        }).setOrigin(.5);
    }
    Init(x, y, balance, depth = 1) {
        this.x = x;
        this.y = y;
        this.balance = balance;
        this.balanceDisplay.setPosition(this.x, this.y).setDepth(depth);
        this.balanceDisplay.setText(this.balance.toString());
    }
    Deduct(amount = 0) {
        if (this.balance >= amount) {
            this.balance -= amount;
        }
        this.balanceDisplay.setText(this.balance.toFixed(2).toString());
    }
    Add(amount = 0) {
        this.balance += amount;
        this.balanceDisplay.setText(this.balance.toFixed(2).toString());
    }
}
