import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainerBusinessComponent } from './maintainer-business.component';

describe('MaintainerBusinessComponent', () => {
  let component: MaintainerBusinessComponent;
  let fixture: ComponentFixture<MaintainerBusinessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintainerBusinessComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaintainerBusinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
