const winston = require('winston')
const isoTimestampFormatter = require('./isoTimestampFormatter')
const sortFormatter = require('./sortFormatter')

const makeErrorMessagePropertyEnumerable = winston.format((info) => {
    if (info instanceof Error) Object.defineProperty(info, 'message', { enumerable: true })
    if (info.message instanceof Error) {
        const { message, ...extraProperties } = info
        // eslint-disable-next-line no-param-reassign
        info = message
        Object.assign(info, extraProperties)
    }

    return info
})

const Logger = ({ level, propertiesOrderList = ['timestamp', 'level', 'message'] }) => winston.createLogger({
    levels: winston.config.syslog.levels,
    format: makeErrorMessagePropertyEnumerable(),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format(isoTimestampFormatter)(),
                winston.format(sortFormatter)(propertiesOrderList),
                winston.format.json(),
            ),
            level,
        }),
    ],
})

module.exports = Logger({ level: process.env.LOGGER_LEVEL || 'debug' })
