const fs = require('fs')
const yaml = require('js-yaml')
const clientConfig = yaml.safeLoad(fs.readFileSync('./config/client.yml', 'utf8'))
const path = require('path')
const sqlite = require('sqlite')
const { oneLine, stripIndents } = require('common-tags')
const pluralize = require('pluralize')

// Commando
const { CommandoClient, SQLiteProvider } = require('discord.js-commando')
const client = new CommandoClient({
  selfbot: false,
  commandPrefix: clientConfig.commandPrefix,
  commandEditableDuration: clientConfig.commandEditableDuration,
  nonCommandEditable: clientConfig.nonCommandEditable,
  unknownCommandResponse: clientConfig.unknownCommandResponse,
  owner: clientConfig.owner,
  invite: clientConfig.invite
})

// Commands / Groups / Types
client.registry
  .registerDefaultTypes()
  .registerGroups([
    ['bot-management', 'Bot Management'],
    ['bot-staff', 'Bot Staff'],
    ['information', 'Information'],
    ['time', 'Time'],
    ['utility', 'Utility']
  ])
  .registerCommandsIn(path.join(__dirname, 'commands'))

/**
 * Checks to see if the file exists.
 * @param {string} source The file.
 * @return {boolean} Whether the file exists or not.
 */
const isFile = source => fs.lstatSync(source).isFile()

/**
 * Gets all files in a given directory.
 * @param {string} source The directory.
 * @return {string[]} List of the files in the directory.
 */
let getFiles = source => {
  let files = fs.readdirSync(__dirname + source).map(name => path.join(__dirname + source, name)).filter(isFile) // eslint-disable-line no-path-concat
  for (let file in files) {
    files[file] = files[file].slice(__dirname.length)
  }
  return files
}

// Load Modules  // Loading modules first so the logger can be used.
for (let file of getFiles('/modules')) {
  const moduleName = file.split('.')[0].substring(9)
  const moduleFile = require(`./${file}`)
  client[moduleName] = moduleFile
  delete require.cache[require.resolve(`./${file}`)]
}
client.log.info(oneLine`
  Initialized ${getFiles('/modules').length} ${pluralize('module', getFiles('/modules').length, false)}!
`, 'Module Initializer')

client.config = {}
// Load all configurations to client.
for (let file of getFiles('/config')) {
  const configFileName = file.split('.')[0].substring(8)
  if (configFileName !== 'database') {
    const configFileContents = yaml.safeLoad(fs.readFileSync(`./${file}`, 'utf8'))
    client.config[configFileName] = configFileContents
    delete require.cache[require.resolve(`./${file}`)]
  }
}
// Load processEvents
for (let file of getFiles('/processEvents')) {
  const processEventName = file.split('.')[0].substring(15)
  const processEvent = require(`./${file}`)
  process.on(processEventName, processEvent.bind(null, client))
  delete require.cache[require.resolve(`./${file}`)]
}
client.log.info(oneLine`
  Initialized ${getFiles('/processEvents').length}
  process ${pluralize('event', getFiles('/processEvents').length, false)}!
`, 'processEvent Initializer')

// Load clientEvents
for (let file of getFiles('/clientEvents')) {
  const clientEventName = file.split('.')[0].substring(14)
  const clientEvent = require(`./${file}`)
  client.on(clientEventName, clientEvent.bind(null, client))
  delete require.cache[require.resolve(`./${file}`)]
}
client.log.info(oneLine`
  Initialized ${getFiles('/clientEvents').length}
  client ${pluralize('event', getFiles('/clientEvents').length, false)}!
`, 'clientEvent Initializer')

// SQLite Provider
sqlite.open(path.join(__dirname, './config/database.sqlite')).then((db) => {
  client.setProvider(new SQLiteProvider(db))
}).then(client.log.info(`Initialized SQLite Provider!`, 'SQLite Initializer'))

// User Blacklist
client.dispatcher.addInhibitor(message => {
  const blacklist = client.provider.get('global', 'userBlacklist', [])
  if (!blacklist.includes(message.author.id)) return false
  message.reply('you are blacklisted.')
  return 'blacklist'
})

// Lockdown
// TODO: Add lockdown system.
client.dispatcher.addInhibitor(message => {
  const lockdown = client.provider.get('global', 'lockdown', false)
  if (!lockdown) return false
  message.reply('sorry, but the bot is currently on lockdown.')
  return 'lockdown'
})

/* Start Assigning to Client */
// Travis Test Mode
if (process.argv[2] === '--travis-test') { client.travisTest = true } else { client.travisTest = false }

// Bot Stats
const botStats = { clientMentions: 0, commandsUsed: 0, messagesReceived: 0, messagesSent: 0 }
client.botStats = botStats
/* Stop Assigning to Client */

// Login
var token
if (client.travisTest === true) {
  token = process.env.TRAVISTOKEN
} else if (client.config.client.token) {
  token = client.config.client.token
} else {
  client.log.error('No valid token!', 'Login').then(process.exit(1))
}

client.login(token).catch(error => {
  client.log.error(stripIndents`\n
  ${client.shard ? `Shard ID: ${client.shard.id}\n` : ''}
  ${error.stack}
  `, 'Login').then(process.exit(8))
})
