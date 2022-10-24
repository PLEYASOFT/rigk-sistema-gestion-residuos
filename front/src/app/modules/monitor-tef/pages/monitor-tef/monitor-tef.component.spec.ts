import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitorTefComponent } from './monitor-tef.component';

describe('MonitorTefComponent', () => {
  let component: MonitorTefComponent;
  let fixture: ComponentFixture<MonitorTefComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonitorTefComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonitorTefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
