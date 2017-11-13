const discord = require('discord.js')
const config = require('../config/config.json')
const log = require('./log.js')
const webhookClient = new discord.WebhookClient(
  config.webhookConfig.webhookID,
  config.webhookConfig.webhookToken
)

module.exports = function (text) {
  if (text) {
    webhookClient.send(text).catch(error => log.error(error, 'Webhook'))
  } else {
    process.emitWarning('text cannot be undefined', 'WebhookError')
  }
}
