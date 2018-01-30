const discord = require('discord.js')
const fs = require('fs')
const yaml = require('js-yaml')
const config = yaml.safeLoad(fs.readFileSync('./config/config.yml', 'utf8'))
const log = require('./log.js')
const webhookClient = new discord.WebhookClient(
  config.webhookConfig.webhookID,
  config.webhookConfig.webhookToken
)
/**
 * Send message through config webhook.
 * @param {string} text The text to send.
 * @return {any} Returns true if the webhook was sent.
 */
module.exports = function (text) {
  if (text) {
    webhookClient.send(text).catch(error => log.error(error, 'Webhook'))
    return true
  } else {
    process.emitWarning('text cannot be undefined', 'WebhookError')
  }
}
