const webSS = require('../../services/webss/')

/**
 * Convert base64 URL to normal string URL
 * @param base64URL
 * @returns {string}
 */
const transformURL = ({ base64URL }) => {
    const urlBuffer = Buffer.from(base64URL, 'base64')
    let URL = urlBuffer.toString('utf8')
    if (!URL.startsWith('http')) URL = `https://${URL}`

    return URL
}

/**
 * Extract valid options from request
 * @param req
 * @returns {{}}
 */
const extractOptions = ({ req }) => {
    const container = {}

    const { url: base64URL } = req.params
    const { width, height } = req.query

    container.url = transformURL({ base64URL })
    container.width = !Number.isNaN(parseInt(width, 10)) ? parseInt(width, 10) : null
    container.height = !Number.isNaN(parseInt(height, 10)) ? parseInt(height, 10) : null
    if (container.width > 3000) container.width = 3000
    if (container.height > 3000) container.height = 3000

    return container
}

/**
 * Controller for /screenshot, returns PNG of given URL
 * @param req
 * @param res
 * @param next
 * @returns {Promise<null>}
 */
module.exports = async (req, res, next) => {
    try {
        const screenshotBuffer = await webSS.takeSS({
            options: extractOptions({ req }),
        })

        res.end(screenshotBuffer)
    } catch (e) {
        if (e.message === 'Protocol error (Page.navigate): Cannot navigate to invalid URL') next(Object.assign(e, { statusCode: 400, message: 'Bad request - Invalid URL' }))
        else next(Object.assign(e, { statusCode: 500 }))
    }

    return null
}

// TODO: Implement timeout cache
