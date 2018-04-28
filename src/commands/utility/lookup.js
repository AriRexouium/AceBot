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
      description: 'Generates a screenshot of a website.',
      examples: [
        'lookup discordapp.com'
      ],
      clientPermissions: [
        'EMBED_LINKS',
        'ATTACH_FILES'
      ],
      throttling: {
        usages: 2,
        duration: 10
      },
      args: [
        {
          key: 'url',
          prompt: 'What website do you want to lookup?',
          type: 'string'
        }
      ]
    })
  }

  run (message, args) {
    var randText = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
    var name = ''
    for (var i = 0; i < 32; i++) {
      name += randText.charAt(Math.floor(Math.random() * randText.length))
    }

    setTimeout(() => {
      message.channel.startTyping()
      var error = false
      var filePath = `${path.join(process.cwd(), './temp/')}${name}.png`
      new Pageres({ delay: 3 })
        .src(args.url, ['1920x1080'], { crop: true, filename: name })
        .dest(path.join(process.cwd(), './temp'))
        .run()
        .catch(() => { error = true })
        .then(async () => {
          if (error) {
            await message.reply('there was an error getting that website.')
          } else {
            await message.embed({
              description: `Screenshot from ${args.url}`,
              files: [ filePath ],
              color: this.client.getClientColor(message)
            })
            if (await fs.existsSync(filePath)) {
              try {
                fs.unlinkSync(filePath)
              } catch (error) {}
            }
          }
          message.channel.stopTyping()
        })
    }, 0)
  }
}
