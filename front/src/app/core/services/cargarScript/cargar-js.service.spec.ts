import { TestBed } from '@angular/core/testing';

import { CargarJsService } from './cargar-js.service';

describe('CargarJsService', () => {
  let service: CargarJsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CargarJsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
