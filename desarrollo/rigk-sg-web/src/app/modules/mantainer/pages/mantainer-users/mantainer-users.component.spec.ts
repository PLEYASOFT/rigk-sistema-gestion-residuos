import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantainerUsersComponent } from './mantainer-users.component';

describe('MantainerUsersComponent', () => {
  let component: MantainerUsersComponent;
  let fixture: ComponentFixture<MantainerUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MantainerUsersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MantainerUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
