interface BetData{
    betOrder : Bets,
    totalAmount : number
}
interface Bets{
    [animalType : string] :  number 
}
 interface Odds{
    [animalType : string] :  number 
 }

 const odds : Odds = {
    "hawk" : 12,
    "lion" : 12,
    "chicken" : 8,
    "ostrich" : 8,
    "owl" : 6,
    "panda" : 8,
    "monkey" : 8,
    "rabbit" : 6,
    "blue" : 1.95,
    "red" : 1.95,
    "egg" : 0
 }

 let bet : Bets = {
    "hawk" : 0,
    "lion" : 0,
    "chicken" : 0,
    "ostrich" : 0,
    "owl" : 0,
    "panda" : 0,
    "monkey" : 0,
    "rabbit" : 0,
    "blue" : 0,
    "red" : 0,
}

const BetOrder = {
    BetData : bet,
    TotalBetAmount : 0,
    PlaceBets : function(betOrder : Bets ):BetData{
        const result : BetData = {
            betOrder : bet,
            totalAmount : 0
        };
        this.TotalBetAmount = 0;
        for( const item in betOrder ){
            result.totalAmount+=betOrder[item];
            this.TotalBetAmount+=betOrder[item];
        }

        this.BetData = betOrder;
        result.betOrder = betOrder;
        //console.log( betOrder )
        //console.log( `total : ${result.totalAmount}` );
        return result
    },
    WinningColor : function( animalType : string ): string{
        let color = ""
        if(animalType === 'hawk' ||animalType === 'chicken' ||animalType === 'ostrich' ||animalType === 'owl' ){
            color = 'blue'
        }
        if(animalType === 'lion' ||animalType === 'panda' ||animalType === 'monkey' ||animalType === 'rabbit' ){
            color = 'red'
        }
        return color
    },
    WinningOdds : function( animalType : string ) : number {
        let res : number = 0;
         
        res = odds[animalType]

        return res;
    }
}

export default BetOrder;