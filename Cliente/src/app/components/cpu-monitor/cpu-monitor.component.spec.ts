import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpuMonitorComponent } from './cpu-monitor.component';

describe('CpuMonitorComponent', () => {
  let component: CpuMonitorComponent;
  let fixture: ComponentFixture<CpuMonitorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CpuMonitorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CpuMonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
