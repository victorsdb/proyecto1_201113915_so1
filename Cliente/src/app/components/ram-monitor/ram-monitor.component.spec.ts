import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RamMonitorComponent } from './ram-monitor.component';

describe('RamMonitorComponent', () => {
  let component: RamMonitorComponent;
  let fixture: ComponentFixture<RamMonitorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RamMonitorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RamMonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
