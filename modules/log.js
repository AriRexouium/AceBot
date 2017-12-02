/*
  A modified import of TheRacingLion's logging system from their discord-selfbot.
  https://github.com/TheRacingLion/Discord-SelfBot/blob/02e041dda4e67e3a69b79c56c559492bf3c4f43c/src/plugins/Logger.js#L22-L27

  All credits go to original creators.
  If you want this removed please let me know and i'll remove it immediately.
*/
const moment = require('moment')
const chalk = require('chalk')

function Logger (background, title, text, time = true, type) {
  console[type](`${time ? `[${chalk.cyan(moment().format('H:mm:ss'))}]` : ''}${chalk[background].bold(` ${title} `)} ${text}`)
}

module.exports = {
  info (text, title = 'Info', background = 'bgCyan', time = true) {
    if (text !== undefined) {
      Logger(background, title, text, time, 'info') // Yes I know, console.info() is just an alias for console.log().
      return true
    } else {
      process.emitWarning('text cannot be undefined', 'LoggerError')
    }
  },
  debug (text, title = 'Debug', time = true) {
    if (text !== undefined) {
      Logger('bgMagenta', title, text, time, 'log')
      return true
    } else {
      process.emitWarning('text cannot be undefined', 'LoggerError')
    }
  },
  warn (warn, title = 'Warning') {
    if (warn !== undefined) {
      Logger('bgYellow', `${title} Warning`, warn, true, 'warn')
      return true
    } else {
      process.emitWarning('warn cannot be undefined', 'LoggerError')
    }
  },
  error (error, title = 'Error') {
    if (error !== undefined) {
      Logger('bgRed', `${title} Error`, `${(error && error.stack) || error}`, true, 'error')
      return true
    } else {
      process.emitWarning('error cannot be undefined', 'LoggerError')
    }
  }
}
