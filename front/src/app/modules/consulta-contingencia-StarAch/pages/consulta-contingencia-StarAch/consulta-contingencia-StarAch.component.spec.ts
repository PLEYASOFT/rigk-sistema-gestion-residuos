/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ConsultaContingenciaStarAchComponent } from './consulta-contingencia-StarAch.component';

describe('ConsultaContingenciaStarAchComponent', () => {
  let component: ConsultaContingenciaStarAchComponent;
  let fixture: ComponentFixture<ConsultaContingenciaStarAchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultaContingenciaStarAchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaContingenciaStarAchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
