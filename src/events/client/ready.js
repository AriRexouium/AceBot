const pluralize = require('pluralize')
const { oneLine } = require('common-tags')

module.exports = async (client) => {
  await client.log('success', `Logged in as ${client.user.tag} (${client.user.id}).`, 'Discord', 'Login')

  await setTimeout(() => {
    client.user.setStatus(client.provider.get('global', 'clientStatus', 'online')).then(
      client.user.setActivity(oneLine`
        ${client.options.commandPrefix}help |
        ${pluralize('Server', client.guilds.size.toLocaleString(), true)} |
        ${pluralize('User', client.users.size.toLocaleString(), true)}
        ${client.shard ? ` | Shard ${client.shard.id}` : ''}
      `)
    )
  }, 1000)

  await setInterval(() => {
    client.user.setStatus(client.provider.get('global', 'clientStatus', 'online')).then(
      client.user.setActivity(oneLine`
        ${client.options.commandPrefix}help |
        ${pluralize('Server', client.guilds.size.toLocaleString(), true)} |
        ${pluralize('User', client.users.size.toLocaleString(), true)}
        ${client.shard ? ` | Shard ${client.shard.id}` : ''}
      `)
    )
  }, 600000)

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
        content: '',
        username: client.user.username,
        avatarURL: client.user.displayAvatarURL(),
        embeds: [{
          author: { name: client.user.tag, icon_url: client.user.displayAvatarURL() },
          footer: { text: 'ready' },
          timestamp: new Date(),
          title: `ready${client.shard ? ` | Shard ID: ${client.shard.id}` : ''}`,
          description: `${client.shard ? `Shard ${client.shard.id}` : 'Master'} is ready!`,
          color: 0x00AA00
        }]
      })
    }
  }

  /* ************************************************** */

  /* Bot List */
  // http://discordbots.org
  if (client.config.botlist.DiscordBotsOrg.enabled === true) {
    try { client.discordbotsorg(client) } catch (error) { client.log('error', error) }
    setInterval(() => {
      try { client.discordbotsorg(client) } catch (error) { client.log('error', error) }
    }, client.config.botlist.DiscordBotsOrg.refreshRate)
  }
  // http://bots.discord.pw
  if (client.config.botlist.BotsDiscordPw.enabled === true) {
    try { client.botsdiscordpw(client) } catch (error) { client.log('error', error) }
    setInterval(() => {
      try { client.botsdiscordpw(client) } catch (error) { client.log('error', error) }
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
