package main

type QuitShellCommand struct {
  ShellCommand
}

func (q QuitShellCommand) Execute(readLoop* ReplReadLoop) {
  readLoop.endLoop()
}

func NewQuitShellCommand() QuitShellCommand {
  var command = QuitShellCommand { }
  command.shortcut = "q"
  command.command = "quit"
  return command
}
