const connect = require('express').Router()
let intervalId = null
const league = require('league-connect')
const helpers = require('../utils/connect_helper.js')

connect.get('/exit', async (request, response) => {
    console.log('Server closing...')
    response.status(200).end()
    process.kill(process.pid, 'SIGTERM')
})

connect.get('/stop', async (request, response) => {
    console.log('Stopping...')
    response.status(200).end()
    clearInterval(intervalId)
})

connect.get('/',  async (request, response, next) => {
    console.log('Starting...')
    const headers = {                           //defining headers so that when the client makes a request
        'Content-Type': 'text/event-stream',    //we keep the connection open instead of immediately ending with a singel response
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache', //optional
        'Content-Encoding': 'none'
    }
    response.writeHead(200, headers)
    await getUpdate(request, response, next)
    intervalId = setInterval(() => getUpdate(request, response, next), 5000);
})

function sendError(error, response) {
    if (error.name === 'TypeError') {
        response.write(`data: ${JSON.stringify({error: 'Not in champ select'})}\n\n`)
        return
    } else if (error.name === 'UnLocked') {
        response.write(`data: ${JSON.stringify({error: 'Champion not locked yet'})}\n\n`)
        return
    }
}

async function getUpdate(request, response, next)  {
    try {
        const credentials = await league.authenticate()
        
        const res = await league.request({
            method: 'GET',
            url: '/lol-champ-select/v1/current-champion'
        }, credentials)
        if (res[Object.getOwnPropertySymbols(res)[1]].status === 404) {
            //console.log('Not in champ select')
            return sendError({name: 'TypeError'}, response)
        }
        const gameModereq = await league.request({
            method: 'GET',
            url: '/lol-lobby/v2/lobby',
        }, credentials)
        const gameMode = JSON.parse(gameModereq[Object.getOwnPropertySymbols(gameModereq)[0]].body._readableState.buffer.head.data.toString())["gameConfig"]["gameMode"]
        const key = parseInt(JSON.parse(res[Object.getOwnPropertySymbols(res)[0]].body._readableState.buffer.head.data.toString()))
        if (!key) {
            setTimeout(() => {
                //console.log('Waiting for locked champion...')
                return sendError({name: 'UnLocked'}, response)
            })
        } else {
            const champName = await helpers.getChampionName(key)
            console.log(champName)
            const runes = await helpers.getChampionRunes(champName, gameMode)
            console.log(runes)
            console.log(gameMode)

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

            const champResponse = {
                champ: champName,
                primaryStyleId: runes.primaryStyle,
                selectedPerkIds: runes.selectedPerks,
                subStyleId: runes.subStyle
            }
            response.write(`data: ${JSON.stringify(champResponse)}\n\n`).end()
            return
        }
    } catch(error) {
        //console.log('League client not open')
        //console.log(error.message)
        if (error.name === 'Error') {
            response.write(`data: ${JSON.stringify({error: 'League client is not open'})}\n\n`)
            return
        }
    }
}

module.exports = connect

