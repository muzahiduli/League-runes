const cheerio = require("cheerio")
const axios = require("axios")
const fs = require('fs')
const { TIMEOUT } = require("dns")
//const url = 'https://www.metasrc.com/aram/na/champion/ezreal'


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


async function getAllRunes() {
    const runes = []
    const champions = JSON.parse(fs.readFileSync('./champions.json', 'utf8'))
    const waitFor = delay => new Promise(resolve => setTimeout(resolve, delay));
    for (let i=0; i<champions.length; i++) {
        let url = `https://www.metasrc.com/aram/na/champion/${champions[i][1]}`
        let obj = new Object()
        //obj[champions[i]] = await getRunes(url)
        obj[champions[i]] = await getRunes(url)
        runes.push(obj)
        await waitFor(200)
    }
    return runes
}
async function saveRunes() {
    const runes = await getAllRunes()
    console.log(runes.length)
    data = JSON.stringify(runes, null, 4)
    fs.writeFile('runes.json', data, err => {
        console.log('runes saved')
    })
}





/*
test1('https://www.metasrc.com/aram/na/champion/ezreal')
test1('https://www.metasrc.com/aram/na/champion/nami')
test1('https://www.metasrc.com/aram/na/champion/chogath') */
module.exports = {getRunes}