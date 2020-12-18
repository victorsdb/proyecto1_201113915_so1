import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CpuMonitorComponent } from './components/cpu-monitor/cpu-monitor.component';
import { RamMonitorComponent } from './components/ram-monitor/ram-monitor.component';
import { MainComponent } from './components/main/main.component';

const routes: Routes = [
  { path: 'ram', component: RamMonitorComponent },
  { path: 'cpu', component: CpuMonitorComponent },
  { path: '', component: MainComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
