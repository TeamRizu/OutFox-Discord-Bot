// Libs
const Winston = require('winston')
const path = require('path')

// Files
const outfox = require('../outfox.js')

exports.main = (client) => {
    console.log('Start Winston Logger')

    const logger = Winston.createLogger({
        level: 'info',
        format: Winston.format.json(),
        transports: [
            new Winston.transports.File({
                filename: path.join(__dirname, '../logs/combined.txt'),
            }),
        ],
    })

    if (process.env.NODE_ENV !== 'production') {
        logger.add(
            new Winston.transports.Console({
                format: Winston.format.simple(),
            })
        )
    }

    logger.info('Ready to OutFox!')
    outfox.main(client, logger)
}
