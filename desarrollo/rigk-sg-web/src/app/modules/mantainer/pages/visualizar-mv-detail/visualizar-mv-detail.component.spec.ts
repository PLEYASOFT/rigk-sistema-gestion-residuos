import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarMvDetailComponent } from './visualizar-mv-detail.component';

describe('VisualizarMvDetailComponent', () => {
  let component: VisualizarMvDetailComponent;
  let fixture: ComponentFixture<VisualizarMvDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisualizarMvDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisualizarMvDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
