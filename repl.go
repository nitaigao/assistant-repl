package main

import "fmt"
import "io"
import "os"
import "strings"
import "bufio"
import "net/http"
import "net/url"

type ShellCommand struct {
	shortcut string
	command string
}

func (s *ShellCommand) Execute(input string) (bool) {
	return input == s.shortcut || input == s.command
}

type ConversationInput struct {
	text string
}

func (c *ConversationInput) AddToConversation() {
	http.PostForm("http://localhost:8080", url.Values{"text":{c.text}, "callback":{"http://localhost:7000"}})
}

func sayHandler(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	fmt.Println(r.FormValue("result"))
}

func startResponder() {
	http.HandleFunc("/", sayHandler)
	http.ListenAndServe(":7000", nil)
}

func main() {

	go startResponder()

	var shellCommands = [...] ShellCommand { { "q", "quit" } }

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
			var conversationInput = ConversationInput{ input }
			conversationInput.AddToConversation()
		}

		if quit {
			break
		}
	}
}
