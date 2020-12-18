package main

import (
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/gorilla/websocket"

	//"encoding/json"
	//"os"
	//"os/exec"
	//"strings"
	"time"
)

const (
	MEMO = iota
	CPU
	PROCESOS
)

var clientes = make(map[*websocket.Conn]string)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,

	CheckOrigin: func(r *http.Request) bool { return true },
}

func serverWs(w http.ResponseWriter, r *http.Request) {
	log.Println("1-------------------------------------")
	fmt.Println(r.Host)

	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("2-------------------------------------")
		log.Println(err)
	}
	defer ws.Close()

	reader(ws)
}

func reader(conn *websocket.Conn) {

	for {
		messageType, p, err := conn.ReadMessage()
		if err != nil {
			log.Printf("error: %v", err)
			delete(clientes, conn)
			break
		}

		fmt.Println(string(p))
		clientes[conn] = string(p)
		if err := conn.WriteMessage(messageType, p); err != nil {
			log.Println(err)
			return
		}
	}

}

func envioInfo() {
	for {
		for cliente := range clientes {

			var valor, err = strconv.Atoi(clientes[cliente])
			log.Println(valor)

			if err == nil {
				switch valor {
				case MEMO:
					/*data, err := ioutil.ReadFile("/proc/cpu_201113915")
					if err != nil {
						fmt.Println("File reading error", err)
						return
					}
					texto := string(data)*/

					if errW := cliente.WriteJSON("Salida PROCESOS"); err != nil {
						log.Printf("error: %v", errW)
						cliente.Close()
						delete(clientes, cliente)
					}

				case CPU:

					if errW := cliente.WriteJSON("Salida PROCESOS"); err != nil {
						log.Printf("error: %v", errW)
						cliente.Close()
						delete(clientes, cliente)
					}

				case PROCESOS:

					if errW := cliente.WriteJSON("Salida PROCESOS"); err != nil {
						log.Printf("error: %v", errW)
						cliente.Close()
						delete(clientes, cliente)
					}

				}
			}
		}
		log.Println("waiting...")
		time.Sleep(2000 * time.Millisecond)
	}
}

func main() {
	fs := http.FileServer(http.Dir("./css-Proyecto"))
	http.Handle("/", fs)
	http.HandleFunc("/ws", serverWs)
	go envioInfo()

	fmt.Println("Go WebSockets")
	log.Println("Listening on :3000...")
	err := http.ListenAndServe(":3000", nil)
	if err != nil {
		log.Fatal(err)
	}

	return
}
