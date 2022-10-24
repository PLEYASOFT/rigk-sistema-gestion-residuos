/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MantenedorContingenciaStarachComponent } from './mantenedor-contingencia-starach.component';

describe('MantenedorContingenciaStarachComponent', () => {
  let component: MantenedorContingenciaStarachComponent;
  let fixture: ComponentFixture<MantenedorContingenciaStarachComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MantenedorContingenciaStarachComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MantenedorContingenciaStarachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
