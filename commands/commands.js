
//DO NOT DELETE THIS

//This is a class, classes are variables that store multiple things.
//This way instead of taking in a bunch of values we only need one variable
//module.exports is there so we can use this class throughout files
module.exports.Command = class Command {
  constructor(name, description, code){
    this.name = name;
    this.description = description;
    this.code = code;
  }
}
