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
	"io/ioutil"
	"strings"
	"time"
)

const (
	MEMO     = 0
	CPU      = 1
	PROCESOS = 2
)

type Mem struct {
	Mem_Tot    string `json:"mem_tot"`
	Mem_Usada  string `json:"mem_usada"`
	Porcentaje string `json:"porcentaje"`
}

type Cpu struct {
	Porcentaje string `json:"porcentaje"`
}

var clientes = make(map[*websocket.Conn]string)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,

	CheckOrigin: func(r *http.Request) bool { return true },
}

func serverWs(w http.ResponseWriter, r *http.Request) {
	fmt.Println(r.Host)

	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
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
					data, err := ioutil.ReadFile("/proc/memo_201113915")
					if err != nil {
						fmt.Println("File reading error", err)
						return
					}
					texto := string(data)

					var mem Mem

					datos := strings.Split(texto, "\n")

					mem.Mem_Tot = datos[0]
					mem.Mem_Usada = datos[1]
					mem.Porcentaje = datos[2]

					if errW := cliente.WriteJSON(mem); errW != nil {
						log.Printf("error: %v", errW)
						cliente.Close()
						delete(clientes, cliente)
					}
					break
				case CPU:
					data, err := ioutil.ReadFile("/proc/cpu_201113915")
					if err != nil {
						fmt.Println("File reading error", err)
						return
					}
					texto := string(data)

					var cpu Cpu

					datos := strings.Split(texto, "\n")

					cpu.Porcentaje = datos[0]

					if errW := cliente.WriteJSON(cpu); errW != nil {
						log.Printf("error: %v", errW)
						cliente.Close()
						delete(clientes, cliente)
					}
					break
				case PROCESOS:

					if errW := cliente.WriteJSON("Salida PROCESOS"); errW != nil {
						log.Printf("error: %v", errW)
						cliente.Close()
						delete(clientes, cliente)
					}
					break
				}

			}
		}
		if len(clientes) == 0 {
			log.Println("Listening on :3000...")
		}

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
