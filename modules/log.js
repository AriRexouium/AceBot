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
    if (text !== undefined) {
      Logger(background, title, text, time)
      return true
    } else {
      throw new Error('LoggerError: text cannot be undefined.')
    }
  },
  debug (text, title = 'Debug', time = true) {
    if (text !== undefined) {
      Logger('bgMagenta', title, text, time)
      return true
    } else {
      throw new Error('LoggerError: text cannot be undefined.')
    }
  },
  warn (warn, title = 'Warning') {
    if (warn !== undefined) {
      Logger('bgYellow', `${title} Warning`, warn)
      return true
    } else {
      throw new Error('LoggerError: warn cannot be undefined.')
    }
  },
  error (error, title = 'Error') {
    if (error !== undefined) {
      Logger('bgRed', `${title} Error`, `${(error && error.stack) || error}`)
      return true
    } else {
      throw new Error('LoggerError: error cannot be undefined.')
    }
  }
}
