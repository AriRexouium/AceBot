/*
  Import from discord-selfbot - http://github.com/TheRacingLion/Discord-SelfBot
  Original code -> http://github.com/TheRacingLion/Discord-SelfBot/blob/02e041dda4e67e3a69b79c56c559492bf3c4f43c/src/plugins/Logger.js#L22-L27

  All credits go to original creators.
*/
const moment = require('moment')
const chalk = require('chalk')

/**
 * Log text to console.
 * @param {string} background
 * @param {string} title
 * @param {string} text
 * @param {boolean} time=true
 * @param {string} type
 * @return {boolean}
 */
function Logger(background, title, text, time = true, type) {
  console[type](`${time ? `[${chalk.cyan(moment().format('H:mm:ss'))}]` : ''}${chalk[background].bold(` ${title} `)} ${text}`)
}

module.exports = {
  info(text, title = 'Info', background = 'bgCyan', time = true) {
    if (text) {
      Logger(background, title, text, time, 'info') // NOTE: Yes I know, console.info() is just an alias for console.log().
      return true
    } else {
      process.emitWarning('text cannot be undefined', 'LoggerError')
    }
  },
  debug(text, title = 'Debug', time = true) {
    if (text) {
      Logger('bgMagenta', title, text, time, 'log')
      return true
    } else {
      process.emitWarning('text cannot be undefined', 'LoggerError')
    }
  },
  warn(warn, title) {
    if (warn) {
      if (title) { title = `${title} Warning` } else { title = 'Warning' }
      Logger('bgYellow', title, warn, true, 'warn')
      return true
    } else {
      process.emitWarning('warn cannot be undefined', 'LoggerError')
    }
  },
  error(error, title) {
    if (error) {
      if (title) { title = `${title} Error` } else { title = 'Error' }
      Logger('bgRed', title, `${(error && error.stack) || error}`, true, 'error')
      return true
    } else {
      process.emitWarning('error cannot be undefined', 'LoggerError')
    }
  }
}
