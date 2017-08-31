// Constants
const Discord = require('discord.js')
const bot = new Discord.Client()
const config = require('./config.json')
const chalk = require('chalk')

// Boot message and dividers
let line = chalk.red(`====================`)
console.log(line)
console.log(chalk.bgRed.black(`BOOT`))
// Bot Ready And Information
bot.on('ready', () => {
    // Logging in
  console.log(chalk.green(`[${new Date()}] Logged in as "` + chalk.yellow.underline.bold(`${bot.user.username} (${bot.user.id})` + chalk.green(`"!`))))
  console.log(chalk.green(`[${new Date()}] Bot is now online!`))
    // Line
  console.log(line)
    // Guilds Avaliable
  console.log(chalk.gray(`Guilds Avaliable: ${bot.guilds.size}`))
  console.log(chalk.magenta(bot.guilds.map(g => g.name).join('\n')))
    // Set status & game
  console.log(line)
  let game = (`${config.prefix}help | ${bot.guilds.size} servers`)
  let status = (`online`)
  bot.user.setGame(game)
  console.log(chalk.magenta(`Set boot game to: "${game}"!`))
  bot.user.setStatus(status)
  console.log(chalk.magenta(`Set boot status to: "${status}"!`))
    // Line
  console.log(line)
})

// Debug Messages
bot.on('debug', e => {
  console.log(chalk.blue(`[${new Date()}] ${e}`))
})

// Warn Messages
bot.on('warn', e => {
  console.log(chalk.yellow(`[${new Date()}] ${e}`))
})

// Error Messages
bot.on('error', e => {
  console.log(chalk.red(`[${new Date()}] ${e}`))
})

// Bot Reconnect / Disconnect Messages
bot.on('reconnecting', () => {
  console.log(chalk.bgYellow.black(`Reconnecting at ${new Date()}!`))
})

bot.on('disconnect', () => {
  console.log(chalk.bgYellow.black(`Bot Disconnected at ${new Date()}!`))
})

// Client Server Join / Leave Messages
bot.on('guildMemberAdd', member => {
  let guild = member.guild
  guild.defaultChannel.sendMessage(`Welcome ${member.user} to the server!`)
})

bot.on('guildMemberRemove', member => {
  let guild = member.guild
  guild.defaultChannel.sendMessage(`${member.user.username} left the server.`)
})

// Client Server Ban / Unban Messages
bot.on('guildBanAdd', (guild, user) => {
  guild.defaultChannel.sendMessage(`${user.username} was banned from the server!`)
})

bot.on('guildBanRemove', (guild, user) => {
  guild.defaultChannel.sendMessage(`${user.username} was unbanned from the server!`)
})

// Bot Join / Leave Alerts
bot.on('guildCreate', guild => {
  let game = (`${config.prefix}help | ${bot.guilds.size} servers`)
  guild.defaultChannel.sendMessage(`Hello everyone! I am an official bot developed by **Aceheliflyer#0950**!\nJoin our server if you need any help! <${config.discord}>`)
  console.log(`I have joined ${guild.name} at ${new Date()}.`)
  bot.user.setGame(game)
})

bot.on('guildDelete', guild => {
  let game = (`${config.prefix}help | ${bot.guilds.size} servers`)
  console.log(`I have left ${guild.name} at ${new Date()}.`)
  bot.user.setGame(game)
})

// Server Pins Update
bot.on('channelPinsUpdate', (channel, time) => {
  channel.guild.defaultChannel.sendMessage(`The pins for ${channel} have been updated at ${time}!`)
})

// Server Role Create / Delete Messages
bot.on('roleCreate', role => {
  let guild = role.guild
  guild.defaultChannel.sendMessage(`A role called "${role.name}" has been created!`)
})

bot.on('roleDelete', role => {
  let guild = role.guild
  guild.defaultChannel.sendMessage(`A role called "${role.name}" has been deleted!`)
})

// Commands
let commands = []
const fs = require('fs')
fs.readdir('./commands/', function (error, files) {
  if (error) {
    return
  }
  const ending = '.js'
  for (let file of files) {
    if (file.slice(-ending.length) === ending && file !== 'commands.js') {
      let set = require('./commands/' + file)
      if (set.commands != null) {
        commands = commands.concat(set.commands)
      }
    }
  }
})
bot.on('message', message => {
  if (message.author.bot) return
  if (!message.content.startsWith(config.prefix)) return
  let command = message.content.split(' ')[0]

  for (const command2 of commands) {
    if (command === config.prefix + command2.name) {
      const CommandInput = class {
        constructor (msg) {
          this.msg = msg
          this.commands = commands
          this.bot = bot
          this.config = config
        }
        }
      command2.code(new CommandInput(message))
    }
  }
  command = command.slice(config.prefix.length)
})
// Bot Login
bot.login(config.token)
console.log(chalk.green(`[${new Date()}] Bot Logged In!`))
