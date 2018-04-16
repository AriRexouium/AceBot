const pluralize = require('pluralize')
const { oneLine } = require('common-tags')

module.exports = async (client) => {
  await client.log('success', `Logged in as ${client.user.tag} (${client.user.id}).`, 'Discord', 'Login')

  if (client.config.gameConfig.enabled === true) {
    var games = client.config.gameConfig.games
    if (client.config.gameConfig.rotate === false) {
      client.user.setPresence(await calcPresence(client, games[0]))
      setInterval(async () => {
        client.user.setPresence(await calcPresence(client, games[0]))
      }, client.config.gameConfig.rotateTime)
    } else {
      client.user.setPresence(await calcPresence(client, games[Math.floor(Math.random() * games.length)]))
      setInterval(async () => {
        client.user.setPresence(await calcPresence(client, games[Math.floor(Math.random() * games.length)]))
      }, client.config.gameConfig.rotateTime)
    }
  }

  await client.log('info', oneLine`
    ${client.shard ? `Shard ${client.shard.id} ready!` : 'Client Ready!'}
    Loaded ${pluralize('guild', client.guilds.size.toLocaleString(), true)},
    ${pluralize('channel', client.channels.size.toLocaleString(), true)}
    and ${pluralize('user', client.users.size.toLocaleString(), true)}.
  `, 'Client', 'Login')

  // Webhook
  if (client.config.webhook.enabled) {
    if (client.config.webhook.clientEvents.ready) {
      client.webhook({
        username: client.user.username,
        avatarURL: client.user.displayAvatarURL(),
        embeds: [{
          footer: { text: 'ready' },
          timestamp: new Date(),
          title: client.shard ? `Shard ${client.shard.id} is ready.` : 'Ready!',
          color: 0x00AA00
        }]
      })
    }
  }

  /* ************************************************** */

  /* Bot List */
  // http://discordbots.org
  if (client.config.botlist.DiscordBotsOrg.enabled === true) {
    try { client.discordbotsorg() } catch (error) { client.log('error', error) }
    setInterval(() => {
      try { client.discordbotsorg() } catch (error) { client.log('error', error) }
    }, client.config.botlist.DiscordBotsOrg.refreshRate)
  }
  // http://bots.discord.pw
  if (client.config.botlist.BotsDiscordPw.enabled === true) {
    try { client.botsdiscordpw() } catch (error) { client.log('error', error) }
    setInterval(() => {
      try { client.botsdiscordpw() } catch (error) { client.log('error', error) }
    }, client.config.botlist.BotsDiscordPw.refreshRate)
  }

  // Travis Tests
  if (client.travisTest === true) {
    await client.log('debug', 'Running in Travis CI mode, now exiting with 0 exit code in 5 seconds...', '', 'TRAVIS TEST')
    await setTimeout(() => { process.exit(0) }, 5000)
  }

  // Assign application owner as owner of the bot by default.
  client.fetchApplication().then(app => {
    let appOwner = client.options.owner.indexOf(app.owner.id) > -1
    if (appOwner === false) {
      client.options.owner.push(app.owner.id)
    }
  })
}

/**
 * Dynamic presence hander.
 * @param {object} game The object of the presence data.
 */
var calcPresence = (client, game) => {
  var presence = {}; presence.activity = {}
  // Presence Status
  if (game.status) {
    presence.status = game.status
  }
  // Activity Name
  if (game.activityName) {
    presence.activity.name = eval('`' + game.activityName + '`') // eslint-disable-line no-eval
  }
  // Activity Type
  if (game.activityType) {
    presence.activity.type = game.activityType
  }
  // Activity URL
  if (game.activityURL) {
    presence.activity.url = eval('`' + game.activityURL + '`') // eslint-disable-line no-eval
  }
  return presence
}
