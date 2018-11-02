const { Command } = require('discord.js-commando')
const screenshot = require('screenshot-desktop')
const path = require('path')
const fs = require('fs')

module.exports = class ScreenshotCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'screenshot',
      memberName: 'screenshot',
      group: 'personal',
      description: 'Fetch a screenshot from the host system.',
      aliases: [
        'whatisacedoing',
        'spyonace',
        'acescreen',
        'acesscreen'
      ],
      clientPermissions: [
        'EMBED_LINKS',
        'ATTACH_FILES'
      ]
      // throttling: {
      //   usages: 2,
      //   duration: 10
      // }
    })
  }

  async run (message, args) {
    var randText = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
    var name = ''
    for (var i = 0; i < 32; i++) {
      name += randText.charAt(Math.floor(Math.random() * randText.length))
    }

    var responses = [
      'Ace obviously hard at work.',
      'And here we see Ace doing something.',
      'And here we see Ace doing what ever the hell he\'s doing on his computer',
      'Clearly Ace\'s computer.',
      'Here you go!',
      'Just another normal day on a computer.',
      'Looks important to me.',
      'Looks like Ace\'s screen.',
      'NOOOOOO! DON\'T LOOK!',
      'Nothing to see here.',
      'Rip privacy!',
      'Screenshots away!',
      'Secretly this isn\'t Ace\'s computer.',
      'Spying on Ace are we now?',
      'You stalker!',
      'Your daily dose of **Aceheliflyer**.',
      '👀'
    ]
    var filePath = `${path.join(process.cwd(), './temp/')}${name}.png`
    message.channel.startTyping()
    await message.embed({
      description: responses[Math.floor(Math.random() * responses.length)],
      files: [await screenshot({ filename: filePath })],
      color: this.client.getClientColor(message)
    })
    message.channel.stopTyping()

    if (await fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath)
      } catch (error) { }
    }
  }
}
