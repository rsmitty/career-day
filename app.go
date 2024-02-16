package main

import (
	"bytes"
	"context"
	"encoding/json"
	"io"
	"log"
	"net/http"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx          context.Context
	computerName string
	peerIP       string
}

type Msg struct {
	Message string
}

// NewApp creates a new App application struct
func NewApp(computerName string, peerIP string) *App {
	return &App{computerName: computerName, peerIP: peerIP}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx

	http.HandleFunc("/", a.getHello)
	go func() {
		log.Fatal(http.ListenAndServe(":8080", nil))
	}()
}
func (a *App) ComputerID() string {
	log.Printf(a.computerName)
	return a.computerName
}

func (a *App) SendMsg(messageToSend string) {

	log.Printf("going to send %s", messageToSend)
	msg := Msg{Message: messageToSend}

	marshalledMsg, _ := json.Marshal(msg)

	log.Printf("marshalled payload %+v", marshalledMsg)

	request, _ := http.NewRequest("POST", "http://"+a.peerIP+":8080", bytes.NewBuffer(marshalledMsg))

	client := &http.Client{}
	_, error := client.Do(request)
	if error != nil {
		panic(error)
	}

}
func (a *App) getHello(w http.ResponseWriter, r *http.Request) {
	log.Printf("got /hello request\n")

	defer r.Body.Close()
	body, _ := io.ReadAll(r.Body)

	runtime.EventsEmit(a.ctx, "hello_received", string(body))
}
