package main

import "fmt"
import "io"
import "os"
import "strings"
import "bufio"
import "net/url"
import "net/http"

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
	http.PostForm("http://localhost:8080", url.Values{"text":{c.text}})
	return
}

func sayHandler(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	fmt.Println(r.FormValue("text"))
}

func startResponder() {
	http.HandleFunc("/say", sayHandler)
	http.ListenAndServe(":7000", nil)
}

func main() {

	go startResponder()

	var shellCommands = [...] ShellCommand { { "q", "quit" } }

	http.PostForm("http://localhost:8080/register", url.Values{"host":{"localhost"}, "port":{"7000"}})

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