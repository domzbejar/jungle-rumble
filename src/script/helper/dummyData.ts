const animalSprites = [
    'hawk.png', 
    'owl.png',
    'ostrich.png',
    'chicken.png',
    //'golden.png',
    'rabbit.png',
    'monkey.png',
    'panda.png',
    'lion.png',
    'egg.png',
]
interface AnimalIndex {
    [key : string] : number[]
}
const animalIndex : AnimalIndex = {
    'hawk.png' : [0,13], 
    'owl.png': [1,9,14,22],
    'ostrich.png': [3,10,16],
    'chicken.png': [2,15,23],
    'rabbit.png': [7,12,20,25],
    'monkey.png': [6,19,24],
    'panda.png': [5,11,18],
    'lion.png': [8,21],
    'egg.png' : [4,17]
}
//const l : number = Object.keys(AnimalSprites).length
//console.log( l );
const DummyData={
    convertIndexToAnimal : function(){
        interface result{
            sprite : string, 
            groupIndex : number
        }
        //console.log( `Length: ${animalSprites.length}` );
        const randomSprite = animalSprites[ Math.floor( Math.random() * animalSprites.length ) ];
        console.log(randomSprite)
        const randomIndex = () : number=>{
            const idxs = animalIndex[ randomSprite ];
            console.log( idxs )
            if(idxs.length > 1){
                return idxs[ Math.floor( Math.random() * idxs.length ) ] ; 
            }else{
                return idxs[0];
            }
            
        }
        const res : result ={
            sprite : randomSprite,
            groupIndex : randomIndex()
        }
        return res
    },
    getResult : function(){
        return this.convertIndexToAnimal()
    }
}
export default DummyData