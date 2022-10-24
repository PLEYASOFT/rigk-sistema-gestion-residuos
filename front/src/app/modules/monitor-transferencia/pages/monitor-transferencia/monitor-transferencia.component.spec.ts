import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitorTransferenciaComponent } from './monitor-transferencia.component';

describe('MonitorTransferenciaComponent', () => {
  let component: MonitorTransferenciaComponent;
  let fixture: ComponentFixture<MonitorTransferenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonitorTransferenciaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonitorTransferenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
