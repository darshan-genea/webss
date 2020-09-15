module.exports = info => ({
    timestamp: new Date().toISOString(),
    ...info,
})
