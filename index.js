const fs = require('fs')
const sqlite = require('sqlite')
const path = require('path')
const config = require('./config/config.json')
const { CommandoClient, SQLiteProvider } = require('discord.js-commando')
const client = new CommandoClient({
  selfbot: config.startSettings.selfbot,
  commandPrefix: config.startSettings.commandPrefix,
  commandEditableDuration: config.startSettings.commandEditableDuration,
  nonCommandEditable: config.startSettings.nonCommandEditable,
  unknownCommandResponse: config.startSettings.unknownCommandResponse,
  owner: config.startSettings.owner,
  invite: config.startSettings.invite
})
client.log = require('./modules/logger.js')
client.config = config
const botStats = { clientMentions: 0, commandsUsed: 0, messagesRecieved: 0, messagesSent: 0 }
client.botStats = botStats

client.registry
.registerDefaultTypes()
.registerDefaultGroups()
.registerCommandsIn(path.join(__dirname, 'commands'))
.registerDefaultCommands({
  ping: false
})
.registerGroups([
  ['bot-staff', 'Bot Staff']
])

fs.readdir('./events/', (error, files) => {
  if (error) client.log.error(error, 'Event Loader')
  client.log.info(`Loading ${files.length} events.`, 'Event Loader')
  files.forEach(file => {
    const eventName = file.split('.')[0]
    const event = require(`./events/${file}`)
    client.on(eventName, event.bind(null, client))
    delete require.cache[require.resolve(`./events/${file}`)]
  })
})

sqlite.open(path.join(__dirname, './config/serverConfig.sqlite3')).then((db) => {
  client.setProvider(new SQLiteProvider(db))
})

client.login(client.config.startSettings.token)
