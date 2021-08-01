
// All bot commands need to be here, this can also be used to allow aliases
// if you point to the same command file.

exports.commands = {
    ping: require('./ping.js'),
    userlang: require('./userlang.js'),
    userlanguage: require('./userlang.js'), // Alias for userlang
    guildlang: require('./guildlang.js'),
    guildlanguage: require('./guildlang.js'), // Alias for guildlang
    serverlanguage: require('./guildlang.js'), // Alias for guildlang
    serverlang: require('./guildlang.js'), // Alias for guildlang
    leaderboard: require('./leaderboard.js'),
}
