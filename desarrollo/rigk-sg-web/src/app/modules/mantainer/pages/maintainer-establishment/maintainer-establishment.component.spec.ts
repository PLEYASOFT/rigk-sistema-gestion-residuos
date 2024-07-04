import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainerEstablishmentComponent } from './maintainer-establishment.component';

describe('MaintainerEstablishmentComponent', () => {
  let component: MaintainerEstablishmentComponent;
  let fixture: ComponentFixture<MaintainerEstablishmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintainerEstablishmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaintainerEstablishmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
