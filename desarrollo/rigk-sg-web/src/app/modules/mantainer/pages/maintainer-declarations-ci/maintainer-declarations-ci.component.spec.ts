import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainerDeclarationsCiComponent } from './maintainer-declarations-ci.component';

describe('MaintainerDeclarationsCiComponent', () => {
  let component: MaintainerDeclarationsCiComponent;
  let fixture: ComponentFixture<MaintainerDeclarationsCiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintainerDeclarationsCiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaintainerDeclarationsCiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
