const moment = require('moment')
const chalk = require('chalk')

var cases = {
  'alert': { content: chalk.red('Alert'), type: 'warn' },
  'critical': { content: chalk.red('Critical'), type: 'warn' },
  'debug': { content: chalk.magenta('Debug'), type: 'log' },
  'emergency': { content: chalk.red('Emergency'), type: 'warn' },
  'error': { content: chalk.red('Error'), type: 'error' },
  'info': { content: chalk.cyan('Info'), type: 'log' },
  'notice': { content: chalk.yellow('Notice'), type: 'log' },
  'success': { content: chalk.green('Success'), type: 'log' },
  'verbose': { content: chalk.magenta('Verbose'), type: 'log' },
  'warn': { content: chalk.yellow('Warn'), type: 'warn' }
}

/**
 * The client's default logger.
 * @param {any} client The Commando client.
 * @param {string} type The type of log. (Ex: info)
 * @param {string} body The description/body of the log.
 * @param {string} parent The parent of the error. (Use '' to ignore value and default to cwd.)
 * @param {string} child The child of the error. (Supports `__filename`, also use '' to default to <anonymous>.)
 */
module.exports = function logger (client, type, body, parent, child) {
  if (!Object.keys(cases).includes(type)) throw new Error('Must be a valid log case.')
  if (parent == null || parent === '') { parent = client.getFileName(process.cwd()) }

  try {
    require(child)
    delete require.cache[require.resolve(child)]
    child = client.getFileName(child)
  } catch (err) {
    if (child == null || child === '') {
      child = '<anonymous>'
    }
  }

  body = body.toString().split('\n')
  var formatBody = ''
  for (var i = 0; i < body.length; i++) {
    i + 1 !== body.length ? formatBody += `│ ${body[i]}\n` : formatBody += `└ ${body[i]}`
  }

  var date = chalk.gray(moment().format(`YYYY-MM-DD|HH:mm:ss:SSSS`))
  var title = `${chalk.cyan(parent)}${chalk.gray('→')}${(chalk.cyan(child))}`
  console[cases[type].type](`┌─[${date}]─[${title}]─[${cases[type].content}]\n${formatBody}`)
}
