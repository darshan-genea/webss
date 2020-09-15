/**
 * Middleware for handling errors
 * @param logger
 * @returns {function(): void}
 */
module.exports = ({ logger }) => (err, req, res, next) => {
    /**
     * Logger function to log the error
     * @type {function}
     */
    const log = logger[err.level] || logger.warning
    /**
     * Assign extra parameters to log
     */
    log(Object.assign(err, {
        body: req.body, extra: err.extra, remoteAddress: req.remoteAddress, url: req.originalUrl,
    }))
    /**
     * If statusCode is 500 don't send extra info
     */
    if (!err.statusCode || err.statusCode === 500) {
        res.status(500)
        res.json({
            success: false,
            code: 500,
            message: 'Internal server error',
        })
    } else {
        res.status(err.statusCode)
        res.json({
            success: false,
            code: err.statusCode,
            message: err.message,
            extra: err.extra,
            errors: err.errors,
        })
    }
    res.end()
}
