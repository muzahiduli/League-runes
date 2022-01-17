const http = require('http')
const app = require('./app')
const league = require('league-connect')
const open = require('open')

const server = http.createServer(app)   //HTTP server wrapper around express app


const PORT = 3001
server.listen(PORT, () => {
    console.log(`Server runnign on port ${PORT}`)
    //open('http://localhost:3001/')
})

process.on('SIGTERM', () => {       //Defining what to do when signal 'SIGTERM' is sent
    server.close(() => {
        console.log('Server closed')
    })
})













/*const express = require('express')
const league = require('league-connect')

let credentials
async function authenticate() {
    let credentials = await league.authenticate()
    return credentials
}
const credentials = await authenticate();
console.log(credentials)


league.request({
    method: 'GET',
    url: '/lol-summoner/v1/current-summoner'
}, credentials)
.then(response => {
    //console.log(response)
    let responseBody = JSON.parse(response[Object.getOwnPropertySymbols(response)[0]].body._readableState.buffer.head.data.toString()) 
    console.log(responseBody)
})



league.authenticate()
.then(credentials => {
    //console.log(credentials)
    league.request({
        method: 'PUT',
        url: '/lol-perks/v1/pages/1337873270',
        body: {
            isActive: true,
            name: 'Ekko jg',
            primaryStyleId: 8400,
            selectedPerkIds: [
                8437, 8401, 8444,
                8453, 8126, 8106,
                5005, 5008, 5002
            ],
            subStyleId: 8100
          }
    }, credentials)
    .then(response => {
        console.log(response)
        /*let responseBody = JSON.parse(response[Object.getOwnPropertySymbols(response)[0]].body._readableState.buffer.head.data.toString()) 
        console.log(responseBody)
        console.log(responseBody.length)*/

