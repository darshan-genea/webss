const puppeteer = require('puppeteer')

// TODO: Implement worker and memory management

class WebSS {
    constructor() {
        this.browser = null
        this.options = {
            height: 1080,
            width: 1920,
            fullPage: false,
        }
    }

    async launchBrowser() {
        this.browser = await puppeteer.launch()
    }

    async closeBrowser() {
        if (this.browser) await this.browser.close()
        this.browser = null
    }

    async takeSS({ options }) {
        /**
         * Throw error if browser is already closed or been never launched
         * This should never happen
         */
        if (!this.browser) throw new Error('Browser is not launched yet')

        /**
         * Throw error if option.url is not supplied
         */
        if (!options.url) throw new Error('missing url parameter')
        /**
         * Open new tab
         */
        const page = await this.browser.newPage()
        /**
         * Set resolution of viewport
         */
        await page.setViewport({
            width: options.width || this.options.width,
            height: options.height || this.options.height,
        })
        /**
         * Open URL and wait till page gets loaded
         */
        await page.goto(options.url, { waitUntil: 'networkidle0' })
        /**
         * Take Screenshot
         * @type {Buffer}
         */
        const screenshotBuffer = await page.screenshot({ fullPage: options.fullPage || this.options.fullPage })
        /**
         * Close Tab
         */
        await page.close()

        return screenshotBuffer
    }
}

module.exports = new WebSS()
