import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatementsDetailComponent } from './statements-detail.component';

describe('StatementsDetailComponent', () => {
  let component: StatementsDetailComponent;
  let fixture: ComponentFixture<StatementsDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatementsDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatementsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
