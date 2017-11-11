const fs = require('fs')
const sqlite = require('sqlite')
const { stripIndents } = require('common-tags')
const path = require('path')
const config = require('./config/config.json')
const { CommandoClient, SQLiteProvider } = require('discord.js-commando')
const client = new CommandoClient({
  selfbot: false,
  commandPrefix: config.startSettings.commandPrefix,
  commandEditableDuration: config.startSettings.commandEditableDuration,
  nonCommandEditable: config.startSettings.nonCommandEditable,
  unknownCommandResponse: config.startSettings.unknownCommandResponse,
  owner: config.startSettings.owner,
  invite: config.startSettings.invite
})
client.config = config
const botStats = { clientMentions: 0, commandsUsed: 0, messagesRecieved: 0, messagesSent: 0 }
client.botStats = botStats

client.registry
  .registerDefaultTypes()
  .registerDefaultGroups()
  .registerGroups([
    ['bot-staff', 'Bot Staff']
  ])
  .registerDefaultCommands({
    eval_: false,
    ping: false
  })
  .registerCommandsIn(path.join(__dirname, 'commands'))

/**
 * @param {string} source
 * @return {boolean}
 */
const isFile = source => fs.lstatSync(source).isFile()

/**
 * gets all files in a directory
 * @param {string} source
 * @return {string[]}
 */
let getFiles = source => {
  let files = fs.readdirSync(__dirname + source).map(name => path.join(__dirname + source, name)).filter(isFile) // eslint-disable-line no-path-concat
  for (let file in files) {
    files[file] = files[file].slice(__dirname.length)
  }
  return files
}

for (let file of getFiles('/modules')) {
  const moduleName = file.split('.')[0].substring(9)
  const moduleFile = require(`./${file}`)
  client[moduleName] = moduleFile
  delete require.cache[require.resolve(`./${file}`)]
}
client.log.info(`Successfully loaded ${getFiles('/modules').length} modules.`, 'Module Loader')

for (let file of getFiles('/events')) {
  const eventName = file.split('.')[0].substring(8)
  const event = require(`./${file}`)
  client.on(eventName, event.bind(null, client))
  delete require.cache[require.resolve(`./${file}`)]
}
client.log.info(`Successfully loaded ${getFiles('/events').length} events.`, 'Event Loader')

sqlite.open(path.join(__dirname, './config/serverConfig.sqlite3')).then((db) => {
  client.setProvider(new SQLiteProvider(db))
}).then(client.log.info(`Successfully loaded serverConfig file.`, 'SQLite Loader'))

process
.on('unhandledRejection', (error) => {
  client.log.error(stripIndents`\n
  ${client.shard ? `Shard ID: ${client.shard.id}\n` : ''}
  ${error.stack}
`, 'unhandledRejection')
})
.on('uncaughtException', (error) => {
  client.log.error(stripIndents`\n
  ${client.shard ? `Shard ID: ${client.shard.id}\n` : ''}
  ${error.stack}
`, 'uncaughtException')
})
.on('warning', (warning) => {
  client.log.error(stripIndents`\n
  ${client.shard ? `Shard ID: ${client.shard.id}\n` : ''}
  ${warning.stack}
`, 'warning')
}

client.login(client.config.startSettings.token)
.catch(error => client.log.error(stripIndents`\n
  ${client.shard ? `Shard ID: ${client.shard.id}\n` : ''}
  ${error.stack}
`, 'Login'))
