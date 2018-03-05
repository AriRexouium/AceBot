/*
  Import from discord-selfbot - http://github.com/TheRacingLion/Discord-SelfBot
  Original code -> http://github.com/TheRacingLion/Discord-SelfBot/blob/02e041dda4e67e3a69b79c56c559492bf3c4f43c/src/plugins/Logger.js#L22-L27

  All credits go to original creators.
*/
const moment = require('moment')
const chalk = require('chalk')

/**
 * Log text to console.
 * @param {any} background The background color to use.
 * @param {string} title The title of the log message.
 * @param {string} text The text to log.
 * @param {boolean} time Add a timestamp or not. (Defaults to true.)
 * @param {string} type What type of log it is. (log, debug, warn, error)
 */
function Logger (background, title, text, time = true, type) {
  console[type](`${time ? `[${chalk.cyan(moment().format('H:mm:ss'))}]` : ''}${chalk[background].bold(` ${title} `)} ${text}`)
}

module.exports = {
  /**
   * Log an info message.
   * @param {string} text The info message to log.
   * @param {string} title The title of the info message.
   * @param {any} background The background color to use. (Defaults to cyan.)
   * @param {boolean} time Add a timestamp or not. (Defaults to true.)
   * @throws {Error} Will throw an error if there is nothing to send to the console.
   */
  info (text, title = 'Info', background = 'bgCyan', time = true) {
    if (text) {
      Logger(background, title, text, time, 'info') // NOTE: Yes I know, console.info() is just an alias for console.log().
    } else {
      throw new Error('Value must be specified.')
    }
  },

  /**
   * Log a debug message.
   * @param {string} text The debug message to log.
   * @param {string} title The title of the debug message.
   * @param {boolean} time Add a timestamp or not. (Defaults to true.)
   * @throws {Error} Will throw an error if there is nothing to send to the console.
   */
  debug (text, title = 'Debug', time = true) {
    if (text) {
      Logger('bgMagenta', title, text, time, 'log')
    } else {
      throw new Error('Value must be specified.')
    }
  },

  /**
   * Log a warning message.
   * @param {string} text The warning message to log.
   * @param {string} title The title of the warning message.
   * @throws {Error} Will throw an error if there is nothing to send to the console.
   */
  warn (text, title) {
    if (text) {
      if (title) { title = `${title} Warning` } else { title = 'Warning' }
      Logger('bgYellow', title, text, true, 'warn')
    } else {
      throw new Error('Value must be specified.')
    }
  },

  /**
   * Log an error message.
   * @param {string} text The error message to log.
   * @param {string} title The title of the error message.
   * @throws {Error} Will throw an error if there is nothing to send to the console.
   */
  error (text, title) {
    if (text) {
      if (title) { title = `${title} Error` } else { title = 'Error' }
      Logger('bgRed', title, `${(text && text.stack) || text}`, true, 'error')
    } else {
      throw new Error('Value must be specified.')
    }
  }
}
