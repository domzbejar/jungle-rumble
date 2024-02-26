import { RIGHT } from "phaser";
import DummyData from "./helper/dummyData.js";

interface Global {
    size : {
        width : number ,
        height : number ,
    },
    center : {
        x : number ,
        y : number ,
    }
}

const global : Global = {
    size :{
        width : 1080,
        height : 610
    },
    center : {
        x : 0 ,
        y : 0 ,
    }
}
global.center.x = global.size.width / 2;
global.center.y = global.size.height / 2;

export default class MainScene extends Phaser.Scene{
    highlightBoxTweenGroup : Phaser.Tweens.Tween[] = [];
    constructor(){
        super({
            key : 'MainScene'
        })
    }
    preload(){
        this.load.setPath('assets/textures');
        this.load.image('bg2.png','bg2.png');
        this.load.image('trees.png','trees.png');

        this.load.atlas('animals','animals.png','animals.json');
        this.load.image('box.png','box.png'); // original box.png
        this.load.image('box-selected.png','box-selected.png');

        this.load.image('history-bg.png','history-bg.png');
        this.load.image('btn-hawk.png','btn-hawk.png');
        this.load.image('btn-gold.png','btn-gold.png');
        this.load.image('btn-lion.png','btn-lion.png');
        this.load.image('btn-chicken.png','btn-chicken.png');
        this.load.image('btn-ostrich.png','btn-ostrich.png');
        this.load.image('btn-owl.png','btn-owl.png');
        this.load.image('btn-panda.png','btn-panda.png');
        this.load.image('btn-monkey.png','btn-monkey.png');
        this.load.image('btn-rabbit.png','btn-rabbit.png');
        this.load.image('btn-red.png','btn-red.png');
        this.load.image('btn-blue.png','btn-blue.png');

        this.load.atlas('chips','chips.png','chips.json');
    }
    create(){
        this.add.image( global.center.x, global.center.y,"bg2.png");
        this.add.image( global.center.x, global.center.y,"trees.png").setDepth(2).setScale(1.02);

        this.add.image(global.center.x,130,'history-bg.png').setOrigin(.5);
        const hawkBtn = this.add.image(global.center.x-220,210,'btn-hawk.png').setInteractive();
        const goldBtn = this.add.image(global.center.x,210,'btn-gold.png').setInteractive();
        const lionBtn = this.add.image(global.center.x+220,210,'btn-lion.png').setInteractive();

        const chickenBtn = this.add.image(global.center.x-275,315,'btn-chicken.png').setInteractive();
        const ostrichBtn = this.add.image(global.center.x-165,315,'btn-ostrich.png').setInteractive();
        const owlBtn = this.add.image(global.center.x-55,315,'btn-owl.png').setInteractive();
        const pandaBtn = this.add.image(global.center.x+55,315,'btn-panda.png').setInteractive();
        const monkeyBtn = this.add.image(global.center.x+165,315,'btn-monkey.png').setInteractive();
        const rabbitBtn = this.add.image(global.center.x+275,315,'btn-rabbit.png').setInteractive();

        const blueBtn = this.add.image(global.center.x-165,420,'btn-blue.png').setInteractive();
        const redBtn = this.add.image(global.center.x+165,420,'btn-red.png').setInteractive();

        let chipEffects : Phaser.FX.Bloom[];
        chipEffects = [];
        function chipData(selected : boolean, amt : number) : { isSelected : boolean, amount : number }{
            return{ 
                isSelected : selected,
                amount : amt
            }
        }
        

        const chipButtonGroup = this.add.group();
        const chip1 = this.add.image(global.center.x - 255, 595,'chips','chip-1.png').setData({'isSelected' : true, 'amount' : 1}).setDepth(6).setScale(1).setInteractive();
        const chip5 = this.add.image(global.center.x - 170, 595,'chips','chip-5.png').setData({'isSelected' : false, 'amount' : 5}).setDepth(6).setScale(.7).setInteractive();
        const chip10 = this.add.image(global.center.x - 85, 595,'chips','chip-10.png').setData({'isSelected' : false, 'amount' : 10}).setDepth(6).setScale(.7).setInteractive();
        const chip50 = this.add.image(global.center.x, 595,'chips','chip-50.png').setData({'isSelected' : false, 'amount' : 50}).setDepth(6).setScale(.7).setInteractive();
        const chip100 = this.add.image(global.center.x + 85, 595,'chips','chip-100.png').setData({'isSelected' : false, 'amount' : 100}).setDepth(6).setScale(.7).setInteractive();
        const chip500 = this.add.image(global.center.x + 170, 595,'chips','chip-500.png').setData({'isSelected' : false, 'amount' : 500}).setDepth(6).setScale(.7).setInteractive();
        const chip1000 = this.add.image(global.center.x + 255, 595,'chips','chip-1000.png').setData({'isSelected' : false, 'amount' : 1000}).setDepth(6).setScale(.7).setInteractive();

        chipButtonGroup.addMultiple([chip1,chip5,chip10,chip50,chip100,chip500,chip1000]);
        chipButtonGroup.getChildren().forEach((item : Phaser.GameObjects.GameObject, i : number)=>{
            const sprite = item as Phaser.GameObjects.Sprite;
            //bloom : Phaser.FX.Bloom;
            //this.bloom = this.add.postFX?('Bloom')
            chipEffects[i] = sprite.postFX?.addBloom(0x000000,0,0,10,1);
            
            //sprite.setRender
            chipEffects[0].strength = 2;
            
            sprite.on('pointerdown',()=>{
                chipButtonGroup.getChildren().forEach((_item,ii)=>{
                    const s = _item as Phaser.GameObjects.Sprite;
                    s.setScale(.7);
                    s.data.values.isSelected = false;
                    const bloom = chipEffects[ii] as Phaser.FX.Bloom;
                    bloom.strength = 1;
                })
                sprite.data.values.isSelected = true;
                sprite.setActive(true);
                sprite.setScale(1)
                chipEffects[i].strength = 2
            }).on('pointerover',()=>{
                if(sprite.data.values.isSelected)return
                sprite.setScale(.9)
            }).on('pointerout',()=>{
                if(sprite.data.values.isSelected)return
                sprite.setScale(.7)
            })

        })


        const boxGroup = this.add.group({
            key : 'box.png',
            quantity : 26,
            setXY : {
                x : 0,
                y : 0
            },
            setOrigin : {
                x : .5,
                y : .5
            },
            setScale :{
                x : 1,
                y : 1
            }
        })
        const highlightBox = this.add.group({
            key : 'box-selected.png',
            quantity : 26,
            setXY : {
                x : 0,
                y : 0
            },
            setOrigin : {
                x : .5,
                y : .5
            },
            setScale :{
                x : 1,
                y : 1
            },
            setAlpha : {
                value : 0
            }
        })
        this.highlightBoxTweenGroup = [];
        highlightBox.getChildren().forEach((item,i)=>{
            const itemSprite = item as Phaser.GameObjects.Sprite
            const itemTween = this.tweens.add({
                targets : itemSprite,
                alpha : 1,
                yoyo : true,
                duration : 200,
                onComplete : ()=>{
                    itemTween.restart().pause();
                },
                paused : true
            });
            this.highlightBoxTweenGroup.push(  itemTween )

        })
    
        const animalGroup = this.add.group({
            key : 'animals',
            frame :['hawk.png','owl.png','ostrich.png','chicken.png','golden.png','rabbit.png','monkey.png','panda.png','lion.png',
            'hawk.png','owl.png','ostrich.png','chicken.png',
            'lion.png','panda.png','monkey.png','rabbit.png','shark.png','chicken.png','ostrich.png','owl.png','hawk.png',
            'lion.png','panda.png','monkey.png','rabbit.png'
        ],
            setXY : {
                x : 0,
                y : 0
            },
            setOrigin : {
                x : .5,
                y : .5
            },
            setScale :{
                x : 1,
                y : 1
            }
        })


        Phaser.Actions.PlaceOnRectangle( boxGroup.getChildren(), new Phaser.Geom.Rectangle(165,48,751,475));
        Phaser.Actions.PlaceOnRectangle( highlightBox.getChildren(), new Phaser.Geom.Rectangle(165,48,751,475));
        Phaser.Actions.PlaceOnRectangle( animalGroup.getChildren(), new Phaser.Geom.Rectangle(165,45,751,475));


        const StartSelection = ( animalIndex : number | null = null )=>{
            clearHighlightBox();
            this.tweens.addCounter({
                from : 0,
                to : highlightBox.getChildren().length-1,
                duration : 2500,
                //repeat : 1,
                ease : 'Linear',
                onUpdate : (tweens,targets)=>{
                    const index = Math.floor(targets.value)
                    this.highlightBoxTweenGroup[index].play();
                },
                onComplete : ()=>{
                    if(animalIndex === null )return
                    EndSelection( animalIndex )
                    
                }
            })
        }

        const EndSelection = (animalIndex : number)=>{
            let duration : number = (animalIndex < 5)? 1000 : (animalIndex < 15)? 2000 : 3000 ;
            let counter : number;
            console.log(`animalIndex : ${animalIndex}`)
            this.tweens.addCounter({
                from : 0,
                to : animalIndex,
                duration : duration,
                ease : 'Sine.out',
                onUpdateScope : this,
                onUpdate : (tweens,targets,obj)=>{
                     const index = Math.floor(targets.value);
                    if(counter !== index){
                    
                        if(!this.highlightBoxTweenGroup[index].isPlaying()){
                            this.highlightBoxTweenGroup[index].duration = 3000;
                            this.highlightBoxTweenGroup[index].restart();
                            this.highlightBoxTweenGroup[index].play();
                        }
                    }
                    counter = index; //this will avoit multiple triggers
                    
                },
                onComplete : ()=>{
                    const sbox = highlightBox.getChildren()[animalIndex] as Phaser.GameObjects.Sprite;
                    sbox.setAlpha(1);
                    shakeAnimal( animalIndex );
                }
            })
        }

        const shakeAnimal = (animalIndex:number)=>{
            const sprite = animalGroup.getChildren()[animalIndex] as Phaser.GameObjects.Sprite;
            sprite.setAngle( -10 );
            this.tweens.add({
                targets :  animalGroup.getChildren()[animalIndex],
                rotation : {
                    value : Phaser.Math.DegToRad( 10 ),
                    duration : 100,
                    repeat : 6,
                    yoyo : true,
                },
                scaleX : {
                    value : 1.3,
                    duration : 250,
                    yoyo : true,
                    repeat : 2,
                },
                scaleY : {
                    value : 1.3,
                    duration : 250,
                    yoyo : true,
                    repeat : 2,
                },
                onComplete : ()=>{
                    //sprite.setAngle(0)
                    this.tweens.add({
                        targets :  animalGroup.getChildren()[animalIndex],
                        rotation : 0,
                        duration : 100,
                    })
                }
            })
           
        }

        const clearHighlightBox = ()=>{
            highlightBox.getChildren().forEach((item : Phaser.GameObjects.GameObject) =>{
                const boxHiglights = item as Phaser.GameObjects.Sprite;
                boxHiglights.setAlpha(0)
            })
        }


        this.input.keyboard?.on("keydown",(event : KeyboardEvent) =>{
            if(event.key === ' '){
                const dummy = DummyData.getResult();
                console.log( dummy );
                StartSelection( dummy.groupIndex );
            }
        })
    }
    update(time: number, delta: number): void {
        
    }
}