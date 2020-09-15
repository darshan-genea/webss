/**
 * Add Remote IP is a middleware that sets a http.Request's RemoteAddr
 * to the results of parsing either the X-Forwarded-For header
 * or the X-Real-IP header (in that order).
 * Useful when running service behind reverse proxy
 * @param req
 * @param res
 * @param next
 */
module.exports = (req, res, next) => {
    req.remoteAddress = req.headers['x-forwarded-for'] || req.headers['X-Real-IP'] || req.connection.remoteAddress
    next()
}
