import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainerManagersComponent } from './maintainer-managers.component';

describe('MaintainerManagersComponent', () => {
  let component: MaintainerManagersComponent;
  let fixture: ComponentFixture<MaintainerManagersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintainerManagersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaintainerManagersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
