import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainerProductorComponent } from './maintainer-productor.component';

describe('MaintainerProductorComponent', () => {
  let component: MaintainerProductorComponent;
  let fixture: ComponentFixture<MaintainerProductorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintainerProductorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaintainerProductorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
