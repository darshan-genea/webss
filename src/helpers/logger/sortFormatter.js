const _ = require('lodash')

module.exports = (info, propertiesOrderList) => ({
    ..._.pick(info, propertiesOrderList),
    ..._(info)
        .omit(propertiesOrderList)
        .toPairs()
        .sortBy(0)
        .fromPairs()
        .value(),
})
