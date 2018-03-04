const { Command } = require('discord.js-commando')
const { stripIndents } = require('common-tags')
const standard = require('standard')

module.exports = class EvalCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'lint',
      memberName: 'lint',
      group: 'utility',
      description: 'Lints JavaScript code in the JavaScript Standard Style',
      details: 'Allows users to lint arbitrary JavaScript in the JavaScript Standard Style',
      aliases: [
        'standard'
      ],
      clientPermissions: [
        'EMBED_LINKS'
      ],
      args: [
        {
          key: 'code',
          prompt: 'What code would you like to lint?',
          type: 'string'
        }
      ]
    })
  }

  async run (message, args) {
    var clientColor
    if (message.guild) {
      clientColor = message.guild.members.get(this.client.user.id).displayHexColor
      if (clientColor === '#000000') { clientColor = 0x7289DA } else { clientColor = Number(clientColor.replace('#', '0x')) }
    } else {
      clientColor = 0x7289DA
    }

    var hrStart = await process.hrtime(this.hrStart)
    var lintResult = await standard.lintTextSync(`${args.code}\n`)
    var lintLatency = await process.hrtime(hrStart)

    var messages = lintResult.results[0].messages.map(m => stripIndents`
      **${m.ruleId ? m.ruleId : 'Error'} - (${m.line}:${m.column})**
      ❯ ${m.message}
    `).join('\n')

    message.embed({
      author: { name: this.client.user.tag, icon_url: this.client.user.displayAvatarURL() },
      footer: { text: message.author.tag, icon_url: message.author.displayAvatarURL() },
      timestamp: new Date(),
      title: `*Linted in ${lintLatency[0] > 0 ? `${lintLatency[0]}s ` : ''}${lintLatency[1] / 1000000}ms.*`,
      description: messages ? messages.slice(0, 2000) : '✅ Lint Success!',
      color: clientColor
    })
  }
}
