const fs = require('fs')
const sqlite = require('sqlite')
const { stripIndents } = require('common-tags')
const path = require('path')
const config = require('./config/config.json')
const { CommandoClient, SQLiteProvider } = require('discord.js-commando')
const client = new CommandoClient({
  selfbot: false,
  commandPrefix: config.startConfig.commandPrefix,
  commandEditableDuration: config.startConfig.commandEditableDuration,
  nonCommandEditable: config.startConfig.nonCommandEditable,
  unknownCommandResponse: config.startConfig.unknownCommandResponse,
  owner: config.startConfig.owner,
  invite: config.startConfig.invite
})
const botStats = { clientMentions: 0, commandsUsed: 0, messagesRecieved: 0, messagesSent: 0 }
client.botStats = botStats
client.config = config
client.lastSetStatus = config.loginConfig.defaultStatus

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

for (let file of getFiles('/clientEvents')) {
  const clientEventName = file.split('.')[0].substring(14)
  const clientEvent = require(`./${file}`)
  client.on(clientEventName, clientEvent.bind(null, client))
  delete require.cache[require.resolve(`./${file}`)]
}
client.log.info(`Successfully loaded ${getFiles('/clientEvents').length} client events.`, 'clientEvent Loader')

for (let file of getFiles('/processEvents')) {
  const processEventName = file.split('.')[0].substring(15)
  const processEvent = require(`./${file}`)
  process.on(processEventName, processEvent.bind(null, client))
  delete require.cache[require.resolve(`./${file}`)]
}
client.log.info(`Successfully loaded ${getFiles('/processEvents').length} process events.`, 'processEvent Loader')

sqlite.open(path.join(__dirname, './config/serverConfig.sqlite3')).then((db) => {
  client.setProvider(new SQLiteProvider(db))
}).then(client.log.info(`Successfully loaded serverConfig file.`, 'SQLite Loader'))

client.dispatcher.addInhibitor(message => {
  const blacklist = client.provider.get('global', 'userBlacklist', [])
  if (!blacklist.includes(message.author.id)) return false
  message.reply('you are blacklisted.')
  return 'blacklisted'
})

client.login(client.config.loginConfig.token)
.catch(error => client.log.error(stripIndents`\n
  ${client.shard ? `Shard ID: ${client.shard.id}\n` : ''}
  ${error.stack}
`, 'Login'))
