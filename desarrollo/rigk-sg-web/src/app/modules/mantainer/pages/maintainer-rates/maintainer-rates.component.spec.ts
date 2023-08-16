import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainerRatesComponent } from './maintainer-rates.component';

describe('MaintainerRatesComponent', () => {
  let component: MaintainerRatesComponent;
  let fixture: ComponentFixture<MaintainerRatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintainerRatesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaintainerRatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
