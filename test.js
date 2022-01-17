const cheerio = require("cheerio")
const axios = require("axios")
const fs = require('fs')
const path = require('path')

async function getRunes(url) {
    const request = await axios.get(url)
    const $ = cheerio.load(request.data)
    const tooltip = $('#perks div ._g9pb7k').find('[data-tooltip]').toArray()
    perks = []
    tooltip.forEach(perk => {
        perks.push(perk.attribs['data-tooltip'])
    })
    //console.log(perks)
    let runes = new Object()
    for (let counter=0; counter<perks.length; counter++) {
        if (perks[counter].length < 9) {}

        else if (`rune${Math.floor(counter / 11)}` in runes) {
            runes[`rune${Math.floor(counter / 11)}`].push(perks[counter].substr(5))
        } else {
            runes[`rune${Math.floor(counter / 11)}`] = [perks[counter].substr(5)]
        }
    }
    //console.log(runes)
    return runes
}

async function getChamps() {
    const response = await axios.get('http://ddragon.leagueoflegends.com/cdn/12.1.1/data/en_US/champion.json')
    const names = Object.keys(response.data.data)
    names.forEach((champ, index, arr) => {
        arr[index] = [response.data.data[champ].key, champ.toLowerCase()]
    })
    data = JSON.stringify(names, null, 4)
    fs.writeFile('champions2.json', data, err => {
        console.log('data saved')
    })
}


async function getAllRunes(gameMode) {
    const runes = []
    const champions = JSON.parse(fs.readFileSync('./champions.json', 'utf8'))
    const waitFor = delay => new Promise(resolve => setTimeout(resolve, delay));
    for (let i=0; i<champions.length; i++) {
        let champId = champions[i][0]
        let champName = champions[i][1]
        let url = `https://www.metasrc.com/${gameMode}/na/champion/${champName}`
        let obj = new Object()
        //obj[champions[i]] = await getRunes(url)
        obj[champName] = await getRunes(url)     //champname : {runes}
        obj[champName]["id"] = parseInt(champId)
        runes.push(obj)
        //await waitFor(200)
    }
    return runes
}
async function saveRunes(gameMode) {
    if (gameMode !== "5v5" && gameMode !== "aram") {
        console.log("game mode does not exist")
        return
    }
    const runes = await getAllRunes(gameMode)
    console.log(runes.length)
    data = JSON.stringify(runes, null, 4)
    const fileLocation = path.join(__dirname, "data", `${gameMode}runes.json`)
    fs.writeFile(fileLocation, data, err => {
        console.log('runes saved')
    })
}

//saveRunes("aram")
//saveRunes("5v5")



/*
test1('https://www.metasrc.com/aram/na/champion/ezreal')
test1('https://www.metasrc.com/aram/na/champion/nami')
test1('https://www.metasrc.com/aram/na/champion/chogath') */
module.exports = {getChamps, saveRunes}