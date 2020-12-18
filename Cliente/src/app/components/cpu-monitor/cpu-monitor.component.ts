import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Color, Label, SingleDataSet, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';
import { webSocket } from "rxjs/webSocket";

const subject = webSocket("ws://localhost:3000/ws");
    
var datos:number[] = Array.apply(null, new Array(150)).map(Number.prototype.valueOf,0);
let titulos:string[] = new Array(150);

@Component({
  selector: 'app-cpu-monitor',
  templateUrl: './cpu-monitor.component.html',
  styleUrls: ['./cpu-monitor.component.scss']
})
export class CpuMonitorComponent implements OnInit {

  public lineChartData: ChartDataSets[] = [
    {
      data: datos, 
      label: 'CPU Utilizado'
    },
  ];
  public lineChartLabels: Label[] = titulos;
  public lineChartOptions = { responsive: true };
  public lineChartColors: Color[] = [
    {
      borderColor: 'rgb(15, 82, 186, 255)',
      backgroundColor: 'rgba(0,0,0,0)',
    },
  ];
  public lineChartLegend = true;
  public lineChartType: ChartType = 'line';
  public lineChartPlugins = [];

  //PIE CHART
  public pieChartOptions: ChartOptions = { responsive: true };
  public pieChartLabels: Label[] = [['CPU', 'Libre'], ['CPU', 'Utilizado']];
  public pieChartData: SingleDataSet = [300, 500 ];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];
  public pieChartColors: Color[] = [
    {
      borderColor: 'rgb(255, 255, 255, 255)',
      backgroundColor: [
        'rgba(181,229,80,1)',
        'rgba(255,82,82,1)'
      ]
    },
  ];
  constructor() { 
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
    for(let i = 0; i <= 150; i++){
      titulos[i]=((300-i*2).toString());
    }
  }

  ngOnInit(): void {
    this.leer_datos();
  }

  leer_datos(){
    subject.subscribe(
      msg => {
        
        datos = datos.slice(1,150).concat(1);

        this.lineChartData = [
          {
            lineTension: 0.4,
            data: datos, 
            label: 'CPU Utilizado'
          },
        ]
        console.log(datos);
      }, 
      err => console.log(err), 
      () => console.log('complete')
    )
    
    subject.next(1);
  }

  
}
