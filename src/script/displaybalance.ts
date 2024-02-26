export default class DisplayBalance extends Phaser.GameObjects.GameObject{
    balanceDisplay!: Phaser.GameObjects.Text
    balance !: number;
    scene: Phaser.Scene;
    x !: number;
    y !: number;
    constructor(scene : Phaser.Scene, type: string){
        super(scene,type)

        this.scene = scene
        this.balanceDisplay = this.scene.add.text(0,0,'',{
            color : "#ecbc1d",
            fontSize : 20,
            fontFamily : "Arial,Trebuchet,Sans-serif",
        }).setOrigin(.5) 

    }
    Init( x : number, y : number , balance : number, depth : number = 1 ){
        this.x = x;
        this.y = y;
        this.balance = balance;
        this.balanceDisplay.setPosition(this.x,this.y).setDepth( depth );
        this.balanceDisplay.setText( this.balance.toString() );
    }
    Deduct( amount : number =0){
        if(this.balance >= amount){
            this.balance-=amount
        }
        this.balanceDisplay.setText(this.balance.toFixed(2).toString());
    }
    Add( amount : number=0){
        this.balance+=amount;
        this.balanceDisplay.setText(this.balance.toFixed(2).toString());
    }
    
}