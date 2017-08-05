const cmd = require('./commands.js')
const Command = cmd.Command
// Now we create an array to store all of the commands in this file
// 'this' is required so we can access it from the main file.
this.commands = []
// now, we add (push) a command
// you can make this one but stop at the code arg
// just to clarify you are essentially filling out a form for a command
this.commands.push(new Command(`help`, `Prints out all current commands.`, function (input) {
  // inside of here is where the code goes for a command
  // define the message we will send. start out by saying...
  let msg = 'Here is a list of all current commands:```'
  // next, add on for each command
  for (let c of input.commands) {
    msg += '\n' + c.name + ' - ' + c.description
  }
  // then, finish off codeblock
  msg += '```'
  // finally, print the message out
  input.msg.channel.sendMessage(msg)
}))
