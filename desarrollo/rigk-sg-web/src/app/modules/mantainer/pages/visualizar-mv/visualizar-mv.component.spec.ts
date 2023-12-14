import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarMvComponent } from './visualizar-mv.component';

describe('VisualizarMvComponent', () => {
  let component: VisualizarMvComponent;
  let fixture: ComponentFixture<VisualizarMvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisualizarMvComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisualizarMvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
