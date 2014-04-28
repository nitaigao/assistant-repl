package main

import "fmt"
import "io"
import "os"
import "strings"
import "bufio"

type ReplReadLoop struct { }

func (r* ReplReadLoop) startLoop(sendToServer func(input string)) {
  var shellCommands = [...] ShellCommand { { "q", "quit" }, { "e", "exit" } }

  var quit bool
  var input string

  var stdinReader io.Reader = os.Stdin
  var bufioReader = bufio.NewReader(stdinReader)

  for {
    fmt.Print("> ")
    input, _ = bufioReader.ReadString('\n')
    input = strings.TrimSpace(input)

    for _, v := range shellCommands {
      if v.Execute(input) {
        quit = true
      }
    }

    if !quit {
      fmt.Println(input)
      go sendToServer(input)
    }

    if quit {
      break
    }
  }
}
