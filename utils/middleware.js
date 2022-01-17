
const errorHandler = (error, request, response, next) => {
    if (error.name === 'Error') {
        response.write(`data: ${JSON.stringify({error: 'League client is not open'})}\n\n`)
        return
        
    } else if (error.name === 'TypeError') {
       response.write(`data: ${JSON.stringify({error: 'Not in champ select'})}\n\n`)
       return
    } else if (error.name === 'UnLocked') {
        response.write(`data: ${JSON.stringify({error: 'Champion not locked yet'})}\n\n`)
        return
    }

    /*
if (error.name === 'Error') {
        return response.status(400).json({error: 'League client is not open'})
        
    } else if (error.name === 'TypeError') {
        return new Promise(resolve => {
            setTimeout(() => {
                response.redirect('http://localhost:3000')}, 10000)
        })
    }
        */
}

module.exports = {errorHandler}