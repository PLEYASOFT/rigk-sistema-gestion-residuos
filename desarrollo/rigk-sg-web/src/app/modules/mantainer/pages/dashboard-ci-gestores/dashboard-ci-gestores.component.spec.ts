import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCiGestoresComponent } from './dashboard-ci-gestores.component';

describe('DashboardCiGestoresComponent', () => {
  let component: DashboardCiGestoresComponent;
  let fixture: ComponentFixture<DashboardCiGestoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardCiGestoresComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardCiGestoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
