import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryStatementComponent } from './summary-statement.component';

describe('SummaryStatementComponent', () => {
  let component: SummaryStatementComponent;
  let fixture: ComponentFixture<SummaryStatementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SummaryStatementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SummaryStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
