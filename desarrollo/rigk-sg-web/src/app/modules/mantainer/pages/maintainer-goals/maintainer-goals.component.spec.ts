import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainerGoalsComponent } from './maintainer-goals.component';

describe('MaintainerGoalsComponent', () => {
  let component: MaintainerGoalsComponent;
  let fixture: ComponentFixture<MaintainerGoalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintainerGoalsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaintainerGoalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
