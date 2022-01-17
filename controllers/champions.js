const champions = require('express').Router()
const fs = require('fs')
const path = require('path')

let queryChamps = true
let aramRunes = []
let normRunes = []

if (queryChamps) {
    //const dataFolder = path.join(path.parse(__dirname).dir, "data") 
    //aramRunes = JSON.parse(fs.readFileSync(path.join(dataFolder, 'aramrunes.json')))
    //normRunes = JSON.parse(fs.readFileSync(path.join(dataFolder, '5v5runes.json')))
    aramRunes = JSON.parse(fs.readFileSync('./data/aramrunes.json'))
    normRunes = JSON.parse(fs.readFileSync('./data/5v5runes.json'))
    queryChamps = false;
}

champions.get('/:gameMode/champions', async (request, response) => {
    const gameMode = request.params.gameMode
    if (gameMode.toLowerCase() === 'aram') {
        return response.json(aramRunes)
    } else if (gameMode.toLowerCase() === '5v5') {
        return response.json(normRunes)
    }
    return response.status(400).json({"error": `game mode ${gameMode} does not exist`})
})

champions.get('/:gameMode/champions/:champName', async (request, response) => {
    const gameMode = request.params.gameMode
    const champName = request.params.champName
    let listToSearch = null

    listToSearch = gameMode.toLowerCase() === 'aram' 
        ? aramRunes
        : normRunes

    if (!listToSearch) {
        return response.status(400).json({"error": `game mode ${gameMode} does not exist`})
    }

    let champRunes = listToSearch.find(champ => {
        return Object.keys(champ)[0] === champName
    })
    if (!champRunes) {
        return response.status(400).json({"error": `champion ${champName} does not exist`})
    }
    return response.json(champRunes)
})

module.exports = champions