/**
 * RequestLogger is the middleware that logs the each
 * incoming request along with some useful data
 * @param logger
 * @returns {function(*, *, *): void}
 */
module.exports = ({ logger }) => (req, res, next) => {
    logger.debug('incoming request', {
        url: req.url, body: req.body, remoteAddress: req.remoteAddress, token: req.headers.authorization,
    })
    next()
}
