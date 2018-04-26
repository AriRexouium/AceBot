const { Command } = require('discord.js-commando')
const Pageres = require('pageres')
const fs = require('fs')
const path = require('path')

module.exports = class LookUpCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'lookup',
      memberName: 'lookup',
      group: 'utility',
      description: 'Gets an image from a website.',
      examples: [
        'lookup discordapp.com'
      ],
      throttling: {
        usages: 2,
        duration: 10
      },
      args: [
        {
          key: 'url',
          prompt: 'What site do you want to get?',
          type: 'string'
        }
      ]
    })
  }

  run (message, args) {
    var clientColor
    if (message.guild) {
      clientColor = message.guild.members.get(this.client.user.id).displayHexColor
      if (clientColor === '#000000') { clientColor = 0x7289DA } else { clientColor = Number(clientColor.replace('#', '0x')) }
    } else {
      clientColor = 0x7289DA
    }

    var randText = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
    var name = ''
    for (var i = 0; i < 32; i++) {
      name += randText.charAt(Math.floor(Math.random() * randText.length))
    }

    setTimeout(() => {
      message.channel.startTyping()
      new Pageres({ delay: 3 })
        .src(args.url, ['1920x1080'], { crop: true, filename: name })
        .dest(path.join(process.cwd(), './temp'))
        .run()
        .catch(() => { message.reply('there was an error getting that site.') })
        .then(async () => {
          await message.embed({
            description: `Screenshot from ${args.url}`,
            files: [ `${path.join(process.cwd(), './temp/')}${name}.png` ],
            color: clientColor
          })
          message.channel.stopTyping()
          fs.unlinkSync(`${path.join(process.cwd(), './temp/')}${name}.png`)
        })
    }, 0)
  }
}
