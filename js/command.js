class Command {
  constructor(command, callback) {
    this.command = command.toLowerCase();
    this.execute = callback;
  }
}
