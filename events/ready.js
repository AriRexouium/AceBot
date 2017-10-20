const chalk = require('chalk')

module.exports = (client) => {
  client.log.info('Client Ready!', 'Discord')
  client.log.info(`Logged in as ${client.user.tag} (${client.user.id})`, 'Discord')
  client.user.setActivity(client.user.tag)
  console.log(chalk.green('--------------------------------------------------'))
}
