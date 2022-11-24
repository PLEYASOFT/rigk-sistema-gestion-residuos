import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormStatementComponent } from './form-statement.component';

describe('FormStatementComponent', () => {
  let component: FormStatementComponent;
  let fixture: ComponentFixture<FormStatementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormStatementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
