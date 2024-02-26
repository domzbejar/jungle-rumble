//import  Phaser from "./node_modules/phaser/dist/phaser.js"
import MainScene from "./mainscene.js"


const config = {
    type : Phaser.WEBGL,
    parent : "app",
    scale  : {
        height : 610,
        width : 1080,
        mode : Phaser.Scale.FIT,
        autoCenter : Phaser.Scale.CENTER_BOTH
    },
    banner : false,
    backgroundColor : "#111111",
    scene : [MainScene],
    plugins: {
        scene: [
            { key: 'SpinePlugin', plugin: SpinePlugin, url : './../dist/SpinePluginDebug.js"', mapping: 'spine' }
        ]
    }
}
const game  = new Phaser.Game( config )