import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainerProductorDetailComponent } from './maintainer-productor-detail.component';

describe('MaintainerProductorDetailComponent', () => {
  let component: MaintainerProductorDetailComponent;
  let fixture: ComponentFixture<MaintainerProductorDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintainerProductorDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaintainerProductorDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
