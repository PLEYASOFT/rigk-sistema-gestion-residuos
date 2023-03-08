import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainerDeclarationsProductorComponent } from './maintainer-declarations-productor.component';

describe('MaintainerDeclarationsProductorComponent', () => {
  let component: MaintainerDeclarationsProductorComponent;
  let fixture: ComponentFixture<MaintainerDeclarationsProductorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintainerDeclarationsProductorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaintainerDeclarationsProductorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
