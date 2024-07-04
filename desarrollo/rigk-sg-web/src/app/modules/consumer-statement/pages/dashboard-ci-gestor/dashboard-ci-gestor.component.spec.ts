import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCiGestorComponent } from './dashboard-ci-gestor.component';

describe('DashboardCiGestorComponent', () => {
  let component: DashboardCiGestorComponent;
  let fixture: ComponentFixture<DashboardCiGestorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardCiGestorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardCiGestorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
