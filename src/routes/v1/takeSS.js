const webSS = require('../../services/webss/')

const maxWidth = process.env.MAX_WIDTH || 1200
const maxHeight = process.env.MAX_HEIGHT || 1400

/**
 * Extract valid options from request
 * @param req
 * @returns {{}}
 */
const extractOptions = ({ req }) => {
    const container = {}

    const url = req.params[0]
    const { width, height } = req.query

    container.url = url.startsWith('http') ? url : `https://${url}`
    container.width = !Number.isNaN(parseInt(width, 10)) ? parseInt(width, 10) : null
    container.height = !Number.isNaN(parseInt(height, 10)) ? parseInt(height, 10) : null
    if (container.width > maxWidth || !width) container.width = maxWidth
    if (container.height > maxHeight || !height) container.height = maxHeight

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
