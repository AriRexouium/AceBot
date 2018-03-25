const { Command } = require('discord.js-commando')
const { escapeMarkdown } = require('discord.js')

module.exports = class ContactCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'contact',
      memberName: 'contact',
      group: 'bot-staff',
      description: 'Sends a message to the owner(s).',
      details: 'Sends a message to the owner(s). Abusing this will lead to be blacklisted from the bot.',
      throttling: {
        usages: 2,
        duration: 300
      },
      args: [
        {
          key: 'text',
          label: 'message',
          prompt: 'What would you like to send to the owner(s)?',
          type: 'string'
        }
      ],
      guarded: true
    })
  }

  async run (message, args) {
    const owners = this.client.options.owner
    await owners.forEach(owner => {
      this.client.users.get(owner).send({
        content: '',
        embed: {
          author: { name: this.client.user.tag, icon_url: message.author.displayAvatarURL() },
          footer: {
            text: message.channel.type === 'dm'
              ? `User ID: ${message.author.id}`
              : `User ID: ${message.author.id} | Server ID: ${message.guild.id}`
          },
          timestamp: new Date(),
          title: `Sent by ${escapeMarkdown(message.author.tag)} ${message.channel.type === 'dm' ? 'through DM' : `from ${message.guild.name}`}`,
          description: args.text,
          color: 0x7289DA
        }
      })
    })
    await message.reply('your message has been sent.')
  }
}
