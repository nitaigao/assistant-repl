package main

import "fmt"
import "io"
import "os"
import "strings"
import "bufio"

type ReplReadLoop struct {
  ShellCommands [] IShellCommand
  Quit bool
}

func (r* ReplReadLoop) endLoop() {
  r.Quit = true
}

func (r* ReplReadLoop) processInput(input string) {
  for _, v := range r.ShellCommands {
    if v.ShouldExecute(input) {
      v.Execute(r)
    }
  }
}

func (r* ReplReadLoop) startLoop(sendToServer func(input string)) {
  var input string

  var stdinReader io.Reader = os.Stdin
  var bufioReader = bufio.NewReader(stdinReader)

  for {
    fmt.Print("> ")
    input, _ = bufioReader.ReadString('\n')
    input = strings.TrimSpace(input)

    r.processInput(input)

    if !r.Quit {
      fmt.Println(input)
      go sendToServer(input)
    }

    if r.Quit {
      break
    }
  }
}
