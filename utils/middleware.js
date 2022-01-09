
const errorHandler = (error, request, response, next) => {
    if (error.name === 'Error') {
        return response.status(400).json({error: 'League client is not open'})
        
    } else if (error.name === 'TypeError') {
        return new Promise(resolve => {
            setTimeout(() => {
                response.redirect('http://localhost:3000')}, 10000)
        })
    }

    /*
    new Promise(resolve => {
            setTimeout(() => {
                response.redirect('http://localhost:3000')}, 10000)
        })
        */
}

module.exports = {errorHandler}