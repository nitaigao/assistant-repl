package main

import "fmt"
import "net/http"
import "net/url"

func sayHandler(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	fmt.Println(r.FormValue("result"))
}

func startResponder() {
	http.HandleFunc("/", sayHandler)
	http.ListenAndServe(":7000", nil)
}

func sendToServer(input string) {
	http.PostForm("http://localhost:8080", url.Values{"text":{input}, "callback":{"http://localhost:7000"}})
}

func main() {
	go startResponder()

	var readLoop = ReplReadLoop{}
	readLoop.startLoop(sendToServer)
}
