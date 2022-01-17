const fs = require('fs')

async function getChampionName(key) {
    const champList = JSON.parse(fs.readFileSync('./data/champions.json'))
    //console.log(champList)
    for (champ of champList){
        if (parseInt(champ[0]) === parseInt(key)) {
            return champ[1]
        }
    }
}

async function getChampionRunes(champ, gameMode) {
    let runes = null
    if (gameMode === 'CLASSIC') {
        runes = JSON.parse(fs.readFileSync('./data/5v5runes.json'))
    }
    else {
        runes = JSON.parse(fs.readFileSync('./data/aramrunes.json'))
    }

    for (rune of runes) {
        const name = Object.keys(rune)[0]
        if (name === champ) {
            const runeLis = rune[name]['rune0']
            let primaryStyle = ''
            let subStyle = ''
            let selectedPerks = []
            for (perk of runeLis) {
                if (perk.substring(2) === '00') {
                    if (!primaryStyle) {
                        primaryStyle = parseInt(perk)
                    } else {
                        subStyle = parseInt(perk)
                    }
                } else {
                    selectedPerks.push(parseInt(perk))
                }
            }
            return {primaryStyle, subStyle, selectedPerks}
        }
    }
}

module.exports = {getChampionName, getChampionRunes}