/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ConsultaContingenciaCasillaStiComponent } from './consulta-contingencia-casilla-sti.component';

describe('ConsultaContingenciaCasillaStiComponent', () => {
  let component: ConsultaContingenciaCasillaStiComponent;
  let fixture: ComponentFixture<ConsultaContingenciaCasillaStiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultaContingenciaCasillaStiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaContingenciaCasillaStiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
