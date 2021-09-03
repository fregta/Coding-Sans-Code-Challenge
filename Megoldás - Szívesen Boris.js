const beers = require("./beers.json")

//1.
function groupByBrand() {
    let brands = []
    let groupedByBrand =[]
    for (let index = 0; index < beers.length; index++) { //kigyűjti a különböző brandeket egy brand array-ba, később ez alapján csoportosít
        let element = beers[index];
        let brandOfBeer = element.brand
        if (brands.includes(brandOfBeer)) {continue}
        brands.push(brandOfBeer)
    }

    for (let index = 0; index < brands.length; index++) { //forloop-al végigmegy a brands array-en, megkreálja az objectet és minden olyan sört a JSON-ból hozzácsatol, ami ahhoz a brandhez tartozik ahol éppen tart
        const element = brands[index];
        objectToAdd = new Object()
        objectToAdd.brand = element
        objectToAdd.beers = beers.filter((beer) => beer.brand == element)
        groupedByBrand.push(objectToAdd)
    }   return groupedByBrand
}

//2.
function filterByBeerType(beerType) {
    let filteredByBeerType = beers.filter((beer)=>beer.type == beerType) 
    if (filteredByBeerType.length == 0) {return "Nincs ilyen sőrfajta. Próbálkozz a Szűrt, Szűretlen, Barna, Világos vagy Búza típusokkal"}
    return filteredByBeerType
}

//3.
function findCheapestBrand() {
    const grouped = groupByBrand()//Használom az első funktion-t ami brand alapján groupol
    let cheapestBrand
    let cheapestPrice = 10000000000       
    let averagePriceOfBrand             //Meghatároztam a változókat, amiket kritériumként fogok használni illetve amiben az eredményt tárolom
    for (let index = 0; index < grouped.length; index++) {
        const brand = grouped[index];
        averagePriceOfBrand = 0
       for (let index = 0; index < brand.beers.length; index++) { //Eddig kicsomagoltam a szükséges adatokat és azokból kiszámolom a kumulatív árat
          beer = brand.beers[index]
            averagePriceOfBrand += parseInt(beer.price)
       } averagePriceOfBrand = averagePriceOfBrand/brand.beers.length //kummulatív árat átlagol
        if(cheapestPrice > averagePriceOfBrand){ //Összeveti az eddigi legolcsóbb árral és ha olcsóbb akkor átírja a legolcsóbb árat és a legolcsóbb brandet
            cheapestPrice = averagePriceOfBrand
            cheapestBrand = brand.brand
        }
    }
    return cheapestBrand
}

//4.
function filterByIngredient(ingredient) {
    if (ingredient != 'árpa' && ingredient != 'só' && ingredient != 'cukor' && ingredient != 'víz') {
        return "Ilyen összetevő nem létezik a sörökben"
    }
    let filtered =[]
    for (let i = 0; i < beers.length; i++) {
        const beer = beers[i];
        for (let index = 0; index < beer.ingredients.length; index++) {//Eddig kicsomagoltam a szükséges adatokat a JSON-ból a forloopokkal
            const ing = beer.ingredients[index];
            if(ing.name == ingredient && ing.ratio == 0){ //Itt összevetem azokat a feladatban leírt kritériummal és ha megfelel bekerül a filtered array-be
                filtered.push(beer)
            }  
        }
    }
    if (filtered.length == 0) {
        return "Mindegyik sör tartalmazza ezt az összetevőt. Bocs Vasily. :("
    }
    return filtered
}

//5.
function sortByWaterRatio() {
    let sortedArrayOfBeers = []
    for (let index = 0; index < beers.length; index++) { //Kiszámolja és kiegészíti a sört a waterRatio propertyvel, aztán pusholja  a sört az array-be amit aztán majd sortolok
        const beer = beers[index];
        let sumOfIngredients = 0
        for (let i = 0; i < beer.ingredients.length; i++) {
            sumOfIngredients += parseInt(beer.ingredients[i].ratio*100)
        }
        beer.waterRatio = (100 - sumOfIngredients)/100
        sortedArrayOfBeers.push(beer)
    }
    sortedArrayOfBeers.sort((a, b) => (a.waterRatio > b.waterRatio) ? -1 : 1) //Sortolás csökkenő sorrendbe
    return sortedArrayOfBeers
}

//BONUS 6.

function createHashmapOfBeersRoundedToNearesHoundred(){ //Hogyha feladatleírás alapján csináljuk, akkor a sima kerekítéssel csoportosítom, Opcionálisan kihagyhatók azok a százasok amikhez nem tartozik sör
    let map = new Map()
    for (let index = 100; index < 100*100; index+=100) {//100-asával növekvő index lesz a key és egyben a kritérium
        let arrayOfBeers = beers.filter((beer) => {
            if (parseInt(beer.price) < 50 && index == 100) {//50-nél kisebb árat 0-ra kerekít és nem sorolja sehova. Ez javítandó van ez a feltétel
                return beer
            }
            if ((Math.round(parseInt(beer.price)/100)*100) == index) {//százasra kerekít és összeveti az éppen aktuális index-el
                return beer
            }
        })
    //if (arrayOfBeers.length ==0) {continue} //Kihagyja a property hozzáadását hogyha nincs benne sör
    map.set(index, arrayOfBeers)
    }
    return map
}

function createHashmapOfBeersRoundedUpToNearesHoundred(){//Hogyha a "minta" map alapján csinálom akkor mindenképpen felfele kerekítem a legközelebbi egész százasig. Opcionálisan kihagyhatók azok a százasok amikhez nem tartozik sör
    let map = new Map()
    for (let index = 100; index < 100*100; index+=100) {
        let arrayOfBeers = beers.filter((beer) => ((Math.ceil(parseInt(beer.price)/100)*100) == index))//annyi változás van az előzőhöz képest, hogy mindenképpen felfele kerekít, így az if sem kell.
    //if (arrayOfBeers.length ==0) {continue} //Kihagyja a property hozzáadását hogyha nincs benne sör
    map.set(index, arrayOfBeers)
    }
    return map
}

