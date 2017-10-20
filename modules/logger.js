/*
  A modified import of TheRacingLion's logging system from his discord-selfbot.
  https://github.com/TheRacingLion/Discord-SelfBot/blob/02e041dda4e67e3a69b79c56c559492bf3c4f43c/src/plugins/Logger.js#L22-L27

  If you want this removed please let me know and i'll remove it immediately.
*/
const moment = require('moment')
const chalk = require('chalk')

function Logger (background, title, text, time = true) {
  console.log(`${time ? `[${chalk.cyan(moment().format('H:mm:ss'))}]` : ''}${chalk[background].bold(` ${title} `)} ${text}`)
}

module.exports = {
  info (text, title = 'Info', background = 'bgCyan', time = true) {
    Logger(background, title, text, time)
  },
  warn (warn, title = 'Client') {
    Logger('bgYellow', `${title} Warning`, warn)
  },
  error (error, title = 'Client') {
    Logger('bgRed', `${title} Error`, `${(error && error.stack) || error}`)
  }
}
