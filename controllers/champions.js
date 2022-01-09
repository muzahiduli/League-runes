const champions = require('express').Router()
let queryChamps = true
const getRunes = require('../test').getRunes
const fs = require('fs')
let runes = []

champions.get('/', async (request, response) => {
    if (queryChamps) {
        runes = JSON.parse(fs.readFileSync('./runes.json'))
        queryChamps = false
    }
    //console.log(queryChamps)
    response.json(runes)
})

module.exports = champions