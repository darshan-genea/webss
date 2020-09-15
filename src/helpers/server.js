const http = require('http')
const _ = require('lodash')
const enableServerDestroy = require('server-destroy')
const logger = require('./logger')

/**
 * Default configurations for server
 */
const DEFAULT_PORT = 5000
const DEFAULT_HOST = '0.0.0.0'
const DEFAULT_WAIT_FOR_CONNECTION_CLOSE = false

/**
 * @class Underlying HttpServer class of express with few improvements
 * @param {{ host: string, port: string | int, waitForConnectionClose: boolean }, function, function}
 */
class HttpServer {
    constructor({ config, requestHandler }) {
        this.config = _.defaultsDeep(config, { host: DEFAULT_HOST, port: DEFAULT_PORT, waitForConnectionClose: DEFAULT_WAIT_FOR_CONNECTION_CLOSE })
        this.requestHandler = requestHandler
        this.logger = logger
    }

    /**
     * Function to spin up server
     * @returns {Promise<server>}
     */
    async start() {
        const { port, host } = this.config
        this.server = http.createServer(this.requestHandler)
        enableServerDestroy(this.server)

        return new Promise(((resolve, reject) => {
            this.server.listen(port, host, () => {
                this.logger.info(`http server started`, { port })
                resolve(this.server)
            })
            this.server.on('error', e => reject(e))
        }))
    }

    /**
     * Function to stop server
     * @returns {Promise<unknown>}
     */
    async stop() {
        if (!this.server) throw new Error('Server is not initiated yet!')
        /**
         * If service is deployed on production we should wait for all the pending request to complete
         */
        if (this.config.waitForConnectionClose) {
            return new Promise(
                resolve => this.server.close(() => {
                    this.logger.info('http server closed')
                    resolve()
                }),
            )
        }

        /**
         * If service deployed on dev we can destroy all the active connections and close server immediately
         */
        return new Promise(
            resolve => this.server.destroy(() => {
                this.logger.info('http server closed')
                resolve()
            }),
        )
    }
}

module.exports = HttpServer
