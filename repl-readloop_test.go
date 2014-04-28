package main

import "testing"
import "fmt"

type TestShellCommand struct {
  ShellCommand
  CallCount int
}

func (q *TestShellCommand) Execute(readLoop* ReplReadLoop) {
  q.CallCount++
}

func NewTestShellCommand() *TestShellCommand {
  var command = new (TestShellCommand)
  command.shortcut = "t"
  command.command = "test"
  return command
}

func TestReadLoopCallsHandlers(t *testing.T) {
  var testCommand = NewTestShellCommand()

  var shellCommands = make([]IShellCommand, 0)
  shellCommands = append(shellCommands, testCommand)

  var readLoop = ReplReadLoop { shellCommands, false }
  readLoop.processInput("hello")

  if (testCommand.CallCount > 0) {
    t.Fail()
  }

  readLoop.processInput("test")

  fmt.Println(testCommand.CallCount)

  if (testCommand.CallCount <= 0) {
    t.Fail()
  }
}
