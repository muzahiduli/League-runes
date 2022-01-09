const connect = require('express').Router()
const champions = require('./champions')
const league = require('league-connect')
const axios = require('axios')
const res = require('express/lib/response')
const fs = require('fs')
const { exit } = require('process')

async function getChampionName(key) {
    const champList = JSON.parse(fs.readFileSync('./champions.json'))
    //console.log(champList)
    for (champ of champList){
        if (parseInt(champ[0]) === parseInt(key)) {
            return champ[1]
        }
    }
}

async function getChampionRunes(champ) {
    
    const runes = JSON.parse(fs.readFileSync('./runes.json'))
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

connect.get('/', async (request, response, next) => {
    try {
        const credentials = await league.authenticate()
        const res = await league.request({
            method: 'GET',
            url: '/lol-champ-select/v1/current-champion'
        }, credentials)
        if (res[Object.getOwnPropertySymbols(res)[1]].status === 404) {
            console.log('Not in champ select')
            return next({name: 'TypeError'})
        }
        const key = parseInt(JSON.parse(res[Object.getOwnPropertySymbols(res)[0]].body._readableState.buffer.head.data.toString()))
        if (!key) {
            setTimeout(() => {
                console.log('Waiting for locked champion...')
                response.redirect('./')},2000)
        } else {
            //console.log(key) 
            const champName = await getChampionName(key)
            console.log(champName)
            const runes = await getChampionRunes(champName)
            console.log(runes)

            const res2 = await league.request({
                method: 'PUT',
                url: '/lol-perks/v1/pages/1337873270',
                body: {
                    isActive: true,
                    name: `${champName}`,
                    primaryStyleId: runes.primaryStyle,
                    selectedPerkIds: runes.selectedPerks,
                    subStyleId: runes.subStyle,
                    current: true
                  }
            }, credentials)

            response.status(200).send('done')
            //exit(1)
        }
    } catch(error) {
        //console.log('League client not open')
        console.log(error.message)
        next(error)
    }
})


module.exports = connect

/*
while (true) {
    try {
        league.authenticate()
        .then(credentials => {
            league.request({
                method: 'GET',
                url: '/lol-champ-select/v1/current-champion'
            }, credentials)
            .then(response =>{
                const key = parseInt(JSON.parse(response[Object.getOwnPropertySymbols(response)[0]].body._readableState.buffer.head.data.toString())) 
            })
        })
        break
    } catch(error) {
        if (error)
        console.log('League client is not open yet')
    }
}

league.authenticate()
        .then(credentials => {
            league.request({
                method: 'GET',
                url: '/lol-champ-select/v1/current-champion'
            }, credentials)
            .then(res =>{
                if (res[Object.getOwnPropertySymbols(res)[1]].status === 404) {
                    return next({name: 'TypeError'})
                }
                const key = parseInt(JSON.parse(res[Object.getOwnPropertySymbols(res)[0]].body._readableState.buffer.head.data.toString()))
                if (!key) {
                    setTimeout(() => {
                        console.log('refreshing')
                        response.redirect('./')
                    },2000)
                } else {
                    console.log(key) 
                    const champName = getChampionName(key)
                    console.log(champName)
                    response.end()
                }
            })
        })
*/