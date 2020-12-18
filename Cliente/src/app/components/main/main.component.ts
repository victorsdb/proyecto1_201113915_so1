import { Component, OnInit } from '@angular/core';
import { webSocket } from "rxjs/webSocket";

const subject = webSocket("ws://localhost:3000/ws");
const subject2 = webSocket("ws://localhost:3000/ws");

class Proceso {
  id: string = "";
  pid: string = "";
  nombre: string = "";
  estado: string = "";
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})

export class MainComponent implements OnInit {
  
  public procesosEjecucion = 0;
  public procesosSuspendidos = 0;
  public proccesosDetenidos = 0;
  public procesosZombie = 0;
  public totalProcesos = 0;
  public todosprocesos: string[]= [];
  public strProcesos: Proceso[] = new Array;

  public respuesta =  "";

  constructor() { }

  ngOnInit(): void {
    this.leer_procesos();
  }

  leer_procesos(){
    subject.subscribe(
      msg => {
        var procesos = JSON.parse(JSON.stringify(msg));
        
        this.procesosEjecucion = procesos.ejecucion
        this.procesosSuspendidos = procesos.suspendidos
        this.proccesosDetenidos = procesos.detenidos
        this.procesosZombie = procesos.zombie
        this.totalProcesos = procesos.total
        var proc = procesos.lista + ""

        this.todosprocesos = proc.split('$');

        for (let pr of this.todosprocesos){

          var pro = pr.split(',')

          let p = new Proceso();
          p.id = pro[0]
          p.pid = pro[1]
          p.nombre = pro[2]
          p.estado = pro[3]

          this.strProcesos.push(p)
        }
        this.strProcesos = this.strProcesos.splice(1)
      }, 
      err => console.log(err), 
      () => console.log('complete')
    )
    subject.next(2);
  }

  matar_proceso(proceso:string){

    subject2.subscribe(
      msg => {
        var res = JSON.stringify(msg);
        this.respuesta = res
        console.log(this.respuesta)
      }, 
      err => console.log(err), 
      () => console.log('complete')
    )

    subject2.next(parseInt(proceso));
    console.log("mato proceso");
  }
}
