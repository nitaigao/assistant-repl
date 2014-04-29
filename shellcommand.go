package main

import "fmt"

type IShellCommand interface {
  Execute(readLoop* ReplReadLoop)
  ShouldExecute(input string) bool
}

type ShellCommand struct {
  shortcut string
  command string
}

func (s ShellCommand) ShouldExecute(input string) bool {
  return input == s.shortcut || input == s.command
}

func (s* ShellCommand) Execute() {
  fmt.Println("Executing Base Shell Command")
}
