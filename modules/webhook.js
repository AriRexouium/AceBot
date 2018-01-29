const discord = require('discord.js')
const fs = require('fs')
const yaml = require('js-yaml')
const config = yaml.safeLoad(fs.readFileSync('./config/config.yaml', 'utf8'))
const log = require('./log.js')
const webhookClient = new discord.WebhookClient(
  config.webhookConfig.webhookID,
  config.webhookConfig.webhookToken
)
/**
 * Send message through config webhook.
 * @param {any} text
 * @return {any}
 */
module.exports = function (text) {
  if (text) {
    webhookClient.send(text).catch(error => log.error(error, 'Webhook'))
  } else {
    process.emitWarning('text cannot be undefined', 'WebhookError')
  }
}
