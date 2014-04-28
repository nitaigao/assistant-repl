package main

type ShellCommand struct {
  shortcut string
  command string
}

func (s *ShellCommand) Execute(input string) (bool) {
  return input == s.shortcut || input == s.command
}
