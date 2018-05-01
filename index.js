/* Misc */
const { oneLine, stripIndents } = require('common-tags')
const pluralize = require('pluralize')

/* Files */
process.chdir(__dirname)
const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const clientConfig = yaml.safeLoad(fs.readFileSync('./src/config/client.yml', 'utf8'))
const clientOptions = yaml.safeLoad(fs.readFileSync('./src/config/clientOptions.yml', 'utf8'))
const sqlConfig = yaml.safeLoad(fs.readFileSync('./src/config/sql.yml', 'utf8'))

/* Database */
const sqlite = require('sqlite')
const MySQL = require('mysql2/promise')
const MySQLProvider = require('discord.js-commando-mysqlprovider')

/* **************************************************************************************************** *\
Load Commando Client
\* **************************************************************************************************** */
const { CommandoClient, SQLiteProvider } = require('discord.js-commando')
const client = new CommandoClient({
  // Client Options
  apiRequestMethod: clientOptions.apiRequestMethod,
  messageCacheMaxSize: clientOptions.messageCacheMaxSize,
  messageCacheLifetime: clientOptions.messageCacheLifetime,
  messageSweepInterval: clientOptions.messageSweepInterval,
  fetchAllMembers: clientOptions.fetchAllMembers,
  disableEveryone: clientOptions.disableEveryone,
  disabledEvents: clientOptions.disabledEvents,
  // Commando Options
  commandPrefix: clientConfig.commandPrefix,
  commandEditableDuration: clientConfig.commandEditableDuration,
  nonCommandEditable: clientConfig.nonCommandEditable,
  unknownCommandResponse: false,
  invite: clientConfig.invite,
  owner: []
})

/* **************************************************************************************************** *\
Load SQL Provider
\* **************************************************************************************************** */
if (sqlConfig.useMySQL === false) {
  sqlite.open(path.join(__dirname, './src/config/database.sqlite'))
    .then((db) => {
      client.setProvider(new SQLiteProvider(db))
    })
} else {
  MySQL.createConnection({
    host: sqlConfig.host,
    port: sqlConfig.port,
    user: sqlConfig.user,
    password: sqlConfig.password,
    database: sqlConfig.database
  })
    .then((db, error) => {
      client.setProvider(new MySQLProvider(db))
    })
}

/* **************************************************************************************************** *\
Functions
\* **************************************************************************************************** */
/**
 * Lists the files in a directory.
 * @param {string} dir The directory that you want to get a list of files from.
 * @param {string} filter The file type you want to get. IE: `js`
 * @return {Array<string>} Returns all the file names.
 */
var listFiles = (dir, filter) => {
  var files = fs.readdirSync(dir).filter(f => fs.statSync(path.join(dir, f)).isFile())
  if (filter) {
    return files.filter(file => file.endsWith(`.${filter}`))
  } else {
    return files
  }
}

/**
 * Lists the directories in a directory.
 * @param {string} dir The directory that you want to get a list of directories from.
 * @return {Array<string>} Returns all the folder names.
 */
var listDirs = dir => {
  return fs.readdirSync(dir).filter(f => fs.statSync(path.join(dir, f)).isDirectory())
}

/**
 * Capitalizes a word.
 * @param {string} char The word you want to capitalize.
 * @return {string} The new capitalized word
 */
var capitalize = char => {
  return char.charAt(0).toUpperCase() + char.slice(1)
}

/* **************************************************************************************************** *\
Automatic Group Loading System
\* **************************************************************************************************** */
/**
 * Converts something like `bot-staff` to `Bot Staff`.
 * @param {string} str The string you want to convert to a group name.
 * @return {string} The string after it was converted to a group name.
 */
var createGroup = str => {
  var arr = str.split('-')
  var temp = []
  arr.forEach(char => {
    char = capitalize(char)
    temp.push(char)
  })
  str = temp.join(' ')
  return str
}

var groups = []
listDirs('./src/commands').forEach(group => {
  groups.push([group, createGroup(group)])
})

/* **************************************************************************************************** *\
Load Client Registry
\* **************************************************************************************************** */
client.registry
  .registerDefaultTypes()
  .registerTypesIn(path.join(__dirname, './src/types'))
  .registerGroups(groups)
  .registerCommandsIn(path.join(__dirname, './src/commands'))

/* **************************************************************************************************** *\
Load Modules
\* **************************************************************************************************** */
listFiles('./src/modules', 'js').forEach(clientModule => {
  client[clientModule.split('.')[0]] = require(`./src/modules/${clientModule}`).bind(null, client)
  delete require.cache[require.resolve(`./src/modules/${clientModule}`)]
})

client.log('success', oneLine`
  Initialized ${listFiles('./src/modules', 'js').length}
  ${pluralize('module', listFiles('./src/modules', 'js').length, false)}!
`, 'Initializer', 'Module')

/* **************************************************************************************************** *\
Load Client Configuration
\* **************************************************************************************************** */
client.config = {}
listFiles('./src/config', 'yml').forEach(config => {
  client.config[config.split('.')[0]] = yaml.safeLoad(fs.readFileSync(`./src/config/${config}`, 'utf8'))
  delete require.cache[require.resolve(`./src/config/${config}`)]
})

/* **************************************************************************************************** *\
Load All Events
\* **************************************************************************************************** */
var events = []
// You will have to manually add event emitters here because apparently you can use `[event.type]on( //etc )`.
let eventEmitters = { client, process }

listDirs('./src/events').forEach(directory => {
  events.push({
    type: directory,
    location: `./src/events/${directory}/`
  })
})

events.forEach(event => {
  var files = listFiles(event.location, 'js')
  var type = capitalize(event.type)
  files.forEach(file => {
    eventEmitters[event.type].on(file.split('.')[0], require(`${event.location}${file}`).bind(null, client))
    delete require.cache[require.resolve(`${event.location}${file}`)]
  })
  client.log('success', oneLine`
    Initialized ${files.length} ${type}
    ${pluralize('event', files.length, false)}!
    `, 'Initializer', `${type} Events`)
})

/* **************************************************************************************************** *\
Load Commando Inhibitors
\* **************************************************************************************************** */
listFiles('./src/inhibitors', 'js').forEach(inhibitor => {
  client.dispatcher.addInhibitor(require(`./src/inhibitors/${inhibitor}`).bind(null, client))
  delete require.cache[require.resolve(`./src/inhibitors/${inhibitor}`)]
})

/* **************************************************************************************************** *\
Load Misc Data
\* **************************************************************************************************** */
client.temp = {}
// Most Recent Error
client.temp.error = ''

// Tunnel System
client.temp.tunnels = []

// Travis Test Mode
if (process.argv.includes('--travis')) {
  client.temp.travis = true
} else {
  client.temp.travis = false
}

// Bot Stats
const botStats = { clientMentions: 0, commandsUsed: 0, messagesReceived: 0, messagesSent: 0 }
client.botStats = botStats

/* **************************************************************************************************** *\
Login
\* **************************************************************************************************** */
var token
if (client.temp.travis === true) {
  token = process.env.TRAVISTOKEN
} else if (client.config.client.token) {
  token = client.config.client.token
}

client.log('info', 'Attempting login...', 'Client', 'Login')
client.login(token).catch(error => {
  client.log('error', stripIndents`\n
  ${client.shard ? `Shard ID: ${client.shard.id}\n` : ''}
  ${error.stack}
  `, '', 'Login').then(process.exit(8))
})
